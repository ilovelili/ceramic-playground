// https://github.com/ceramicnetwork/js-did
import { DID } from 'dids'
import { createCeramic } from './ceramic'
import { getProvider } from './wallet'
import KeyDidResolver from 'key-did-resolver'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { ResolverRegistry } from 'did-resolver'
import { createDataStore } from './datastore'

declare global {
  interface Window {
    did?: DID
  }
}

const ceramicPromise = createCeramic()

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

document.getElementById('activate_ceramic')?.addEventListener('click', () => {
  const ceramicIframe = document.getElementById('ceramic_docs')
  if (ceramicIframe?.classList.contains('show')) {
    ceramicIframe?.classList.remove('show')
    document.getElementById('activate_ceramic')?.classList.remove('active')
  } else {
    document.getElementById('activate_ceramic')?.classList.add('active')
    ceramicIframe?.classList.add('show')
  }
})

document.getElementById('activate_idx')?.addEventListener('click', () => {
  const idxIframe = document.getElementById('idx_docs')
  if (idxIframe?.classList.contains('show')) {
    idxIframe?.classList.remove('show')
    document.getElementById('activate_idx')?.classList.remove('active')
  } else {
    document.getElementById('activate_idx')?.classList.add('active')
    idxIframe?.classList.add('show')
  }
})

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
      document.getElementById('instructions')?.classList.remove('hide')
    },
    (err) => {
      console.error('Failed to authenticate:', err)
      updateAlert('danger', err)
      document.getElementById('loader')?.classList.add('hide')
    }
  )
})
