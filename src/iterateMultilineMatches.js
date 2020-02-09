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


function advanceToNextLine(oldLineNo, oldRemainingText) {
  const nextLineStart = oldRemainingText.indexOf('\n') + 1
  const newLine = oldRemainingText.slice(0, nextLineStart)
  const newRemainingText = oldRemainingText.slice(nextLineStart)
  return [newLine, oldLineNo + 1, newRemainingText]
}


module.exports.iterateMultilineMatches = function *iterateMultilineMatches({
  haystack, startMatch, continueMatch,
}) {
  let [line, lineNo, remainingText] = advanceToNextLine(0, haystack)
  let currentMatch = null
  let continueRegExp = null

  while (remainingText.length > 0) {
    if (currentMatch == null) {
      let match
      [match, continueRegExp] = startMatch(line)

      if (match != null) {
        currentMatch = {
          startLineNo: lineNo,
          lines: [match],
        }
      }

      [line, lineNo, remainingText] = advanceToNextLine(lineNo, remainingText)
    } else {
      let match
      [match, continueRegExp] = continueMatch(
        continueRegExp, currentMatch, line)

      if (match == null) {
        yield currentMatch
        currentMatch = null
        // This line could be the start of a new match, so parse it again, i.e.
        // don't advance to the next line
      } else {
        currentMatch.lines.push(match)
        // [line, lineNo, remainingText] =
        //   advanceToNextLine(lineNo, remainingText)
        const nextLineData = advanceToNextLine(lineNo, remainingText)
        line = nextLineData[0]
        lineNo = nextLineData[1]
        remainingText = nextLineData[2]
      }
    }
  }
}
