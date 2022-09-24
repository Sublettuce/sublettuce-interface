import { Title } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import ListDomainsOverview from "../components/ListDomainsOverview";

const Home: NextPage = () => {
  return (
    <div className="p-10">
      <Head>
        <title>List subdomains</title>
      </Head>
      <Title order={2} mb={10}>
        Your domains
      </Title>
      <ListDomainsOverview />
    </div>
  );
};

export default Home;
