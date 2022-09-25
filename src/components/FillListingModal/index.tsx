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

interface FormValues {
  subLabel: string;
  intervalCount: number | undefined;
}

export default function ModalForm({ doc }: { doc: DocumentData }) {
  console.log(doc.subLabel);
  const initialValues: FormValues = {
    subLabel: doc.subLabel,
    intervalCount: undefined,
  };
  const form = useForm({ initialValues });
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
        />
      </Group>
    </>
  );
}
