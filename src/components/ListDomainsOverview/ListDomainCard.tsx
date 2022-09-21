import {
    Button,
    Card,
    Container,
    createStyles,
    Group,
    Text,
} from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => {
    const scaled: any = getRef("scaled");

    return {
        card: {
            position: "relative",
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.white,
            border: `1px solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[2]
            }`,

            [`&:hover .${scaled}`]: {
                transform: "scale(1.04)",
            },
        },
        scaled: {
            ref: scaled,
            flexGrow: 1,
            transition: "transform 500ms ease",
        },
    };
});

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
                <Button>List</Button>
            </Group>
        </Card>
    );
}
