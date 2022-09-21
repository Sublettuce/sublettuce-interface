import { SimpleGrid } from "@mantine/core";
import { useQuery } from "urql";
import { useAccount } from "wagmi";
import ListDomainCard from "./ListDomainCard";

export default function ListDomainsOverview() {
    const { address } = useAccount();

    const QUERY_DOMAINS = `
    {
        accounts(where: {id: "${address?.toLowerCase()}"}) {
            domains {
                name
            }
            wrappedDomains {
                id
                domain {
                    name
                }
            }
        }
    }
    `;
    const [result, reexecuteQuery] = useQuery({
        query: QUERY_DOMAINS,
    });
    if (!result.data) {
        return <div></div>;
    }
    const userDomains = result.data?.accounts[0];
    console.log(userDomains.wrappedDomains);
    return (
        <SimpleGrid
            cols={4}
            breakpoints={[
                { maxWidth: 1000, cols: 3 },
                { maxWidth: 755, cols: 2 },
                { maxWidth: 500, cols: 1 },
            ]}
        >
            {userDomains.wrappedDomains?.map((domain: any) => (
                <ListDomainCard key={domain.id} domain={domain.domain} />
            ))}
        </SimpleGrid>
    );
}
