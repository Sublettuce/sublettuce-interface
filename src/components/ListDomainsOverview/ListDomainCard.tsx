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
import { openModal, closeAllModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import useStyles from "./DomainCard.styles";
import { IconTrash } from "@tabler/icons";
import { BigNumber, ethers } from "ethers";
import { useAccount, useSignMessage } from "wagmi";
import { useRef, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import tokens from "../../constants/tokens.json";
import { SUBLET_ADDRESS, INFINITE_DURATION } from "../../constants";
interface FormValues {
  price: string;
  tokenSymbol: "WETH" | "USDC";
  interval: "day" | "month" | "year";
  minEnabled: boolean;
  maxEnabled: boolean;
  minIntervals: number;
  maxIntervals: number | undefined;
  listType: "any" | "individual";
  subDomains: any;
}

function ModalForm({ domain }: { domain: any }) {
  const dbListings = collection(db, "listings");

  const listingProps = useRef<any>();
  const { address } = useAccount();

  const { data, error, isLoading, signMessage } = useSignMessage({
    async onSuccess(data) {
      closeAllModals();
      showNotification({
        color: "teal",
        title: "Listing successful",
        message: `Your have successfully listed subdomains for ${domain.name}`,
        icon: <IconCheck size={16} />,
      });
      await addDoc(dbListings, { ...listingProps.current, signature: data });
    },
    onError(data) {
      showNotification({
        color: "red",
        title: "Error signing transaction",
        message: data.message,
        icon: <IconCheck size={16} />,
      });
    },
  });

  const initialValues: FormValues = {
    price: "",
    tokenSymbol: "WETH",
    interval: "year",
    minEnabled: true,
    maxEnabled: false,
    minIntervals: 1,
    maxIntervals: undefined,
    listType: "any",
    subDomains: [{ label: "", key: randomId() }],
  };
  const form = useForm({ initialValues });

  async function submitListing() {
    const { values } = form;
    const token = tokens.find((token) => token.symbol == values.tokenSymbol);
    if (!token) return;
    const unitsPerInterval = ethers.utils.parseUnits(
      values.price,
      token.decimals
    );
    const interval = dayjs.duration(1, values.interval).asSeconds();
    const minDuration = dayjs
      .duration(values.minIntervals || 1, values.interval)
      .asSeconds();
    const maxDuration = values.maxIntervals
      ? dayjs.duration(values.maxIntervals || 1e10, values.interval).asSeconds()
      : INFINITE_DURATION;
    const nonce = BigNumber.from(ethers.utils.randomBytes(32));
    const subLabel = values.subDomains[0].label || null;

    let messageHash;
    if ((values.listType = "any")) {
      messageHash = ethers.utils.solidityKeccak256(
        [
          "address",
          "uint256",
          "uint64",
          "uint64",
          "uint64",
          "uint256",
          "address",
        ],
        [
          token.address,
          unitsPerInterval,
          interval,
          minDuration,
          maxDuration,
          nonce,
          SUBLET_ADDRESS,
        ]
      );
    } else {
      messageHash = ethers.utils.solidityKeccak256(
        [
          "address",
          "uint256",
          "uint64",
          "uint64",
          "uint64",
          "string",
          "uint256",
          "address",
        ],
        [
          token.address,
          unitsPerInterval,
          interval,
          minDuration,
          maxDuration,
          values.subDomains[0].label,
          nonce,
          SUBLET_ADDRESS,
        ]
      );
    }

    const messageHashBinary = ethers.utils.arrayify(messageHash);
    const props = {
      owner: address,
      name: domain.name,
      tokenAddress: token.address,
      unitsPerInterval: unitsPerInterval.toString(),
      interval: interval.toString(),
      minDuration: minDuration.toString(),
      maxDuration: maxDuration.toString(),
      subLabel,
      nonce: nonce.toString(),
    };
    listingProps.current = props;
    await signMessage({ message: messageHashBinary });
  }

  const tokenSelect = (
    <Select
      data={[
        { value: "WETH", label: "wETH" },
        { value: "USDC", label: "USDC" },
      ]}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      }}
      defaultValue="WETH"
      {...form.getInputProps("tokenSymbol")}
    />
  );
  return (
    <>
      <LoadingOverlay
        loader={
          <div className="text-center">
            <Loader />
            <Text align="center">Awaiting signature</Text>
          </div>
        }
        visible={isLoading}
        overlayBlur={2}
        radius="md"
      />
      <Group grow spacing="sm">
        <TextInput
          className="w-full max-w-[65%]"
          label="Price"
          rightSection={tokenSelect}
          placeholder="Payment per interval"
          styles={() => ({
            rightSection: {
              width: "90px",
            },
          })}
          {...form.getInputProps("price")}
        />
        <Select
          label="Interval"
          data={[
            { value: "day", label: "Daily" },
            { value: "month", label: "Monthly" },
            { value: "year", label: "Yearly" },
          ]}
          defaultValue="monthly"
          className="max-w-[30%]"
          {...form.getInputProps("interval")}
        />
      </Group>
      <Group grow>
        <NumberInput
          label={
            <Switch
              label={
                <Text color={!form.values.minEnabled ? "dimmed" : ""}>
                  Minimum
                </Text>
              }
              mb={2}
              {...form.getInputProps("minEnabled")}
              defaultChecked={true}
            />
          }
          rightSection={
            <Text size="sm" color={!form.values.minEnabled ? "dimmed" : ""}>
              {form.values.interval.charAt(0).toUpperCase() +
                form.values.interval.slice(1)}
              s
            </Text>
          }
          rightSectionWidth={80}
          min={1}
          disabled={!form.values.minEnabled}
          {...form.getInputProps("minIntervals")}
        />
        <NumberInput
          label={
            <Switch
              label={
                <Text color={!form.values.maxEnabled ? "dimmed" : ""}>
                  Maximum
                </Text>
              }
              mb={2}
              {...form.getInputProps("maxEnabled")}
            />
          }
          rightSection={
            <Text size="sm" color={!form.values.maxEnabled ? "dimmed" : ""}>
              {form.values.interval.charAt(0).toUpperCase() +
                form.values.interval.slice(1)}
              s
            </Text>
          }
          rightSectionWidth={80}
          min={1}
          disabled={!form.values.maxEnabled}
          {...form.getInputProps("maxIntervals")}
        ></NumberInput>
      </Group>
      <Divider
        mt="md"
        mb={2}
        label="Choose subdomains"
        labelPosition="center"
      />
      <Box mb="md">
        <SegmentedControl
          data={[
            { value: "any", label: "Any" },
            { value: "individual", label: "Individual" },
          ]}
          className="w-full"
          {...form.getInputProps("listType")}
        />
        {form.values.listType == "individual" ? (
          <>
            {form.values.subDomains.map((item: any, index: number) => (
              <Group key={item.key} mt="xs">
                <TextInput
                  placeholder="Subdomain"
                  withAsterisk
                  sx={{ flex: 1 }}
                  styles={() => ({
                    input: {
                      border: "none",
                      borderRadius: 0,
                      borderBottom: "1px solid",
                    },
                    rightSection: {
                      minWidth: "max-content",
                    },
                  })}
                  {...form.getInputProps(`subDomains.${index}.name`)}
                  rightSection={
                    <Text color="dimmed" className="min-w-max">
                      .{domain.name}
                    </Text>
                  }
                />
                <ActionIcon
                  color="red"
                  onClick={() => form.removeListItem("subDomains", index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
            <Group position="center" mt="xs">
              <Button
                variant="subtle"
                onClick={() =>
                  form.insertListItem("subDomains", {
                    name: "",
                    any: false,
                    key: randomId(),
                  })
                }
              >
                Add another subdomain
              </Button>
            </Group>
          </>
        ) : (
          <Text>Users will be able to rent any subdomain</Text>
        )}
      </Box>
      <Button fullWidth size="md" onClick={submitListing}>
        Confirm
      </Button>
    </>
  );
}

export default function ListDomainCard({ domain }: { domain: any }) {
  const { classes } = useStyles();

  return (
    <Card className={classes.card} shadow="sm" radius="md">
      <Group>
        <Container className={classes.scaled}>
          <Text size="lg">
            <b>{domain.name.slice(0, -4)}</b>
            {domain.name.slice(-4)}
          </Text>
        </Container>
        <Button
          onClick={() => {
            openModal({
              title: <Title order={2}>List subdomains for rent</Title>,
              children: <ModalForm domain={domain} />,
            });
          }}
        >
          List
        </Button>
      </Group>
    </Card>
  );
}
