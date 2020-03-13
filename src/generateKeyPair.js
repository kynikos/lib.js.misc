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

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const moment = require('moment')
const readlineSync = require('readline-sync')


module.exports.generateKeyPair = function generateKeyPair(
  keyFileDefaultName,
  keyFileLength,
) {
  const mainKey = readlineSync.question(
    'Main key: ', {hideEchoBack: true})

  const keyfilePrefix = readlineSync.question(
    `Keyfile prefix (default "${keyFileDefaultName}"): `,
    {defaultInput: keyFileDefaultName},
  )

  const keyfileBuffer = crypto.randomBytes(keyFileLength)

  fs.writeFileSync(
    path.join('.', `${keyfilePrefix}_${
      moment().format('YYYYMMDDTHHmmss')}.key`),
    keyfileBuffer,
  )

  // The application will actually use a hash of the keyfile
  const hash = crypto.createHash('sha256')
  hash.update(keyfileBuffer)
  const keyfileHex = hash.digest('hex')

  const cipher1 = crypto.createCipher('aes256', keyfileHex)

  let encryptedMainKey = cipher1.update(mainKey, 'utf8', 'hex')
  encryptedMainKey += cipher1.final('hex')

  console.log('Encrypted key: ', encryptedMainKey)

  const cipher2 = crypto.createCipher('aes256', keyfileHex)

  let encryptedSecret = cipher2.update('secret', 'utf8', 'hex')
  encryptedSecret += cipher2.final('hex')

  console.log('Encrypted "secret": ', encryptedSecret)
}
