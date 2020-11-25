"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// JavaScript auxiliary library
// Copyright (C) 2012 Dario Giovannetti <dev@dariogiovannetti.net>
//
// This file is part of JavaScript auxiliary library.
//
// JavaScript auxiliary library is free software: you can redistribute it
// and/or modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation, either version 3
// of the License, or (at your option) any later version.
//
// JavaScript auxiliary library is distributed in the hope that it will be
// useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with JavaScript auxiliary library.
// If not, see <http://www.gnu.org/licenses/>.
var path = require('path');

module.exports = function CloudStorageManager(firebaseAdminApp, bucketNamesMap) {
  var cStorage = firebaseAdminApp.storage();
  var buckets = {};
  var nameToBucket = {};

  for (var _i = 0, _Object$entries = Object.entries(bucketNamesMap); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        refName = _Object$entries$_i[0],
        bucketName = _Object$entries$_i[1];

    var bucket = Bucket(cStorage, bucketName);
    buckets[refName] = bucket;
    nameToBucket[bucketName] = bucket;
  }

  return {
    buckets: buckets,
    nameToBucket: nameToBucket
  };
};

function Bucket(cStorage, name) {
  var csBucket = cStorage.bucket(name);
  return {
    name: name,
    listDir: function listDir(directory) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _yield$csBucket$getFi, _yield$csBucket$getFi2, files;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return csBucket.getFiles({
                  directory: directory
                });

              case 2:
                _yield$csBucket$getFi = _context.sent;
                _yield$csBucket$getFi2 = _slicedToArray(_yield$csBucket$getFi, 1);
                files = _yield$csBucket$getFi2[0];
                return _context.abrupt("return", files.map(function (file) {
                  return file.metadata.name;
                }));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    readFile: function readFile(filePath) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var file, _yield$Promise$all, _yield$Promise$all2, contentType, buffer;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                file = csBucket.file(filePath);
                _context2.next = 3;
                return Promise.all([file.getMetadata().then(function (_ref) {
                  var _ref2 = _slicedToArray(_ref, 1),
                      metadata = _ref2[0];

                  return metadata.contentType;
                }), new Promise(function (resolve, reject) {
                  var fileStream = file.createReadStream();
                  var fileChunks = [];
                  fileStream.on('data', function (chunk) {
                    fileChunks.push(chunk);
                  });
                  fileStream.on('error', reject);
                  fileStream.on('end', function () {
                    resolve(Buffer.concat(fileChunks));
                  });
                })]);

              case 3:
                _yield$Promise$all = _context2.sent;
                _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
                contentType = _yield$Promise$all2[0];
                buffer = _yield$Promise$all2[1];
                return _context2.abrupt("return", {
                  contentType: contentType,
                  buffer: buffer
                });

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    uploadFiles: function uploadFiles(files, _ref3) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var allowedExtensions, allowedMimeTypes, sizeLimit, adjust, _ref3$allowOverwrite, allowOverwrite, _ref3$validateOnly, validateOnly, _ref3$allOrNothing, allOrNothing, promises1, promisesEnd, doUploads;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                allowedExtensions = _ref3.allowedExtensions, allowedMimeTypes = _ref3.allowedMimeTypes, sizeLimit = _ref3.sizeLimit, adjust = _ref3.adjust, _ref3$allowOverwrite = _ref3.allowOverwrite, allowOverwrite = _ref3$allowOverwrite === void 0 ? false : _ref3$allowOverwrite, _ref3$validateOnly = _ref3.validateOnly, validateOnly = _ref3$validateOnly === void 0 ? false : _ref3$validateOnly, _ref3$allOrNothing = _ref3.allOrNothing, allOrNothing = _ref3$allOrNothing === void 0 ? true : _ref3$allOrNothing;
                promises1 = files.map( /*#__PURE__*/function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref4, fileIndex) {
                    var fileName, transferEncoding, mimeType, fileBuffer, error, _error, _error2, _ref6, filePath, csFile, _error3, doUpload;

                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            fileName = _ref4.fileName, transferEncoding = _ref4.transferEncoding, mimeType = _ref4.mimeType, fileBuffer = _ref4.fileBuffer;

                            if (!(allowedExtensions != null && !allowedExtensions.includes(path.extname(fileName)))) {
                              _context3.next = 8;
                              break;
                            }

                            error = new Error("File ".concat(fileName, " has an unexpected name extension; accepted: ").concat(allowedExtensions.join(' | ')));

                            if (!allOrNothing) {
                              _context3.next = 7;
                              break;
                            }

                            throw error;

                          case 7:
                            return _context3.abrupt("return", error);

                          case 8:
                            if (!(allowedMimeTypes != null && !allowedMimeTypes.includes(mimeType))) {
                              _context3.next = 15;
                              break;
                            }

                            _error = new Error("File ".concat(fileName, " has an unexpected MIME type (").concat(mimeType, "); accepted: ").concat(allowedMimeTypes.join(' | ')));

                            if (!allOrNothing) {
                              _context3.next = 14;
                              break;
                            }

                            throw _error;

                          case 14:
                            return _context3.abrupt("return", _error);

                          case 15:
                            if (!(sizeLimit != null && fileBuffer.length > sizeLimit)) {
                              _context3.next = 22;
                              break;
                            }

                            _error2 = new Error("File ".concat(fileName, " exceeds size limit of ").concat(fileBuffer.length, " bytes"));

                            if (!allOrNothing) {
                              _context3.next = 21;
                              break;
                            }

                            throw _error2;

                          case 21:
                            return _context3.abrupt("return", _error2);

                          case 22:
                            // TODO: Allow explicitly setting the content type, and maybe also
                            //       other metadata
                            _ref6 = adjust ? adjust({
                              fileName: fileName,
                              transferEncoding: transferEncoding,
                              mimeType: mimeType,
                              fileBuffer: fileBuffer,
                              fileIndex: fileIndex
                            }) : {
                              filePath: fileName
                            }, filePath = _ref6.filePath;
                            csFile = csBucket.file(filePath);
                            _context3.t0 = !allowOverwrite;

                            if (!_context3.t0) {
                              _context3.next = 29;
                              break;
                            }

                            _context3.next = 28;
                            return csFile.exists();

                          case 28:
                            _context3.t0 = _context3.sent[0];

                          case 29:
                            if (!_context3.t0) {
                              _context3.next = 36;
                              break;
                            }

                            _error3 = new Error("File ".concat(filePath, " already exists"));

                            if (!allOrNothing) {
                              _context3.next = 35;
                              break;
                            }

                            throw _error3;

                          case 35:
                            return _context3.abrupt("return", _error3);

                          case 36:
                            if (!validateOnly) {
                              _context3.next = 38;
                              break;
                            }

                            return _context3.abrupt("return", true);

                          case 38:
                            doUpload = function doUpload() {
                              var writable = csFile.createWriteStream();
                              return new Promise(function (resolve, reject) {
                                writable.on('finish', resolve);
                                writable.on('error', reject);
                                writable.end(fileBuffer);
                              });
                            };

                            return _context3.abrupt("return", allOrNothing ? doUpload : doUpload());

                          case 40:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x, _x2) {
                    return _ref5.apply(this, arguments);
                  };
                }());

                if (!(!validateOnly && allOrNothing)) {
                  _context4.next = 9;
                  break;
                }

                _context4.next = 5;
                return Promise.all(promises1);

              case 5:
                doUploads = _context4.sent;
                promisesEnd = doUploads.map(function (doUpload) {
                  return doUpload();
                });
                _context4.next = 10;
                break;

              case 9:
                promisesEnd = promises1;

              case 10:
                return _context4.abrupt("return", Promise.all(promisesEnd));

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    deleteFiles: function deleteFiles(filePaths) {
      return Promise.all(filePaths.map(function (filePath) {
        var csFile = csBucket.file(filePath);
        return csFile["delete"]();
      }));
    }
  };
}