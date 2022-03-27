import { CeramicApi } from '@ceramicnetwork/common'
// https://developers.ceramic.network/tools/glaze/did-datastore/
import { DIDDataStore } from '@glazed/did-datastore'

declare global {
  interface Window {
    DataStore: DIDDataStore
  }
}

const basicProfileSchemaStreamID =
  'k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio'

const basicProfileDefinitionID = 'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic'

// this is a publish model
const publishedModel = {
  schemas: {
    basicProfile: `ceramic://${basicProfileSchemaStreamID}`,
  },
  definitions: {
    basicProfile: basicProfileDefinitionID,
  },
  tiles: {},
}

export function createDataStore(ceramic: CeramicApi): DIDDataStore {
  const datastore = new DIDDataStore({ ceramic, model: publishedModel })
  window.DataStore = datastore
  return datastore
}

/**
 * await window.DataStore.get("kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic")
  {twitter: 'mj', bio: 'i am min', name: 'min ju'}
 * 
 */

/***
--------------------------------------------------------------------------------------------------------------
ceramic show k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio
{
  "type": "object",
  "title": "BasicProfile",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "url": {
      "type": "string",
      "maxLength": 240
    },
    "name": {
      "type": "string",
      "maxLength": 150
    },
    "emoji": {
      "type": "string",
      "maxLength": 2
    },
    "image": {
      "$ref": "#/definitions/imageSources"
    },
    "gender": {
      "type": "string",
      "maxLength": 42
    },
    "birthDate": {
      "type": "string",
      "format": "date",
      "maxLength": 10
    },
    "background": {
      "$ref": "#/definitions/imageSources"
    },
    "description": {
      "type": "string",
      "maxLength": 420
    },
    "affiliations": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 140
      }
    },
    "homeLocation": {
      "type": "string",
      "maxLength": 140
    },
    "nationalities": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[A-Z]{2}$",
        "maxItems": 5
      },
      "minItems": 1
    },
    "residenceCountry": {
      "type": "string",
      "pattern": "^[A-Z]{2}$",
      "maxLength": 2
    }
  },
  "definitions": {
    "IPFSUrl": {
      "type": "string",
      "pattern": "^ipfs://.+",
      "maxLength": 150
    },
    "imageSources": {
      "type": "object",
      "required": [
        "original"
      ],
      "properties": {
        "original": {
          "$ref": "#/definitions/imageMetadata"
        },
        "alternatives": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/imageMetadata"
          }
        }
      }
    },
    "imageMetadata": {
      "type": "object",
      "required": [
        "src",
        "mimeType",
        "width",
        "height"
      ],
      "properties": {
        "src": {
          "$ref": "#/definitions/IPFSUrl"
        },
        "size": {
          "$ref": "#/definitions/positiveInteger"
        },
        "width": {
          "$ref": "#/definitions/positiveInteger"
        },
        "height": {
          "$ref": "#/definitions/positiveInteger"
        },
        "mimeType": {
          "type": "string",
          "maxLength": 50
        }
      }
    },
    "positiveInteger": {
      "type": "integer",
      "minimum": 1
    }
  }
}
--------------------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------------------
ceramic show kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic
{
  "name": "Basic Profile",
  "schema": "ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio",
  "description": "Basic profile information for a DID"
}
--------------------------------------------------------------------------------------------------------------
 * 
 */
