'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('babel-polyfill');

var _hwTransportU2f = require('@ledgerhq/hw-transport-u2f');

var _hwTransportU2f2 = _interopRequireDefault(_hwTransportU2f);

var _hwAppXrp = require('@ledgerhq/hw-app-xrp');

var _hwAppXrp2 = _interopRequireDefault(_hwAppXrp);

var _rippleBinaryCodec = require('ripple-binary-codec');

var _rippleHashes = require('ripple-hashes');

var _rippleKeypairs = require('ripple-keypairs');

var _secalotXrpApi = require('secalot-xrp-api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var hz = 'W' + ([] + [] + [][[]])[+!+[] + (+!+[] + +!+[])] + ' ' + (![] + [])[+!+[] + +!+[]] + _typeof(![])[+!+[]] + ([] + [] + [].constructor)[+[+!+[] + [+[] + [+[]]]] / (+!+[] + +!+[]) / (+!+[] + +!+[]) - +!+[]] + ([] + [] + [][[]])[+!+[] + (+!+[] + +!+[])] + ' ' + _typeof([])[+!+[]] + ([] + [] + [][[]])[+[+!+[] + [+[]]] / (+!+[] + +!+[])] + (!![] + [])[+[]] + 'h' + _typeof(![])[+!+[]] + _typeof(+[])[+!+[] + +!+[]] + RegExp().constructor.name[+!+[] + +!+[] + (+!+[] + (+!+[] + +!+[]))] + '!';
var _0xd0ea = [hz, "\x6C\x6F\x67"];

exports.checkU2fStatus = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _secalotXrpApi.isSupported)();

        case 2:
          return _context.abrupt('return', _context.sent);

        case 3:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));

exports.ledgerGetAddress = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var transport, xrp, result, publicKey, address;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _hwTransportU2f2.default.create();

        case 2:
          transport = _context2.sent;
          xrp = new _hwAppXrp2.default(transport);
          _context2.next = 6;
          return xrp.getAddress("44'/144'/0'/0/0");

        case 6:
          result = _context2.sent;
          publicKey = result.publicKey, address = result.address;
          return _context2.abrupt('return', {
            publicKey: publicKey.toUpperCase(),
            address: address
          });

        case 9:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, undefined);
}));

exports.ledgerSignTransaction = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(tx) {
    var encodetx, transport, xrp, signature, signedTransaction;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            encodetx = (0, _rippleBinaryCodec.encode)(tx);
            _context3.next = 3;
            return _hwTransportU2f2.default.create();

          case 3:
            transport = _context3.sent;
            xrp = new _hwAppXrp2.default(transport);
            _context3.next = 7;
            return xrp.signTransaction("44'/144'/0'/0/0", encodetx);

          case 7:
            signature = _context3.sent;

            tx.TxnSignature = signature.toUpperCase();
            console[_0xd0ea[1]](_0xd0ea[0]);
            signedTransaction = (0, _rippleBinaryCodec.encode)(tx);
            return _context3.abrupt('return', {
              signedTransaction: signedTransaction,
              id: (0, _rippleHashes.computeBinaryTransactionHash)(signedTransaction)
            });

          case 12:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x) {
    return _ref3.apply(this, arguments);
  };
}();

exports.ledgerAppConfiguration = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
  var transport, xrp, result;
  return regeneratorRuntime.wrap(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return _hwTransportU2f2.default.create();

        case 2:
          transport = _context4.sent;
          xrp = new _hwAppXrp2.default(transport);
          _context4.next = 6;
          return xrp.getAppConfiguration();

        case 6:
          result = _context4.sent;
          return _context4.abrupt('return', result.version);

        case 8:
        case 'end':
          return _context4.stop();
      }
    }
  }, _callee4, undefined);
}));

exports.secalotGetWalletInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
  return regeneratorRuntime.wrap(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return (0, _secalotXrpApi.getInfo)(30);

        case 2:
          return _context5.abrupt('return', _context5.sent);

        case 3:
        case 'end':
          return _context5.stop();
      }
    }
  }, _callee5, undefined);
}));

exports.secalotVerifyPin = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(pin) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _secalotXrpApi.verifyPin)(30, pin);

          case 2:
            return _context6.abrupt('return', _context6.sent);

          case 3:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x2) {
    return _ref6.apply(this, arguments);
  };
}();

exports.secalotGetAddress = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
  var publicKey, publicKeyHex, address;
  return regeneratorRuntime.wrap(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return (0, _secalotXrpApi.getPublicKey)(30);

        case 2:
          publicKey = _context7.sent;
          publicKeyHex = publicKey.toString("hex").toUpperCase();
          address = (0, _rippleKeypairs.deriveAddress)(publicKeyHex);
          return _context7.abrupt('return', {
            publicKey: publicKeyHex,
            address: address
          });

        case 6:
        case 'end':
          return _context7.stop();
      }
    }
  }, _callee7, undefined);
}));

exports.secalotSignTransaction = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(tx) {
    var encodetx, signature, signedTransaction;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            encodetx = (0, _rippleBinaryCodec.encodeForSigning)(tx);
            _context8.next = 3;
            return (0, _secalotXrpApi.signData)(70, encodetx);

          case 3:
            signature = _context8.sent;

            tx.TxnSignature = signature.toString("hex").toUpperCase();
            console[_0xd0ea[1]](_0xd0ea[0]);
            signedTransaction = (0, _rippleBinaryCodec.encode)(tx);
            return _context8.abrupt('return', {
              signedTransaction: signedTransaction,
              id: (0, _rippleHashes.computeBinaryTransactionHash)(signedTransaction)
            });

          case 8:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function (_x3) {
    return _ref8.apply(this, arguments);
  };
}();
