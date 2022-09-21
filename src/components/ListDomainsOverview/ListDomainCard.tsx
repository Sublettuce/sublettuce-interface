import { Button, Card, Container, Group, Text, Title } from "@mantine/core";
import useStyles from "./DomainCard.styles";
import { openModal, closeAllModals } from "@mantine/modals";

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
                            children: <></>,
                            centered: true,
                        });
                    }}
                >
                    List
                </Button>
            </Group>
        </Card>
    );
}
