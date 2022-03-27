# Ceramic Playground

## The Ceramic Stack

### Framework

Frameworks abstract away much of the complexity and configuration of the underlying stack, providing developers with a simple entrypoint into Ceramic development.

[Self.ID SDK](https://developers.ceramic.network/reference/self-id/)

### Middleware

Middleware provides developers with additional functionality and convenience.

[Glaze Suite](https://developers.ceramic.network/reference/glaze/)

### Data models

Data models are collections of one or more streams, specified by their schemas and relationships, that define a single data structure on Ceramic. Data models form the basis of composability on Ceramic. When multiple applications reuse the same data model, they can reuse the same data. Typically, data models are used to represent an application feature such as a social graph or a user profile.

[Data Model Registry](https://developers.ceramic.network/docs/advanced/standards/data-models/data-model-universe/)

### Streams

Streams are individual instances of state on the Ceramic network. Every stream that is created on Ceramic must specify its streamcode, which is a script that contains the processing logic used to transform a stream's current state into the next state upon receipt of a new transaction. In general, you can think of streamcode as reusable state processing logic and streams as the individual states it generates.

Ceramic supports two types of streams currently:

- [tile documents](https://developers.ceramic.network/docs/advanced/standards/stream-programs/tile-document/) which store mutable JSON documents with schema validation

- [CAIP-10 links](https://developers.ceramic.network/docs/advanced/standards/stream-programs/caip10-link/) which store a link between a Web3 wallet account and a Ceramic account

### Accounts

Accounts are user entities on Ceramic that can own streams and submit transactions to those streams. Ceramic accounts conform to the standard decentralized identifier (DID) specification, as outlined by the Decentralized Identity Foundation (DIF)

The DID client currently supports two different account types:

- [3ID DID](https://developers.ceramic.network/docs/advanced/standards/accounts/3id-did/) allows controlling a Ceramic account from multiple Web3 wallet addresses
- [Key DID](https://developers.ceramic.network/docs/advanced/standards/accounts/key-did/) can only be controlled by a single Web3 wallet address

### Clients

Clients libraries allow applications to connect to a Ceramic node

- [JS Http Client](https://developers.ceramic.network/reference/core-clients/ceramic-http/)
- [JS Core Client](https://developers.ceramic.network/build/javascript/installation/#js-core-client)

### Network APIs

The Ceramic HTTP API is the lowest-level interface for Ceramic. It is used under the hood by every client and node to communicate. Unless application developers have a specific need to use HTTP, most never need to interact with this API directly

- [Ceramic Http API](https://developers.ceramic.network/build/http/api/)

## Ceramic CLI

### Launch a local Ceramic node

#### Install CLI

```bash
npm install -g node-pre-gyp
npm install -g @ceramicnetwork/cli
```

### Install IPFS

[IPFS-desktop](https://github.com/ipfs/ipfs-desktop) is a fastest way to install IPFS on local environment

#### Launch the Ceramic node

```bash
# by default ceramic will connect to localhost, must have ipfs daemon running
ceramic daemon # https://localhost:7007
```

#### Configure Ceramic Network

(Optional) By default, the JS CLI starts a node on the **Clay Testnet**. Specify this using the `--network` option. Note, the CLI can not be used with Mainnet.

```bash
ceramic daemon --network=testnet-clay
```

#### Configure a node URL

```bash
ceramic config set ceramicHost 'https://yourceramicnode.com'
```

### Launch a Ceramic node on cloud

The fastest way to deploy a Ceramic node on cloud (AWS ECS Farget) is to use this [Terraform module](https://github.com/ceramicnetwork/terraform-aws-ceramic)

reminder:
start from: https://developers.ceramic.network/build/cli/quick-start/

## Ceramic JS Http Client

```bash
npm install @ceramicnetwork/http-client
```

## Glazed Suite

### DID Data Store

[DID Data Store](https://developers.ceramic.network/tools/glaze/did-datastore/) is a runtime library that allows any application to store and retrieve data from a Ceramic account's personal datastore, with support for public and private data. The DID DataStore is an implementation of the [Identity Index (IDX) protocol](https://github.com/ceramicnetwork/CIP/blob/main/CIPs/CIP-11/CIP-11.md), allowing to associate records to a DID.

![IDX](https://developers.ceramic.network/images/idx-architecture.png)
