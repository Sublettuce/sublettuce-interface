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

function ModalForm({ domain }: { domain: any }) {
    const form = useForm({
        initialValues: {
            listType: "any",
            subDomains: [{ label: "", key: randomId() }],
        },
    });
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
        />
    );
    return (
        <>
            {/* <LoadingOverlay visible={true} overlayBlur={2} radius="md" /> */}
            <Group grow spacing="sm">
                <NumberInput
                    className="w-full max-w-[65%]"
                    label="Price"
                    hideControls={true}
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
                    data={[{ value: "monthly", label: "Monthly" }]}
                    defaultValue="monthly"
                    className="max-w-[30%]"
                />
            </Group>
            <Group grow>
                <NumberInput
                    label={<Switch label="Minimum" mb={2} />}
                    rightSection={<Text size="sm">Months</Text>}
                    rightSectionWidth={80}
                    min={1}
                ></NumberInput>
                <NumberInput
                    label={
                        <Switch
                            label={<Text color="dimmed">Maximum</Text>}
                            mb={2}
                        />
                    }
                    rightSection={
                        <Text size="sm" color="dimmed">
                            Months
                        </Text>
                    }
                    rightSectionWidth={80}
                    min={1}
                    disabled
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
                                    {...form.getInputProps(
                                        `subDomains.${index}.name`
                                    )}
                                    rightSection={
                                        <Text
                                            color="dimmed"
                                            className="min-w-max"
                                        >
                                            .{domain.name}
                                        </Text>
                                    }
                                />
                                <ActionIcon
                                    color="red"
                                    onClick={() =>
                                        form.removeListItem("subDomains", index)
                                    }
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
                            title: (
                                <Title order={2}>
                                    List subdomains for rent
                                </Title>
                            ),
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
