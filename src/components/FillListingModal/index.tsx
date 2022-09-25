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
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { SUBLET_ADDRESS } from "../../constants";
import subletABI from "../../abis/Sublet.json";
const namehash = require("@ensdomains/eth-ens-namehash");

interface FormValues {
  subLabel: string;
  intervalCount: number | undefined;
}

export default function ModalForm({ doc }: { doc: DocumentData }) {
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
    </>
  );
}
