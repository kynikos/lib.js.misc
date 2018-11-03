# lib.cs.misc - Check the status of code repositories under a root directory.
# Copyright (C) 2016 Dario Giovannetti <dev@dariogiovannetti.net>
#
# This file is part of lib.cs.misc.
#
# lib.cs.misc is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# lib.cs.misc is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with lib.cs.misc.  If not, see <http://www.gnu.org/licenses/>.


formatMultiplication = (factor1, factor2, decimals) ->
    return (factor1 * factor2).toFixed(decimals)
module.exports.formatMultiplication = formatMultiplication


module.exports.roundedMultiplication = (factor1, factor2, decimals) ->
    return parseFloat(formatMultiplication(factor1, factor2, decimals))


formatDivision = (dividend, divisor, decimals) ->
    return (dividend / divisor).toFixed(decimals)
module.exports.formatDivision = formatDivision


module.exports.roundedDivision = (dividend, divisor, decimals) ->
    return parseFloat(formatDivision(dividend, divisor, decimals))
