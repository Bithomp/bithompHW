import 'babel-polyfill'
import Transport from '@ledgerhq/hw-transport-u2f'
import Xrp from "@ledgerhq/hw-app-xrp"
import { encode, encodeForSigning } from 'ripple-binary-codec'
import { computeBinaryTransactionHash } from 'ripple-hashes'
import { deriveAddress } from 'ripple-keypairs'
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
