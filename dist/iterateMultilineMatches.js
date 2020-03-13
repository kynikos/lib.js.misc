"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

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
function advanceToNextLine(oldLineNo, oldRemainingText) {
  var nextLineStart = oldRemainingText.indexOf('\n') + 1;
  var newLine = oldRemainingText.slice(0, nextLineStart);
  var newRemainingText = oldRemainingText.slice(nextLineStart);
  return [newLine, oldLineNo + 1, newRemainingText];
}

module.exports.iterateMultilineMatches = /*#__PURE__*/regeneratorRuntime.mark(function iterateMultilineMatches(_ref) {
  var haystack, startMatch, continueMatch, _advanceToNextLine, _advanceToNextLine2, line, lineNo, remainingText, currentMatch, continueRegExp, match, _startMatch, _startMatch2, _advanceToNextLine3, _advanceToNextLine4, _match, _continueMatch, _continueMatch2, nextLineData;

  return regeneratorRuntime.wrap(function iterateMultilineMatches$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          haystack = _ref.haystack, startMatch = _ref.startMatch, continueMatch = _ref.continueMatch;
          _advanceToNextLine = advanceToNextLine(0, haystack), _advanceToNextLine2 = _slicedToArray(_advanceToNextLine, 3), line = _advanceToNextLine2[0], lineNo = _advanceToNextLine2[1], remainingText = _advanceToNextLine2[2];
          currentMatch = null;
          continueRegExp = null;

        case 4:
          if (!(line.length > 0)) {
            _context.next = 37;
            break;
          }

          if (!(currentMatch == null)) {
            _context.next = 19;
            break;
          }

          match = void 0;
          _startMatch = startMatch(line);
          _startMatch2 = _slicedToArray(_startMatch, 2);
          match = _startMatch2[0];
          continueRegExp = _startMatch2[1];

          if (match != null) {
            currentMatch = {
              startLineNo: lineNo,
              lines: [match]
            };
          }

          _advanceToNextLine3 = advanceToNextLine(lineNo, remainingText);
          _advanceToNextLine4 = _slicedToArray(_advanceToNextLine3, 3);
          line = _advanceToNextLine4[0];
          lineNo = _advanceToNextLine4[1];
          remainingText = _advanceToNextLine4[2];
          _context.next = 35;
          break;

        case 19:
          _match = void 0;
          _continueMatch = continueMatch(continueRegExp, currentMatch, line);
          _continueMatch2 = _slicedToArray(_continueMatch, 2);
          _match = _continueMatch2[0];
          continueRegExp = _continueMatch2[1];

          if (!(_match == null)) {
            _context.next = 30;
            break;
          }

          _context.next = 27;
          return currentMatch;

        case 27:
          currentMatch = null; // This line could be the start of a new match, so parse it again, i.e.
          // don't advance to the next line

          _context.next = 35;
          break;

        case 30:
          currentMatch.lines.push(_match); // TODO: For some reason array spreading doesn't work?!? ################################################
          // [line, lineNo, remainingText] =
          //   advanceToNextLine(lineNo, remainingText)

          nextLineData = advanceToNextLine(lineNo, remainingText);
          line = nextLineData[0];
          lineNo = nextLineData[1];
          remainingText = nextLineData[2];

        case 35:
          _context.next = 4;
          break;

        case 37:
          if (!(currentMatch != null)) {
            _context.next = 40;
            break;
          }

          _context.next = 40;
          return currentMatch;

        case 40:
        case "end":
          return _context.stop();
      }
    }
  }, iterateMultilineMatches);
});