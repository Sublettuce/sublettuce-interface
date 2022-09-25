import { SimpleGrid, Title } from "@mantine/core";
import { useQuery } from "urql";
import { useAccount } from "wagmi";
import ListDomainCard from "./ListDomainCard";
import WrapDomainCard from "./WrapDomainCard";

export default function ListDomainsOverview() {
  const { address } = useAccount();

  const QUERY_DOMAINS = `
    {
        accounts(where: {id: "${address?.toLowerCase()}"}) {
            domains {
                name
                labelName
                registration {
                  registrationDate
                  expiryDate
              }
            }
            wrappedDomains {
                id
                expiryDate
                domain {
                    name
                    labelName
                }
            }
        }
    }
    `;
  const [result, reexecuteQuery] = useQuery({
    query: QUERY_DOMAINS,
  });
  if (!result.data) {
    return <div>Error fetching domains</div>;
  }
  const userDomains = result.data?.accounts[0];
  if (!userDomains?.domains.length && !userDomains?.wrappedDomains.length) {
    return <div>You own no domains</div>;
  }
  return (
    <div>
      <Title order={4}>Wrapped</Title>
      {userDomains.wrappedDomains.length > 0 ? (
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 1000, cols: 3 },
            { maxWidth: 755, cols: 2 },
            { maxWidth: 500, cols: 1 },
          ]}
          mb={60}
        >
          {userDomains.wrappedDomains?.map((domain: any) => (
            <ListDomainCard key={domain.id} wDomain={domain} />
          ))}
        </SimpleGrid>
      ) : (
        "Wrap your domains below to list subdomains"
      )}

      <Title order={4}>Unwrapped</Title>
      {userDomains.domains.length > 0 ? (
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 1000, cols: 3 },
            { maxWidth: 755, cols: 2 },
            { maxWidth: 500, cols: 1 },
          ]}
        >
          {userDomains.domains?.map((domain: any) => (
            <WrapDomainCard key={domain.id} domain={domain} />
          ))}
        </SimpleGrid>
      ) : (
        "All domains wrapped"
      )}
    </div>
  );
}
