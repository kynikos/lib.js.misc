# JavaScript auxiliary library
# Copyright (C) 2012 Dario Giovannetti <dev@dariogiovannetti.net>
#
# This file is part of JavaScript auxiliary library.
#
# JavaScript auxiliary library is free software: you can redistribute it
# and/or modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation, either version 3
# of the License, or (at your option) any later version.
#
# JavaScript auxiliary library is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with JavaScript auxiliary library.
# If not, see <http://www.gnu.org/licenses/>.


module.exports.insert = (string, newString, id) ->
    id ?= 0
    return string.substring(0, id) + newString + string.substr(id)


module.exports.overwriteFor = (string, newString, id, length) ->
    id ?= 0
    if not length or length < 0 then length = 0
    return string.substring(0, id) + newString + string.substr(id + length)


module.exports.overwriteAt = (string, newString, id) ->
    return module.exports.overwriteFor(string, newString, id, newString.length)


module.exports.overwriteBetween = (string, newString, id1, id2) ->
    id1 ?= 0
    id2 ?= id1
    if id1 > id2
        tempid = id2
        id2 = id1
        id1 = tempid
    return string.substring(0, id1) + newString + string.substr(id2)


module.exports.removeFor = (string, id, length) ->
    return module.exports.overwriteFor(string, "", id, length)


module.exports.removeBetween = (string, id1, id2) ->
    return module.exports.overwriteBetween(string, "", id1, id2)


module.exports.padLeft = (string, filler, length) ->
    while string.length < length
        string = filler + string
    return string


module.exports.padRight = (string, filler, length) ->
    while string.length < length
        string += filler
    return string


module.exports.findSimpleEnclosures = (string, openTag, openLength,
                                                closeTag, closeLength) ->
    # openTag and closeTag can be strings or regular expressions
    # If the string is "<<>>" and the tags are "<" and ">", the result is
    #   [[0, 2], ]
    # Results are guaranteed to be in order of appearance in the original
    #   text
    results = []
    searchIndex = 0
    oIndexRel = string.search(openTag)

    while true
        if oIndexRel > -1
            oIndex = searchIndex + oIndexRel
            cIndexRel = string.substr(oIndex + openLength).search(
                                                                closeTag)

            if cIndexRel > -1
                cIndex = oIndex + openLength + cIndexRel
                results.push([oIndex, cIndex])
                searchIndex = cIndex + closeLength

                if searchIndex < string.length
                    oIndexRel = string.substr(searchIndex).search(openTag)
                    continue
                else
                    break
            else
                # A tag is left open (no closing tag is found)
                # Let each implementation decide what to do in this case
                #   (either consider the tag working until the end of text
                #   or not)
                results.push([oIndex, false])
                break
        else
            break

    return results


module.exports.findNestedEnclosures = (string, openTag, closeTag, maskChar) ->
    # openTag and closeTag must be strings, *not* regular expressions,
    #   unlike this.findSimpleEnclosures
    # maskChar must be a *1*-character string and must *not* be part of
    #   neither openTag nor closeTag
    # If the string is "<<>>" and the tags are "<" and ">", the result is
    #   [[1, 2], [0, 3]]
    openLength = openTag.length
    closeLength = closeTag.length
    results = []
    searchIndex = 0
    cIndexRel = string.indexOf(closeTag)
    maskedString = string

    while true
        if cIndexRel > -1
            cIndex = searchIndex + cIndexRel
            oIndexRel = maskedString.substring(searchIndex, cIndex)
                                                    .lastIndexOf(openTag)

            if oIndexRel > -1
                oIndex = searchIndex + oIndexRel
                results.push([oIndex, cIndex])

                maskedString1 = maskedString.substring(0, oIndex)
                maskLength = cIndex - oIndex + closeLength
                maskedString2 = module.exports.padRight("", maskChar, maskLength)
                maskedString3 = maskedString.substring(cIndex + closeLength)
                maskedString = maskedString1 + maskedString2 + maskedString3

                # Do *not* increment searchIndex in this case, in fact in
                #   we don't know yet whether there are more openTags
                #   before the one found
            else
                searchIndex = cIndex + closeLength

            cIndexRel = maskedString.substring(searchIndex).indexOf(
                                                                closeTag)
            continue

        else
            break

    return [results, maskedString]


module.exports.findInnermostEnclosures = (string, openTag, closeTag) ->
    # openTag and closeTag must be strings, *not* regular expressions,
    #   unlike this.findSimpleEnclosures
    # If the string is "<<>>" and the tags are "<" and ">", the result is
    #   [[1, 2], ]
    openLength = openTag.length
    closeLength = closeTag.length
    results = []
    searchIndex = 0

    while true
        cIndexRel = string.substring(searchIndex).indexOf(closeTag)

        if cIndexRel > -1
            cIndex = searchIndex + cIndexRel
            oIndexRel = string.substring(searchIndex, cIndex)
                                                    .lastIndexOf(openTag)

            if oIndexRel > -1
                oIndex = searchIndex + oIndexRel
                results.push([oIndex, cIndex])

            searchIndex = cIndex + closeLength
            continue

        else
            break

    return results
