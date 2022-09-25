import {
  ActionIcon,
  Button,
  Card,
  Container,
  Group,
  Select,
  NumberInput,
  Text,
  TextInput,
  Title,
  Switch,
  SegmentedControl,
  Box,
  Divider,
  LoadingOverlay,
  Loader,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { db } from "../../firebase";
import {
  DocumentData,
  deleteDoc,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";
import dayjs from "dayjs";
import { formatInterval } from "../../utils/format";
import { SUBLET_ADDRESS } from "../../constants";
import {
  useContract,
  useSigner,
  usePrepareContractWrite,
  useContractWrite,
  erc20ABI,
  useAccount,
  useWaitForTransaction,
} from "wagmi";
import subletABI from "../../abis/Sublet.json";
import Image from "next/image";
const namehash = require("@ensdomains/eth-ens-namehash");

import tokens from "../../constants/tokens.json";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { IconX } from "@tabler/icons";
import { useState } from "react";
import { closeAllModals } from "@mantine/modals";

interface FormValues {
  subLabel: string;
  intervalCount: number | undefined;
}

export default function ModalForm({
  docData,
  doc,
}: {
  doc: DocumentReference;
  docData: DocumentData;
}) {
  const token = tokens.find((token) => token.address == docData.tokenAddress);

  const initialValues: FormValues = {
    subLabel: docData.subLabel,
    intervalCount: undefined,
  };

  const { address } = useAccount();
  const { data: signer } = useSigner();
  const tokenContract = useContract({
    addressOrName: token?.address || "",
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  });
  const [isTxPending, setIsTxPending] = useState(false);

  const { config: approvalConfig } = usePrepareContractWrite({
    addressOrName: token?.address || "",
    contractInterface: erc20ABI,
    functionName: "approve",
    args: [SUBLET_ADDRESS, BigNumber.from(2).pow(256).sub(1)],
  });
  const {
    data: approvalData,
    isLoading: isApprovalLoading,
    writeAsync: approveTokens,
  } = useContractWrite(approvalConfig);

  const { isLoading: isApprovalPending } = useWaitForTransaction({
    hash: approvalData?.hash,
  });

  const form = useForm({ initialValues });
  const args = [
    {
      nameHash: namehash.hash(docData.name.toLowerCase()),
      subLabel: form.values.subLabel?.toLowerCase(),
      owner: docData.owner,
      payToken: docData.tokenAddress,
      unitsPerInterval: docData.unitsPerInterval,
      interval: docData.interval,
      intervalCount: form.values.intervalCount,
      minRentalDuration: docData.minDuration,
      maxRentalDuration: docData.maxDuration,
      isNameSpecific: docData.subLabel != null,
    },
    docData.signature,
    docData.nonce,
  ];
  const { config: fillConfig } = usePrepareContractWrite({
    addressOrName: SUBLET_ADDRESS,
    contractInterface: subletABI,
    functionName: "fulfillRentalListingUpfront",
    args,
  });
  const { isLoading: isFillLoading, writeAsync: submitFillListing } =
    useContractWrite(fillConfig);

  async function fillListing() {
    const allowance: BigNumber = await tokenContract.allowance(
      address,
      SUBLET_ADDRESS
    );

    const isApprovalRequired = allowance.lt(
      BigNumber.from(docData.unitsPerInterval).mul(
        form.values.intervalCount || 1
      )
    );
    console.log(isApprovalRequired);

    try {
      if (isApprovalRequired) {
        await approveTokens?.();
      }
    } catch (error: any) {
      showNotification({
        color: "red",
        title: "Error approving tokens",
        message: error.message,
        icon: <IconX size={16} />,
      });
      return;
    }

    await submitFillListing?.();
    closeAllModals();
    if (docData.subLabel != null) {
      await deleteDoc(doc);
    }
  }
  return (
    <>
      <LoadingOverlay
        loader={
          <div className="text-center">
            <Loader />
            <Text align="center">Approve your {token?.symbol}</Text>
          </div>
        }
        visible={isApprovalLoading}
        overlayBlur={2}
        radius="md"
      />
      <LoadingOverlay
        loader={
          <div className="text-center">
            <Loader />
            <Text align="center">Confirm transaction</Text>
          </div>
        }
        visible={isFillLoading}
        overlayBlur={2}
        radius="md"
      />
      <LoadingOverlay
        loader={
          <div className="text-center">
            <Loader />
            <Text align="center">Transaction pending</Text>
          </div>
        }
        visible={isApprovalPending}
        overlayBlur={2}
        radius="md"
      />
      <Group grow>
        <TextInput
          placeholder="Subdomain"
          label="Name"
          sx={{ flex: 1 }}
          styles={(theme) => ({
            input: {
              border: "none",
              borderRadius: 0,
              borderBottom: "1px solid",
            },
            rightSection: {
              minWidth: "max-content",
            },
          })}
          data-autofocus={!docData.subLabel}
          readOnly={docData.subLabel}
          {...form.getInputProps("subLabel")}
          rightSection={
            <Text color="dimmed" className="min-w-max">
              .{docData.name}
            </Text>
          }
        />
        <NumberInput
          label="Duration"
          rightSection={`${formatInterval(docData.interval)}s`}
          rightSectionWidth={80}
          min={1}
          data-autofocus
          max={docData.maxDuration / docData.interval}
          {...form.getInputProps("intervalCount")}
        />
      </Group>
      <Group mt="lg" mb="lg" spacing={3}>
        <Text mr={5}>Total:</Text>
        <Image
          src={`/icons/${token?.symbol}.png`}
          alt={token?.symbol}
          width="25"
          height="25"
        />
        <Text>
          {parseFloat(
            formatUnits(
              BigNumber.from(docData.unitsPerInterval).mul(
                form.values.intervalCount || 1
              ),
              token?.decimals
            )
          )}{" "}
          {token?.symbol}
        </Text>
      </Group>
      <Button
        disabled={!(form.values.subLabel && form.values.intervalCount)}
        fullWidth
        className="transition"
        size="md"
        onClick={fillListing}
      >
        Rent
      </Button>
    </>
  );
}
