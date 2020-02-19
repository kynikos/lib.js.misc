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


function _assignItemToNestedGroup({
  currentGroup, item, remainingKeys, emptyArrayReplacement,
}) {
  const key = remainingKeys[0]
  let groupByValues = item[key]

  // TODO: When adding tests, also test support for grouping by arrays
  if (!Array.isArray(groupByValues)) {
    groupByValues = [groupByValues]
  }

  if (!groupByValues.length && emptyArrayReplacement != null) {
    groupByValues = [emptyArrayReplacement]
  }

  for (const groupByValue of groupByValues) {
    let subGroup = currentGroup[groupByValue]

    if (remainingKeys.length > 1) {
      if (!subGroup) {
        subGroup = {}
        currentGroup[groupByValue] = subGroup
      }
      _assignItemToNestedGroup({
        currentGroup: subGroup,
        item,
        remainingKeys: remainingKeys.slice(1),
        emptyArrayReplacement,
      })
      continue
    } else if (!subGroup) {
      subGroup = []
      currentGroup[groupByValue] = subGroup
    }
    subGroup.push(item)
    continue
  }
}


module.exports.groupAsyncGeneratorByNested = async function groupAsyncGeneratorByNested(
  generator, groupByKeys, {
    emptyArrayReplacement,
  },
) {
  const groupedItems = {}

  for await (const item of generator) {
    _assignItemToNestedGroup({
      currentGroup: groupedItems,
      item,
      remainingKeys: groupByKeys,
      emptyArrayReplacement,
    })
  }

  return groupedItems
}
