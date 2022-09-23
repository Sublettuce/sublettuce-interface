import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { createStyles, Title, Text, Button, Grid, Col } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: `${theme.spacing.xl * 2}px ${theme.spacing.xl}px`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 36,
    fontWeight: 900,
    lineHeight: 1.3,
    marginBottom: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },
  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

const Home: NextPage = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Grid gutter={80} className="w-screen">
        <Col span={12} md={5}>
          <Title className={classes.title} order={2}>
            The marketplace for renting
            <span className={classes.highlight}>ENS subdomains</span>
          </Title>
          <Text color="dimmed">
            Sublet leverages the brand new ENS Namewrapper contract to unleash
            the power of ENS subletting
          </Text>

          <Button
            variant="gradient"
            gradient={{ deg: 133, from: "blue", to: "cyan" }}
            size="lg"
            radius="md"
            mt="xl"
          >
            Get started
          </Button>
        </Col>
      </Grid>
    </div>
  );
};

export default Home;
