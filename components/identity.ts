import CeramicClient from "@ceramicnetwork/http-client";
import KeyDidResolver from "key-did-resolver";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import type { ResolverRegistry } from "did-resolver";
import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { DID } from "dids";
import { IDX } from "@ceramicstudio/idx";

// Clay testnet read / write node
const CeramicNode = "https://ceramic-clay.3boxlabs.com";

declare var window: any;

async function client({
  endpoint = CeramicNode,
  resolvers = null,
  address = "",
  provider = null,
  ceramicClient = null,
} = {}) {
  // step 1. init ceramic client
  let ethereum = window.ethereum;

  if (!ethereum) {
    return {
      error: "No ethereum wallet detected",
    };
  }

  let ceramic = ceramicClient || new CeramicClient(endpoint);

  // step 2. get resolvers
  if (!resolvers) {
    resolvers = {
      // it's very cool that we can add more resolvers here
      ...KeyDidResolver.getResolver(),
      ...ThreeIdResolver.getResolver(ceramic),
    };
  } else {
    resolvers = resolvers.reduce(
      (acc: ResolverRegistry, next: ResolverRegistry) => {
        if (next.requiresCeramic) {
          let resolver = next.resolver.call(this, ceramic);
          acc = {
            ...acc,
            ...resolver,
          };
        } else {
          acc = {
            ...acc,
            ...next.resolver,
          };
        }
        return acc;
      },
      {}
    );
  }

  // step 3. 3id connect
  if (!address) {
    const addresses = await ethereum.request({ method: "eth_requestAccounts" });
    address = addresses[0];
  }

  const threeIdConnect = new ThreeIdConnect();

  if (!provider) {
    provider = new EthereumAuthProvider(ethereum, address);
  }

  await threeIdConnect.connect(provider);

  // step 4. init 3 did
  const did = new DID({
    provider: threeIdConnect.getDidProvider(),
    resolver: resolvers,
  });

  ceramic.setDID(did);
  await ceramic.did.authenticate();

  // step 5: init IDX
  const idx = new IDX({ ceramic });

  return {
    ceramic,
    did,
    idx,
    error: null,
  };
}
