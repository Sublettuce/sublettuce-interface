import { Button, Card, Container, Group, Text } from "@mantine/core";
import useStyles from "./DomainCard.styles";

export default function WrapDomainCard({ domain }: { domain: any }) {
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
        <Button>Wrap</Button>
      </Group>
    </Card>
  );
}
