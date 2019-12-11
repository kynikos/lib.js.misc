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


module.exports.iterateMultilineMatches = function *iterateMultilineMatches({
  haystack, startMatch, continueMatch,
}) {
  let remainingText = haystack
  let currentMatch = null
  let continueRegExp = null
  let lineNo = 0

  while (remainingText.length > 0) {
    lineNo++
    const nextLineBreak = remainingText.indexOf('\n')
    const line = remainingText.slice(0, nextLineBreak + 1)
    remainingText = remainingText.slice(nextLineBreak + 1)

    if (currentMatch == null) {
      let match
      [match, continueRegExp] = startMatch(line)

      if (match != null) {
        currentMatch = {
          startLineNo: lineNo,
          lines: [match],
        }
      }
    } else {
      let match
      [match, continueRegExp] = continueMatch(
        continueRegExp, currentMatch, line)

      if (match == null) {
        yield currentMatch
        currentMatch = null
      } else {
        currentMatch.lines.push(match)
      }
    }
  }
}
