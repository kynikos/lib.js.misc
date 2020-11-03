"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeMailto = makeMailto;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function makeMailto(_ref) {
  var to = _ref.to,
      cc = _ref.cc,
      bcc = _ref.bcc,
      subject = _ref.subject,
      body = _ref.body;
  // URI.js doesn't work well with mailto, because React escapes the "&" set by
  // URI.setQuery()
  var uri = "mailto:".concat(to);
  var parameters = Object.entries({
    cc: cc,
    bcc: bcc,
    subject: subject,
    body: body
  }).reduce(function (acc, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        value = _ref3[1];

    if (value != null) {
      acc.push("".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value)));
    }

    return acc;
  }, [] // 0x0026 is "&", which would otherwise be escaped by React
  ).join(String.fromCharCode(0x0026));
  if (parameters) return uri + '?' + parameters;
  return uri;
}