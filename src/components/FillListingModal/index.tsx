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
import { collection, addDoc, getDocs, DocumentData } from "firebase/firestore";
import dayjs from "dayjs";
import { formatInterval } from "../../utils/format";
import { SUBLET_ADDRESS } from "../../constants";
import {
  useContract,
  useSigner,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import subletABI from "../../abis/Sublet.json";
import Image from "next/image";
const namehash = require("@ensdomains/eth-ens-namehash");

import tokens from "../../constants/tokens.json";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";

interface FormValues {
  subLabel: string;
  intervalCount: number | undefined;
}

export default function ModalForm({ doc }: { doc: DocumentData }) {
  const token = tokens.find((token) => token.address == doc.tokenAddress);
  const initialValues: FormValues = {
    subLabel: doc.subLabel,
    intervalCount: undefined,
  };
  const form = useForm({ initialValues });
  const args = [
    {
      nameHash: namehash.hash(doc.name.toLowerCase()),
      subLabel: doc.subLabel.toLowerCase(),
      owner: doc.owner,
      payToken: doc.tokenAddress,
      unitsPerInterval: doc.unitsPerInterval,
      interval: doc.interval,
      intervalCount: form.values.intervalCount,
      minRentalDuration: doc.minDuration,
      maxRentalDuration: doc.maxDuration,
      isNameSpecific: doc.subLabel != null,
    },
    doc.signature,
    doc.nonce,
  ];
  console.log(args);
  const { config } = usePrepareContractWrite({
    addressOrName: SUBLET_ADDRESS,
    contractInterface: subletABI,
    functionName: "fulfillRentalListingUpfront",
    args,
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  return (
    <>
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
          data-autofocus={!doc.subLabel}
          readOnly={doc.subLabel}
          {...form.getInputProps("subLabel")}
          rightSection={
            <Text color="dimmed" className="min-w-max">
              .{doc.name}
            </Text>
          }
        />
        <NumberInput
          label="Duration"
          rightSection={`${formatInterval(doc.interval)}s`}
          rightSectionWidth={80}
          min={1}
          data-autofocus
          max={doc.maxDuration / doc.interval}
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
              BigNumber.from(doc.unitsPerInterval).mul(
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
      >
        Rent
      </Button>
    </>
  );
}
