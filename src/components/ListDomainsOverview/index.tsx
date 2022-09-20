import { useQuery } from "urql";
import { useAccount } from "wagmi";

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

    return <div>{userDomains.wrappedDomains[0].domain.name}</div>;
}
