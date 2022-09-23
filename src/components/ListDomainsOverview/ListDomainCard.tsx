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
} from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import useStyles from "./DomainCard.styles";
import { IconTrash } from "@tabler/icons";
import { ethers } from "ethers";
import tokens from "../../constants/tokens.json";

function ModalForm({ domain }: { domain: any }) {
  const form = useForm({
    initialValues: {
      price: "",
      token: "weth",
      interval: "year",
      minEnabled: true,
      maxEnabled: false,
      minIntervals: 1,
      maxIntervals: undefined,
      listType: "any",
      subDomains: [{ label: "", key: randomId() }],
    },
  });

  function submitListing() {
    const { values } = form;
    const tokenAddress = tokens.find(
      (token) => token.symbol == "WETH"
    )?.address;
    const messageHash = ethers.utils.solidityKeccak256(
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
        tokenAddress,
        // unitsPerInterval,
        // interval,
        // minRentalDuration,
        // maxRentalDuration,
        // nonce,
        // Sublet.address,
      ]
    );
    const messageHashBinary = ethers.utils.arrayify(messageHash);
  }

  const tokenSelect = (
    <Select
      data={[
        { value: "weth", label: "wETH" },
        { value: "usdc", label: "USDC" },
      ]}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      }}
      defaultValue="weth"
      {...form.getInputProps("token")}
    />
  );
  return (
    <>
      {/* <LoadingOverlay visible={true} overlayBlur={2} radius="md" /> */}
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
            {form.values.subDomains.map((item, index) => (
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
      <Button fullWidth size="md">
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
