import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "urql";
import {
  Title,
  LoadingOverlay,
  List,
  ThemeIcon,
  Box,
  Group,
  Accordion,
  createStyles,
} from "@mantine/core";
import {
  IconClipboardCheck,
  IconClock,
  IconSubtask,
  IconTags,
  IconList,
} from "@tabler/icons";
import dayjs from "dayjs";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    minHeight: 650,
  },

  title: {
    marginBottom: theme.spacing.xl * 1.5,
  },

  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,

    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

const Home: NextPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const { classes } = useStyles();

  const QUERY_DOMAIN = `
    {
        domains(where: {name: "${name}"}) {
            id
            subdomainCount
            owner {
              id
            }
            registration {
                registrationDate
                expiryDate
            }
        }
    }
    `;
  const [result, reexecuteQuery] = useQuery({
    query: QUERY_DOMAIN,
  });

  if (result.error) {
    return <div className="text-center">Error fetching domain</div>;
  }

  if (!result.data) {
    return <LoadingOverlay visible={true} />;
  }

  const domain = result.data.domains[0];

  if (!domain) {
    return <div className="text-center">Unregistered domain</div>;
  }
  console.log(result.data);
  return (
    <div className="p-10 m-auto w-fit">
      <Group spacing="xl" align="flex-start">
        <Box
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
            padding: theme.spacing.xl,
            borderRadius: theme.radius.lg,
            flexGrow: 1,
          })}
        >
          <Title mb={10} align="center">
            {name}
          </Title>
          <List spacing="xs" size="sm">
            <List.Item
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconClipboardCheck size={16} />
                </ThemeIcon>
              }
            >
              Registered:{" "}
              {dayjs
                .unix(domain.registration.registrationDate)
                .format("DD/MM/YYYY")}
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon color="grey" size={24} radius="xl">
                  <IconClock size={16} />
                </ThemeIcon>
              }
            >
              Expires:{" "}
              {dayjs.unix(domain.registration.expiryDate).format("DD/MM/YYYY")}
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon color="blue" size={24} radius="xl">
                  <IconSubtask size={16} />
                </ThemeIcon>
              }
            >
              {domain.subdomainCount} registered subdomains
            </List.Item>
          </List>
        </Box>
        <Box className="flex-grow">
          <Accordion multiple variant="separated">
            <Accordion.Item className={classes.item} value="reset-password">
              <Accordion.Control>
                <Group align="flex-start">
                  <IconTags />

                  <Title size="sm">Subdomains listed by owner</Title>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>jifjeosfi</Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="another-account">
              <Accordion.Control>
                <Group>
                  <IconList />
                  <Title size="sm">Offers</Title>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>heifeof</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Box>
      </Group>
    </div>
  );
};

export default Home;
