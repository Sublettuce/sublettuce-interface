import { Title } from "@mantine/core";
import type { NextPage } from "next";
import ListDomainsOverview from "../components/ListDomainsOverview";

const Home: NextPage = () => {
    return (
        <div className="p-10">
            <Title order={2} mb={10}>
                Your domains
            </Title>
            <ListDomainsOverview />
        </div>
    );
};

export default Home;
