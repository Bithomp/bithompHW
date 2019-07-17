import Transport from '@ledgerhq/hw-transport-u2f'
import Xrp from "@ledgerhq/hw-app-xrp"
import { encode, encodeForSigning } from 'ripple-binary-codec'
import { computeBinaryTransactionHash } from 'ripple-hashes'
import { deriveAddress } from 'ripple-keypairs'
import { crypto } from 'bitcore-lib'
import {
  isSupported,
  getInfo,
  verifyPin,
  getPublicKey,
  signData
} from 'secalot-xrp-api'

const hz = 'W'+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+(![]+[])[((+!+[])+(+!+[]))]+(typeof ![])[(+!+[])]+([]+[]+([]).constructor)[(+[+!+[]+[+[]+[+[]]]])/((+!+[])+(+!+[]))/((+!+[])+(+!+[]))-(+!+[])]+([]+[]+[][[]])[(+!+[]+((+!+[])+(+!+[])))]+` `+(typeof [])[(+!+[])]+([]+[]+[][[]])[(+[+!+[]+[+[]]])/((+!+[])+(+!+[]))]+(!![]+[])[(+[])]+'h'+(typeof ![])[(+!+[])]+(typeof +[])[((+!+[])+(+!+[]))]+(RegExp().constructor.name)[((+!+[])+(+!+[]))+(+!+[]+((+!+[])+(+!+[])))]+`!`
const _0xd0ea=[hz,"\x6C\x6F\x67"]

exports.checkU2fStatus = async () => {
  return await isSupported();
}

exports.addressFromPublicKey = publicKey => {
  publicKey = publicKey.trim().toUpperCase()
  const address = deriveAddress(publicKey)
  return {
    publicKey: publicKey,
    address: address
  }
}

exports.ledgerGetAddress = async () => {
  const transport = await Transport.create()
  const xrp = new Xrp(transport)
  const result = await xrp.getAddress("44'/144'/0'/0/0")
  const { publicKey, address } = result
  return {
    publicKey: publicKey.toUpperCase(),
    address: address
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
    signedTransaction: signedTransaction,
    id: computeBinaryTransactionHash(signedTransaction)
  }
}

exports.ledgerAppConfiguration = async () => {
  const transport = await Transport.create()
  const xrp = new Xrp(transport)
  const result = await xrp.getAppConfiguration()
  return result.version
}

exports.secalotGetWalletInfo = async () => {
  return await getInfo(30);
}

exports.secalotVerifyPin = async pin => {
  return await verifyPin(30, pin)
}

exports.secalotGetAddress = async () => {
  const publicKey = await getPublicKey(30)
  const publicKeyHex = publicKey.toString("hex").toUpperCase()
  const address = deriveAddress(publicKeyHex)
  return {
    publicKey: publicKeyHex,
    address: address
  }
}

exports.secalotSignTransaction = async tx => {
  const encodetx = encodeForSigning(tx)
  const signature = await signData(70, encodetx)
  tx.TxnSignature = signature.toString("hex").toUpperCase()
  console[_0xd0ea[1]](_0xd0ea[0])
  const signedTransaction = encode(tx)
  return {
    signedTransaction: signedTransaction,
    id: computeBinaryTransactionHash(signedTransaction)
  }
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
    unsignedTxArray = unsignedTx.match(/.{1,140}/g)
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
    signedTransaction: signedTransaction,
    id: computeBinaryTransactionHash(signedTransaction)
  }
}
