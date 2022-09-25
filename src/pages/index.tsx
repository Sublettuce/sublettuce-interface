import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { createStyles, Title, Text, Button, Grid, Col } from "@mantine/core";
import Head from "next/head";
import { NextLink } from "@mantine/next";
import Image from "next/image";

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: `${theme.spacing.xl * 2}px ${theme.spacing.xl}px`,
    textAlign: "center",
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
      <Head>
        <title>Sublet</title>
      </Head>
      <Grid gutter={80} className="w-screen" justify="space-around">
        <Col span={12} md={5}>
          <Image
            src="/sublettuce-icon.svg"
            alt="icon"
            width={100}
            height={100}
          />
          <Title className={classes.title} order={2}>
            The marketplace for renting
            <span className={classes.highlight}>ENS subdomains</span>
          </Title>
          <Text>
            Unleashing the power of ENS subomain leasing using the new Name
            Wrapper contract!
          </Text>

          <NextLink href="/list">
            <Button
              variant="gradient"
              gradient={{ deg: 133, from: "teal", to: "cyan" }}
              size="lg"
              radius="md"
              mt="xl"
            >
              Get started
            </Button>
          </NextLink>
        </Col>
      </Grid>
    </div>
  );
};

export default Home;
