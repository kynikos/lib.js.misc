"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

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
function _assignItemToNestedGroup(_ref) {
  var currentGroup = _ref.currentGroup,
      item = _ref.item,
      remainingKeys = _ref.remainingKeys,
      emptyArrayReplacement = _ref.emptyArrayReplacement;
  var key = remainingKeys[0];
  var groupByValues = item[key]; // TODO: When adding tests, also test support for grouping by arrays

  if (!Array.isArray(groupByValues)) {
    groupByValues = [groupByValues];
  }

  if (!groupByValues.length && emptyArrayReplacement != null) {
    groupByValues = [emptyArrayReplacement];
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = groupByValues[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var groupByValue = _step2.value;
      var subGroup = currentGroup[groupByValue];

      if (remainingKeys.length > 1) {
        if (!subGroup) {
          subGroup = {};
          currentGroup[groupByValue] = subGroup;
        }

        _assignItemToNestedGroup({
          currentGroup: subGroup,
          item: item,
          remainingKeys: remainingKeys.slice(1),
          emptyArrayReplacement: emptyArrayReplacement
        });

        continue;
      } else if (!subGroup) {
        subGroup = [];
        currentGroup[groupByValue] = subGroup;
      }

      subGroup.push(item);
      continue;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

module.exports.groupAsyncGeneratorByNested = /*#__PURE__*/function () {
  var _groupAsyncGeneratorByNested = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(generator, groupByKeys, _ref2) {
    var emptyArrayReplacement, groupedItems, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, item;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            emptyArrayReplacement = _ref2.emptyArrayReplacement;
            groupedItems = {};
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _context.prev = 4;
            _iterator = _asyncIterator(generator);

          case 6:
            _context.next = 8;
            return _iterator.next();

          case 8:
            _step = _context.sent;
            _iteratorNormalCompletion = _step.done;
            _context.next = 12;
            return _step.value;

          case 12:
            _value = _context.sent;

            if (_iteratorNormalCompletion) {
              _context.next = 19;
              break;
            }

            item = _value;

            _assignItemToNestedGroup({
              currentGroup: groupedItems,
              item: item,
              remainingKeys: groupByKeys,
              emptyArrayReplacement: emptyArrayReplacement
            });

          case 16:
            _iteratorNormalCompletion = true;
            _context.next = 6;
            break;

          case 19:
            _context.next = 25;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](4);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 25:
            _context.prev = 25;
            _context.prev = 26;

            if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
              _context.next = 30;
              break;
            }

            _context.next = 30;
            return _iterator["return"]();

          case 30:
            _context.prev = 30;

            if (!_didIteratorError) {
              _context.next = 33;
              break;
            }

            throw _iteratorError;

          case 33:
            return _context.finish(30);

          case 34:
            return _context.finish(25);

          case 35:
            return _context.abrupt("return", groupedItems);

          case 36:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 21, 25, 35], [26,, 30, 34]]);
  }));

  function groupAsyncGeneratorByNested(_x, _x2, _x3) {
    return _groupAsyncGeneratorByNested.apply(this, arguments);
  }

  return groupAsyncGeneratorByNested;
}();