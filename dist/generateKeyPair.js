"use strict";

// lib.cs.misc - Check the status of code repositories under a root directory.
// Copyright (C) 2016 Dario Giovannetti <dev@dariogiovannetti.net>
//
// This file is part of lib.cs.misc.
//
// lib.cs.misc is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// lib.cs.misc is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with lib.cs.misc.  If not, see <http://www.gnu.org/licenses/>.

/* eslint-disable no-console,no-sync */
var fs = require('fs');

var path = require('path');

var crypto = require('crypto');

var moment = require('moment');

var readlineSync = require('readline-sync');

module.exports.generateKeyPair = function generateKeyPair(keyFileDefaultName, keyFileLength) {
  var mainKey = readlineSync.question('Main key: ', {
    hideEchoBack: true
  });
  var keyfilePrefix = readlineSync.question("Keyfile prefix (default \"".concat(keyFileDefaultName, "\"): "), {
    defaultInput: keyFileDefaultName
  });
  var keyfileBuffer = crypto.randomBytes(keyFileLength);
  fs.writeFileSync(path.join('.', "".concat(keyfilePrefix, "_").concat(moment().format('YYYYMMDDTHHmmss'), ".key")), keyfileBuffer); // The application will actually use a hash of the keyfile

  var hash = crypto.createHash('sha256');
  hash.update(keyfileBuffer);
  var keyfileHex = hash.digest('hex');
  var cipher1 = crypto.createCipher('aes256', keyfileHex);
  var encryptedMainKey = cipher1.update(mainKey, 'utf8', 'hex');
  encryptedMainKey += cipher1["final"]('hex');
  console.log('Encrypted key: ', encryptedMainKey);
  var cipher2 = crypto.createCipher('aes256', keyfileHex);
  var encryptedSecret = cipher2.update('secret', 'utf8', 'hex');
  encryptedSecret += cipher2["final"]('hex');
  console.log('Encrypted "secret": ', encryptedSecret);
};