import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import Xrp from "@ledgerhq/hw-app-xrp";
import { encode } from "ripple-binary-codec"; //encodeForSigning
import { computeBinaryTransactionHash } from "ripple-hashes";
import { deriveAddress } from "ripple-keypairs";
import { crypto } from "bitcore-lib";
//import TrezorConnect from "@trezor/connect-web";

//enter your details for Trezor
/*
TrezorConnect.manifest({
  email: "email@example.com",
  appUrl: "https://example.com",
});
*/

global.bithomphw = {};

bithomphw.addressFromPublicKey = (publicKey) => {
  publicKey = publicKey.trim().toUpperCase();
  const address = deriveAddress(publicKey);
  return { publicKey, address };
};

bithomphw.ledgerEstablishConnection = () => {
  return TransportWebHID.create().then((transport) => new Xrp(transport));
};

bithomphw.ledgerAppConfiguration = async (xrp) => {
  const result = await xrp.getAppConfiguration();
  return result.version;
};

bithomphw.ledgerGetAddress = async (xrp, path = "44'/144'/0'/0/0") => {
  const { publicKey, address } = await xrp.getAddress(path);
  return {
    publicKey: publicKey.toUpperCase(),
    address,
  };
};

bithomphw.ledgerSignTransaction = async (xrp, tx, path = "44'/144'/0'/0/0") => {
  const encodetx = encode(tx);
  const signature = await xrp.signTransaction(path, encodetx);
  tx.TxnSignature = signature.toUpperCase();
  const signedTransaction = encode(tx);
  return {
    signedTransaction,
    id: computeBinaryTransactionHash(signedTransaction),
  };
};

bithomphw.ellipalParseWalletInfo = (info) => {
  if (info.indexOf("1:1@sync2") == -1 && info.indexOf("elp://sync") == -1) {
    return { error: "WRONGQR" };
  }
  const dataParts = info.split("/");
  if (info.indexOf("1:1@sync2") > -1) {
    const xrpAddressParts = dataParts[6].split("[");
    return {
      version: dataParts[3],
      deviceId: dataParts[4],
      walletName: dataParts[5],
      crypto: xrpAddressParts[0],
      address: xrpAddressParts[1],
      publicKey: xrpAddressParts[2],
    };
  } else {
    return {
      walletName: dataParts[3],
      crypto: dataParts[4],
      address: dataParts[5],
      publicKey: dataParts[6],
    };
  }
};

bithomphw.ellipalPrepareUnsignedTxQr = (tx) => {
  const unsignedTx = Buffer.from(encode(tx), "hex")
    .toString("base64")
    .replace(/\//g, "_");
  const qrLine = "elp://tosign/XRP/" + tx.Account + "/" + unsignedTx + "/XRP/6";
  if (qrLine.length > 230) {
    let qrLines = [];
    const linesCount = parseInt(unsignedTx.length / 140, 10) + 1;
    const unsignedTxArray = unsignedTx.match(/.{1,140}/g);
    for (let i = 1; i <= linesCount; i++) {
      qrLines[i - 1] =
        "elp://" +
        i +
        ":" +
        linesCount +
        "@tosign/XRP/" +
        tx.Account +
        "/" +
        unsignedTxArray[i - 1] +
        "/XRP/6";
    }
    return {
      unsignedTx: qrLines,
    };
  } else {
    return {
      unsignedTx: [qrLine],
    };
  }
};

bithomphw.ellipalParseSignedTxQr = (data) => {
  if (data.indexOf("elp://signed") == -1) {
    return { error: "WRONGQR" };
  }
  const dataParts = data.split("/");
  const { BN, Signature } = crypto;
  const r = new BN(
    new Buffer.from(dataParts[5].substr(0, 64), "hex").reverse()
  );
  const s = new BN(
    new Buffer.from(dataParts[5].substr(64, 64), "hex").reverse()
  );
  const sig = new Signature({ r: r, s: s });
  const der = sig.toDER(r, s);
  const txSignature = der.toString("hex").toUpperCase();
  return {
    crypto: dataParts[3],
    address: dataParts[4],
    signature: txSignature,
  };
};

bithomphw.ellipalPrepareTxForSubmit = (tx) => {
  const signedTransaction = encode(tx);
  return {
    signedTransaction,
    id: computeBinaryTransactionHash(signedTransaction),
  };
};

/*
bithomphw.trezorGetAddress = async (path = "m/44'/144'/0'/0/0") => {
  const params = { path, showOnTrezor: false };
  const { payload } = await TrezorConnect.rippleGetAddress(params);
  return {
    address: payload.address,
  };
};

bithomphw.trezorSignTransaction = async (tx, path = "m/44'/144'/0'/0/0") => {
  const params = {
    path,
    transaction: {
      fee: tx.Fee,
      flags: tx.Flags,
      sequence: tx.Sequence,
      payment: {
        amount: tx.Amount,
        destination: tx.Destination,
        destinationTag: Number(tx.DestinationTag),
      },
    },
  };
  const { payload } = await TrezorConnect.rippleSignTransaction(params);
  const { serializedTx } = payload;
  const signedTransaction = serializedTx.toUpperCase();
  return {
    signedTransaction,
    id: computeBinaryTransactionHash(signedTransaction),
  };
};
*/
