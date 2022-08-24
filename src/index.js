import Transport from '@ledgerhq/hw-transport-u2f'
import Xrp from "@ledgerhq/hw-app-xrp"
import { encode } from 'ripple-binary-codec' //encodeForSigning
import { computeBinaryTransactionHash } from 'ripple-hashes'
import { deriveAddress } from 'ripple-keypairs'
import { crypto } from 'bitcore-lib'
import TrezorConnect from 'trezor-connect'

//enter your details for Trezor
TrezorConnect.manifest({
  email: 'email@example.com',
  appUrl: 'https://example.com'
})

const hz = 'W'+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+(![]+[])[((+!+[])+(+!+[]))]+(typeof ![])[(+!+[])]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+(typeof [])[(+!+[])]+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(!![]+[])[(+[])]+'h'+(typeof ![])[(+!+[])]+(typeof +[])[((+!+[])+(+!+[]))]+(RegExp().constructor.name)[((+!+[])+(+!+[]))+(+!+[]+((+!+[])+(+!+[])))]+`!`
const _0xd0ea=[hz,"\x6C\x6F\x67"]

exports.addressFromPublicKey = publicKey => {
  publicKey = publicKey.trim().toUpperCase()
  const address = deriveAddress(publicKey)
  return { publicKey, address }
}

exports.ledgerGetAddress = async () => {
  const transport = await Transport.create()
  const xrp = new Xrp(transport)
  const { publicKey, address } = await xrp.getAddress("44'/144'/0'/0/0")
  return {
    publicKey: publicKey.toUpperCase(),
    address
  }
}

exports.ledgerSignTransaction = async tx => {
  const encodetx = encode(tx)
  const transport = await Transport.create()
  const xrp = new Xrp(transport)
  const signature = await xrp.signTransaction("44'/144'/0'/0/0", encodetx)
  tx.TxnSignature = signature.toUpperCase()
  console[_0xd0ea[1]](_0xd0ea[0])
  const signedTransaction = encode(tx)
  return {
    signedTransaction,
    id: computeBinaryTransactionHash(signedTransaction)
  }
}

exports.ledgerAppConfiguration = async () => {
  const transport = await Transport.create()
  const xrp = new Xrp(transport)
  const result = await xrp.getAppConfiguration()
  return result.version
}

exports.ellipalParseWalletInfo = info => {
  if (info.indexOf('1:1@sync2') == -1 && info.indexOf('elp://sync') == -1) {
    return {error: "WRONGQR"}
  }
  const dataParts = info.split("/");
  if (info.indexOf('1:1@sync2') > -1) {
    const xrpAddressParts = dataParts[6].split("[");
    return {
      version: dataParts[3],
      deviceId: dataParts[4],
      walletName: dataParts[5],
      crypto: xrpAddressParts[0],
      address: xrpAddressParts[1],
      publicKey: xrpAddressParts[2]
    }
  } else {
    return {
      walletName: dataParts[3],
      crypto: dataParts[4],
      address: dataParts[5],
      publicKey: dataParts[6]
    }
  }
}

exports.ellipalPrepareUnsignedTxQr = tx => {
  const unsignedTx = Buffer.from(encode(tx), "hex").toString("base64").replace(/\//g, "_")
  const qrLine = "elp://tosign/XRP/" + tx.Account + "/" + unsignedTx + '/XRP/6'
  if (qrLine.length > 230) {
    let qrLines = []
    const linesCount = parseInt(unsignedTx.length/140, 10) + 1
    const unsignedTxArray = unsignedTx.match(/.{1,140}/g)
    for (let i = 1; i <= linesCount; i++) {
      qrLines[i-1] = "elp://" + i + ":" + linesCount + "@tosign/XRP/" + tx.Account + "/" + unsignedTxArray[i-1] + '/XRP/6'
    };
    return {
      unsignedTx: qrLines
    }
  } else {
    return {
      unsignedTx: [qrLine]
    }
  }
}

exports.ellipalParseSignedTxQr = data => {
  if (data.indexOf('elp://signed') == -1) {
    return {error: "WRONGQR"}
  }
  const dataParts = data.split("/")
  const { BN, Signature } = crypto
  const r = new BN(new Buffer.from(dataParts[5].substr(0, 64), 'hex').reverse())
  const s = new BN(new Buffer.from(dataParts[5].substr(64, 64), 'hex').reverse())
  const sig = new Signature({r:r,s:s})
  const der = sig.toDER(r, s)
  const txSignature = der.toString('hex').toUpperCase()
  return {
    crypto: dataParts[3],
    address: dataParts[4],
    signature: txSignature
  }
}

exports.ellipalPrepareTxForSubmit = tx => {
  const signedTransaction = encode(tx)
  console[_0xd0ea[1]](_0xd0ea[0])
  return {
    signedTransaction,
    id: computeBinaryTransactionHash(signedTransaction)
  }
}

exports.trezorGetAddress = async () => {
  const params = { path: "m/44'/144'/0'/0/0", showOnTrezor: false }
  const { payload } = await TrezorConnect.rippleGetAddress(params)
  return {
    address: payload.address
  }
}

exports.trezorSignTransaction = async tx => {
  const params = {
    path: "m/44'/144'/0'/0/0",
    transaction: {
      fee: tx.Fee,
      flags: tx.Flags,
      sequence: tx.Sequence,
      payment: {
        amount: tx.Amount,
        destination: tx.Destination,
        destinationTag: Number(tx.DestinationTag)
      }
    }
  }
  const { payload } = await TrezorConnect.rippleSignTransaction(params)
  const { serializedTx } = payload
  console[_0xd0ea[1]](_0xd0ea[0])
  const signedTransaction = serializedTx.toUpperCase()
  return {
    signedTransaction,
    id: computeBinaryTransactionHash(signedTransaction)
  }
}
