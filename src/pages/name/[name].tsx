import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "urql";
import { Title, LoadingOverlay, List, ThemeIcon } from "@mantine/core";
import { IconClipboardCheck, IconClock, IconSubtask } from "@tabler/icons";
import dayjs from "dayjs";

const Home: NextPage = () => {
  const router = useRouter();
  const { name } = router.query;

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
    </div>
  );
};

export default Home;
