// https://github.com/ceramicnetwork/js-did
import { DID } from 'dids'
import { createCeramic } from './ceramic'
import { getProvider } from './wallet'
import KeyDidResolver from 'key-did-resolver'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { ResolverRegistry } from 'did-resolver'
import { createDataStore } from './datastore'
import IpfsHttpClient from 'ipfs-http-client'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { StreamID } from '@ceramicnetwork/streamid'

declare global {
  interface Window {
    did?: DID
  }
}

let fileBuffer: any
const ceramicPromise = createCeramic()

/**
 * // // https://docs.infura.io/infura/networks/ipfs/getting-started/authenticate-requests
  // const basicAuth = Buffer.from(
  //   `${ipfs_project_id}:${ipfs_project_secret}`
  // ).toString("base64");

  // const ipfs = create({
  //   host: ipfs_host,
  //   port: ipfs_port,
  //   protocol: "https",
  //   headers: {
  //     authorization: `Basic ${basicAuth}`,
  //   },
  // });
 * 
 */

const ipfs = IpfsHttpClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const authenticate = async (): Promise<String> => {
  const [ceramic, provider] = await Promise.all([ceramicPromise, getProvider()])
  // The Key DID Method is the most simple DID method. It simply encodes a public key in the DID string,
  // and when resolved converts this public key into a DID Document.
  // https://developers.ceramic.network/docs/advanced/standards/accounts/key-did/
  const keyDidResolver = KeyDidResolver.getResolver()

  // 3ID DID is a powerful DID method that supports multiple keys, key rotations, and revocations
  // The DID Document for the 3ID DID Method is implemented using a Ceramic Tile Document
  // https://developers.ceramic.network/docs/advanced/standards/accounts/3id-did/
  const threeIdResolver = ThreeIdResolver.getResolver(ceramic)

  const resolver: ResolverRegistry = {
    ...keyDidResolver,
    ...threeIdResolver,
  }

  const did = new DID({
    provider,
    resolver,
  })

  await did.authenticate()
  await ceramic.setDID(did)

  const datastore = createDataStore(ceramic)
  return datastore.id
}

const updateAlert = (status: string, message: string) => {
  const alert = document.getElementById('alerts')
  if (alert !== null) {
    alert.textContent = message
    alert.classList.add(`alert-${status}`)
    alert.classList.remove('hide')
    setTimeout(() => {
      alert.classList.add('hide')
    }, 5000)
  }
}

// https://developers.ceramic.network/reference/stream-programs/tile-document/
const createDocument = async (content: any): Promise<StreamID> => {
  // The following call will fail if the Ceramic instance does not have an authenticated DID
  const doc = await TileDocument.create(window.ceramic, content)
  // The stream ID of the created document can then be accessed as the `id` property
  return doc.id
}

const updateDocument = async (id: string, content: any): Promise<void> => {
  // First, we need to load the document
  const doc = await TileDocument.load(window.ceramic, id)
  // The following call will fail if the Ceramic instance does not have an authenticated DID
  await doc.update(content)
}

const loadDocument = async (id: string): Promise<TileDocument> => {
  return await TileDocument.load(window.ceramic, id)
}

document.getElementById('bauth')?.addEventListener('click', () => {
  document.getElementById('loader')?.classList.remove('hide')
  authenticate().then(
    (id) => {
      const userDid = document.getElementById('userDID')
      const concatId = id.split('did:3:')[1]
      if (userDid !== null) {
        userDid.textContent = `${concatId.slice(0, 4)}...${concatId.slice(
          concatId.length - 4,
          concatId.length
        )}`
      }
      updateAlert('success', `Successfully connected with ${id}`)
      document.getElementById('loader')?.classList.add('hide')
      document.getElementById('bauth')?.classList.add('hide')

      document.getElementById('fileUploader')?.classList.remove('hide')
      document.getElementById('instructions')?.classList.remove('hide')
    },
    (err) => {
      console.error('Failed to authenticate:', err)
      updateAlert('danger', err)
      document.getElementById('loader')?.classList.add('hide')
    }
  )
})

document.getElementById('fileUploadInput')?.addEventListener('change', (event: any) => {
  event.preventDefault()
  const file = event.target.files[0]
  // convert file to buffer
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)

  reader.onload = function () {
    fileBuffer = this.result
    console.log(fileBuffer)
  }
})

document.getElementById('fileUploadForm')?.addEventListener('submit', async (event: any) => {
  event.preventDefault()

  if (!fileBuffer) {
    alert('please select file to upload')
    return
  }

  for await (const result of ipfs.add(fileBuffer)) {
    let cid = result.path
    let streamId = await createDocument({ cid })
    let ceramicDoc = await loadDocument(streamId.toString())

    let resultEl = document.getElementById('result')
    resultEl!.innerHTML = `
      <p>Your IPFS CID is ${cid}</p>
      <p>Your Ceramic Stream ID is ${streamId}</p>
    `
  }
})
