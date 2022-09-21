import {
    ActionIcon,
    Button,
    Card,
    Container,
    Group,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import useStyles from "./DomainCard.styles";
import { IconTrash } from "@tabler/icons";

function ModalForm({ domain }: { domain: any }) {
    const form = useForm({
        initialValues: {
            subDomains: [{ label: "", any: true, key: randomId() }],
        },
    });
    return (
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
            <Group position="center" mt="md">
                <Button
                    onClick={() =>
                        form.insertListItem("subDomains", {
                            name: "",
                            any: false,
                            key: randomId(),
                        })
                    }
                >
                    Add subdomain
                </Button>
            </Group>
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
