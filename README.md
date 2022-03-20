# Ceramic Playground

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

start from: https://developers.ceramic.network/build/cli/quick-start/
