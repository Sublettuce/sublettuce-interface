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
  Table,
  Button,
  TextInput,
  createStyles,
} from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import {
  IconClipboardCheck,
  IconClock,
  IconSubtask,
  IconTags,
  IconList,
} from "@tabler/icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { collection, DocumentData, query, where } from "firebase/firestore";
import { formatUnits } from "ethers/lib/utils";
import tokens from "../../constants/tokens.json";
import Image from "next/image";
import { BigNumber } from "ethers";
import { INFINITE_DURATION } from "../../constants";
import FillListingModal from "../../components/FillListingModal";
import { useEffect } from "react";

dayjs.extend(duration);

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

function formatInterval(interval: string) {
  console.log(interval);
  console.log(dayjs.duration(1, "day").asSeconds().toString());
  let formattedInterval;
  switch (interval) {
    case dayjs.duration(1, "day").asSeconds().toString():
      formattedInterval = "Day";
      break;
    case dayjs.duration(1, "month").asSeconds().toString():
      formattedInterval = "Month";
      break;
    case dayjs.duration(1, "year").asSeconds().toString():
      formattedInterval = "Year";
      break;
  }
  return formattedInterval;
}

function formatRate(data: DocumentData) {
  const token = tokens.find((token) => token.address == data.tokenAddress);
  if (!token) return;
  const formattedPrice = formatUnits(data.unitsPerInterval, token.decimals);
  const formattedInterval = formatInterval(data.interval);
  const rate = `${parseFloat(formattedPrice)}/${formattedInterval}`;
  return rate;
}

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

  const [listings, listingsLoading] = useCollection(
    router.isReady
      ? query(collection(db, "listings"), where("name", "==", name))
      : null,
    {}
  );
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
          <Accordion multiple variant="separated" defaultValue={["listings"]}>
            <Accordion.Item className={classes.item} value="listings">
              <Accordion.Control>
                <Group spacing="xs">
                  <IconTags />
                  <Title size="sm">Subdomains listed by owner</Title>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <LoadingOverlay visible={listingsLoading} />
                {!listingsLoading && listings && (
                  <Table>
                    <thead>
                      <tr>
                        <th>Sublabel</th>
                        <th>Rate</th>
                        <th>Min. duration</th>
                        <th>Max. duration</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.docs.map((doc, i) => (
                        <tr key={i}>
                          <td>{doc.data().subLabel}</td>
                          <td>
                            <Group spacing={5}>
                              <Image
                                src={`/icons/${
                                  tokens.find(
                                    (token) =>
                                      token.address == doc.data().tokenAddress
                                  )?.symbol
                                }.png`}
                                alt="USDC"
                                width="20"
                                height="20"
                              />
                              {formatRate(doc.data())}
                            </Group>
                          </td>
                          <td>
                            {doc.data().minDuration / doc.data().interval}{" "}
                            {formatInterval(doc.data().interval)}
                            {doc.data().minDuration / doc.data().interval > 1 &&
                              "s"}
                          </td>
                          <td>
                            {/* TODO: clean up this mess */}
                            {BigNumber.from(doc.data().maxDuration).eq(
                              INFINITE_DURATION
                            ) ? (
                              "None"
                            ) : (
                              <>
                                {doc.data().maxDuration / doc.data().interval}{" "}
                                {formatInterval(doc.data().interval)}
                                {doc.data().maxDuration / doc.data().interval >
                                  1 && "s"}
                              </>
                            )}
                          </td>
                          <td>
                            <Button
                              onClick={() => {
                                openModal({
                                  title: "Subscribe to newsletter",
                                  children: (
                                    <FillListingModal doc={doc.data()} />
                                  ),
                                });
                              }}
                            >
                              Rent
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="offers">
              <Accordion.Control>
                <Group spacing="xs">
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
