import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "urql";
import { Title, LoadingOverlay } from "@mantine/core";

const Home: NextPage = () => {
  const router = useRouter();
  const { name } = router.query;

  const QUERY_DOMAIN = `
    {
        domains(where: {name: "${name}"}) {
            id
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
  return (
    <div className="p-10 text-center">
      <Title order={1} mb={10}>
        {name}
      </Title>
    </div>
  );
};

export default Home;
