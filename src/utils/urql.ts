import { createClient } from "@urql/core";

export const urqlClient = createClient({
  url: process.env.NEXT_PUBLIC_ENS_SUBGRAPH_LOCAL || "",
});
