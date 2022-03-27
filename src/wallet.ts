import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { DIDProvider } from 'dids'
import Web3Modal from 'web3modal'
import Torus from '@toruslabs/torus-embed'
import Authereum from 'authereum'
import Fortmatic from 'fortmatic'

export const threeID = new ThreeIdConnect()

async function getWeb3Modal() {
  const web3modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions: {
      torus: {
        package: Torus,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: 'e87f83fb85bf4aa09bdf6605ebe144b7',
        },
      },
      fortmatic: {
        package: Fortmatic,
        options: {
          key: 'pk_live_EC842EEAC7F08995',
        },
      },
      authereum: {
        package: Authereum,
        options: {},
      },
    },
  })

  return web3modal
}

export async function getProvider(): Promise<DIDProvider> {
  const ethProvider = await (await getWeb3Modal()).connect()
  const addresses = await ethProvider.enable()
  await threeID.connect(new EthereumAuthProvider(ethProvider, addresses[0]))
  return threeID.getDidProvider()
}
