import { Title } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { name } = router.query;

  return (
    <div className="p-10 text-center">
      <Title order={1} mb={10}>
        {name}
      </Title>
    </div>
  );
};

export default Home;
