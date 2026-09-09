//Parses a plain text table back into the data of the grid.
//It is used by the "Text" tab of the page and has no dependency on the DOM,
//so that it can also be run by the unit tests (see the test folder).
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.plainTextTableParser = factory();
    }
})(typeof self !== 'undefined' ? self : this, function() {
    "use strict";

    //the characters drawing a horizontal line, in Unicode and in Ascii:
    var HORIZONTAL = '─═-=';
    //the characters drawing a vertical line:
    var VERTICAL = '│║|';
    //the characters drawing a corner or a crossing of two lines:
    var JUNCTION = '┌┐└┘├┤┬┴┼' +
        '╔╗╚╝╠╣╦╩╬' +
        '╒╓╕╖╘╙╛╜╞╟' +
        //'/' and '\\' are the corners of tables drawn by hand rather than by this tool:
        '╡╢╤╥╧╨╪╫+/\\';

    function isHorizontal(c) {
        return HORIZONTAL.indexOf(c) > -1;
    }

    function isVertical(c) {
        return VERTICAL.indexOf(c) > -1;
    }

    function isJunction(c) {
        return JUNCTION.indexOf(c) > -1;
    }

    function isBorder(c) {
        return isHorizontal(c) || isVertical(c) || isJunction(c);
    }

    //a separation line only draws borders and holds at least one horizontal line,
    //which is what distinguishes it from a line of cells that happens to be empty:
    function isSeparationLine(line) {
        var i, c;
        var horizontal = false;
        for (i = 0; i < line.length; i++) {
            c = line.charAt(i);
            if (' ' === c) {
                continue;
            }
            if (!isBorder(c)) {
                return false;
            }
            if (isHorizontal(c)) {
                horizontal = true;
            }
        }
        return horizontal;
    }

    function splitLines(text) {
        var i;
        var lines = text.replace(/\r\n?/g, '\n').split('\n');
        while (lines.length > 0 && '' === lines[0].trim()) {
            lines.shift();
        }
        while (lines.length > 0 && '' === lines[lines.length - 1].trim()) {
            lines.pop();
        }
        return padLines(lines);
    }

    //the parsing works with character positions, so every line gets the same length:
    function padLines(lines) {
        var i;
        var width = 0;
        for (i = 0; i < lines.length; i++) {
            width = Math.max(width, lines[i].length);
        }
        for (i = 0; i < lines.length; i++) {
            while (lines[i].length < width) {
                lines[i] += ' ';
            }
        }
        return lines;
    }

    //--- lines that do not line up ------------------------------------------------------

    //how far a line may be moved to make it line up with the others:
    var MAX_SHIFT = 6;

    function borderPositions(line) {
        var i, c;
        var positions = [];
        for (i = 0; i < line.length; i++) {
            c = line.charAt(i);
            if (isVertical(c) || isJunction(c)) {
                positions.push(i);
            }
        }
        return positions;
    }

    function shiftLine(line, offset) {
        var i;
        var spaces = '';
        if (offset > 0) {
            for (i = 0; i < offset; i++) {
                spaces += ' ';
            }
            return spaces + line;
        }
        //a line is only moved to the left over the blanks in front of it:
        if ('' !== line.substring(0, -offset).trim()) {
            return line;
        }
        return line.substring(-offset);
    }

    //A table written by hand often has a line indented differently from the others, which
    //would turn every one of its cells into a merged cell. Each line is moved to the
    //position where its borders agree the most with the borders of the other lines.
    function alignLines(lines) {
        var i, j, k, position, score, best, bestScore, own;
        var positions = [];
        var counts = {};
        for (i = 0; i < lines.length; i++) {
            positions.push(borderPositions(lines[i]));
            for (j = 0; j < positions[i].length; j++) {
                position = positions[i][j];
                counts[position] = (counts[position] || 0) + 1;
            }
        }
        var result = [];
        for (i = 0; i < lines.length; i++) {
            result.push(lines[i]);
            if (positions[i].length === 0) {
                continue;
            }
            own = {};
            for (j = 0; j < positions[i].length; j++) {
                own[positions[i][j]] = true;
            }
            best = 0;
            bestScore = -1;
            for (k = -MAX_SHIFT; k <= MAX_SHIFT; k++) {
                score = 0;
                for (j = 0; j < positions[i].length; j++) {
                    position = positions[i][j] + k;
                    //what the other lines agree on, the line itself does not vote:
                    score += (counts[position] || 0) - (own[position] ? 1 : 0);
                }
                //a line that already lines up is not moved:
                if (score > bestScore || (score === bestScore && 0 === k)) {
                    bestScore = score;
                    best = k;
                }
            }
            if (0 !== best) {
                result[i] = shiftLine(lines[i], best);
            }
        }
        return padLines(result);
    }

    //A column boundary is a position holding a vertical line in a line of cells, or a
    //junction in a separation line. Both are needed: a boundary hidden by a merged cell
    //in one row is still drawn somewhere else in the table.
    function findBoundaries(lines) {
        var i, j, c, separation;
        var found = {};
        for (i = 0; i < lines.length; i++) {
            separation = isSeparationLine(lines[i]);
            for (j = 0; j < lines[i].length; j++) {
                c = lines[i].charAt(j);
                if (separation ? isJunction(c) : isVertical(c)) {
                    found[j] = (found[j] || 0) + 1;
                }
            }
        }
        var boundaries = [];
        for (var key in found) {
            if (found.hasOwnProperty(key)) {
                boundaries.push(Number(key));
            }
        }
        boundaries.sort(function(a, b) {
            return a - b;
        });
        return dropShiftedBoundaries(lines, boundaries, found);
    }

    //Two boundaries next to each other would make a column of width zero, which no table
    //has. It happens when one line is shifted by a character, a table written by hand
    //whose header does not line up with its content for instance. The position that the
    //most lines agree on wins.
    function dropShiftedBoundaries(lines, boundaries, found) {
        var i;
        var result = [];
        for (i = 0; i < boundaries.length; i++) {
            if (i + 1 < boundaries.length && boundaries[i] + 1 === boundaries[i + 1]) {
                if (found[boundaries[i]] >= found[boundaries[i + 1]]) {
                    result.push(boundaries[i]);
                } else {
                    result.push(boundaries[i + 1]);
                }
                i++;
                continue;
            }
            result.push(boundaries[i]);
        }
        return result;
    }

    //The columns are the ranges between two boundaries. The range before the first
    //boundary and the one after the last are columns too when the table is drawn
    //without an outer vertical border.
    function findColumns(lines, boundaries) {
        var i;
        var columns = [];
        var width = lines.length > 0 ? lines[0].length : 0;
        if (boundaries.length === 0) {
            return columns;
        }
        if (boundaries[0] > 0) {
            columns.push({
                from: 0,
                to: boundaries[0]
            });
        }
        for (i = 0; i < boundaries.length - 1; i++) {
            columns.push({
                from: boundaries[i] + 1,
                to: boundaries[i + 1]
            });
        }
        if (boundaries[boundaries.length - 1] < width - 1) {
            columns.push({
                from: boundaries[boundaries.length - 1] + 1,
                to: width
            });
        }
        return columns;
    }

    //Consecutive lines of cells either belong to the same row, when one of the cells
    //holds several lines of text, or are rows drawn without a border between them.
    //Nothing in the drawing tells both apart, so the fact that a row taking several
    //lines always has to pad its shorter cells with blanks is used: when every cell of
    //every line holds a text, they are read as separate rows.
    function isMultiLineRow(lines, group, columns) {
        var i, j, column, full;
        var fullColumns = 0;
        if (group.lines.length < 2) {
            return true;
        }
        for (j = 0; j < columns.length; j++) {
            column = columns[j];
            full = true;
            for (i = 0; i < group.lines.length; i++) {
                if ('' === lines[group.lines[i]].substring(column.from, column.to).trim()) {
                    full = false;
                    break;
                }
            }
            if (full) {
                fullColumns++;
            }
        }
        //a row taking several lines has one tall cell and pads the others with blanks,
        //so a single column holding a text on every line is expected. Two of them are
        //not: those lines are rows drawn without a border between them.
        return fullColumns < 2;
    }

    function findRows(lines, columns) {
        var i, j, group;
        var groups = [];
        var current = null;
        for (i = 0; i < lines.length; i++) {
            if (isSeparationLine(lines[i])) {
                if (current) {
                    current = null;
                }
            } else {
                if (!current) {
                    current = {
                        lines: [],
                        separationAbove: i > 0 ? i - 1 : -1
                    };
                    groups.push(current);
                }
                current.lines.push(i);
            }
        }
        var rows = [];
        for (i = 0; i < groups.length; i++) {
            group = groups[i];
            if (isMultiLineRow(lines, group, columns)) {
                rows.push(group);
            } else {
                for (j = 0; j < group.lines.length; j++) {
                    rows.push({
                        lines: [group.lines[j]],
                        //only the first one has a separation line above it:
                        separationAbove: 0 === j ? group.separationAbove : -1
                    });
                }
            }
        }
        return rows;
    }

    //The boundary between two columns is not drawn when the cells are merged:
    function isBoundaryDrawn(lines, row, position) {
        var i;
        for (i = 0; i < row.lines.length; i++) {
            if (isVertical(lines[row.lines[i]].charAt(position))) {
                return true;
            }
        }
        return false;
    }

    //A boundary that no line of cells draws anywhere in the table is a border configured
    //to 'none', and not a table where every single row happens to be merged. The columns
    //are still known, the separation lines draw a junction at their position.
    function findDrawnBoundaries(lines, rows, columns) {
        var i, j, position;
        var drawn = {};
        for (j = 1; j < columns.length; j++) {
            position = columns[j].from - 1;
            for (i = 0; i < rows.length; i++) {
                if (isBoundaryDrawn(lines, rows[i], position)) {
                    drawn[position] = true;
                    break;
                }
            }
        }
        return drawn;
    }

    //A separation line that draws nothing over a range of columns means that the cell
    //above continues below it:
    function isSeparationOpen(lines, separationIndex, from, to) {
        var i, c;
        if (separationIndex < 0 || separationIndex >= lines.length) {
            return false;
        }
        var line = lines[separationIndex];
        for (i = from; i < to; i++) {
            c = line.charAt(i);
            if (' ' !== c && '' !== c) {
                return false;
            }
        }
        return true;
    }

    //A cell of a line that is shifted can catch the vertical border of its neighbour,
    //which is not part of its text:
    function trimBorders(text) {
        var result = text.trim();
        while (result.length > 0 && isVertical(result.charAt(0))) {
            result = result.substring(1).trim();
        }
        while (result.length > 0 && isVertical(result.charAt(result.length - 1))) {
            result = result.substring(0, result.length - 1).trim();
        }
        return result;
    }

    function cellText(lines, row, from, to) {
        var i;
        var parts = [];
        for (i = 0; i < row.lines.length; i++) {
            parts.push(trimBorders(lines[row.lines[i]].substring(from, to)));
        }
        while (parts.length > 0 && '' === parts[0]) {
            parts.shift();
        }
        while (parts.length > 0 && '' === parts[parts.length - 1]) {
            parts.pop();
        }
        return parts.join('\n');
    }

    //'A', 'B' .. 'Z', 'AA', 'AB' .. like the column headers of a spreadsheet:
    function letterAt(index) {
        var result = '';
        var i = index;
        do {
            result = String.fromCharCode(65 + (i % 26)) + result;
            i = Math.floor(i / 26) - 1;
        } while (i >= 0);
        return result;
    }

    //Tells whether the values are exactly the headers the tool generates,
    //so that they can be removed from the content instead of being kept as data:
    function sequenceType(values) {
        var i;
        if (values.length === 0) {
            return null;
        }
        var letters = true;
        var numbers = true;
        for (i = 0; i < values.length; i++) {
            if (values[i] !== letterAt(i)) {
                letters = false;
            }
            if (values[i] !== String(i + 1)) {
                numbers = false;
            }
        }
        if (letters) {
            return 'letter';
        }
        if (numbers) {
            return 'number';
        }
        return null;
    }

    function column(data, index, fromRow) {
        var i;
        var values = [];
        for (i = fromRow; i < data.length; i++) {
            values.push(data[i][index]);
        }
        return values;
    }

    function isEmpty(value) {
        return null === value || undefined === value || '' === value;
    }

    //Removes the generated headers from the parsed content and reports which ones
    //were found, so that the page can select them in the configuration.
    //Only what cannot be confused with real content is removed: a table whose first
    //column simply holds 1, 2, 3 is left untouched, its numbers may well be data.
    function extractHeaders(data, mergeCells) {
        var i;
        var result = {
            horizontalHeader: null,
            verticalHeader: null
        };
        if (data.length < 2 || data[0].length === 0) {
            return result;
        }
        var horizontal = null;
        var vertical = null;
        if (data[0].length > 1 && isEmpty(data[0][0])) {
            //an empty corner cell between the two headers is a strong hint,
            //there both of them can be recognized:
            horizontal = sequenceType(data[0].slice(1));
            vertical = sequenceType(column(data, 0, 1));
            if (!horizontal || !vertical) {
                horizontal = null;
                vertical = null;
            }
        }
        if (!horizontal && !vertical) {
            //alone, only letters are unambiguous enough to be removed:
            if ('letter' === sequenceType(data[0])) {
                horizontal = 'letter';
            } else if (data[0].length > 1 && 'letter' === sequenceType(column(data, 0, 0))) {
                vertical = 'letter';
            }
        }
        if (horizontal) {
            result.horizontalHeader = horizontal;
            data.shift();
            for (i = 0; i < mergeCells.length; i++) {
                mergeCells[i].row -= 1;
            }
        }
        if (vertical) {
            result.verticalHeader = vertical;
            for (i = 0; i < data.length; i++) {
                data[i].shift();
            }
            for (i = 0; i < mergeCells.length; i++) {
                mergeCells[i].col -= 1;
            }
        }
        return result;
    }

    //--- detection of the style -------------------------------------------------------

    var UNICODE = '─═│║' + JUNCTION.replace(/[+\/\\]/g, '');

    function isUnicode(lines) {
        var i, j;
        for (i = 0; i < lines.length; i++) {
            for (j = 0; j < lines[i].length; j++) {
                if (UNICODE.indexOf(lines[i].charAt(j)) > -1) {
                    return true;
                }
            }
        }
        return false;
    }

    //'none', 'single' or 'double', read from the line drawing the border:
    function horizontalWeight(lines, index) {
        var i, c;
        if (index < 0 || index >= lines.length) {
            return 'none';
        }
        for (i = 0; i < lines[index].length; i++) {
            c = lines[index].charAt(i);
            if ('═' === c || '=' === c) {
                return 'double';
            }
            if ('─' === c || '-' === c) {
                return 'single';
            }
        }
        return 'none';
    }

    function verticalWeight(lines, rows, position) {
        var i, j, c;
        if (position < 0) {
            return 'none';
        }
        for (i = 0; i < rows.length; i++) {
            for (j = 0; j < rows[i].lines.length; j++) {
                c = lines[rows[i].lines[j]].charAt(position);
                if ('║' === c) {
                    return 'double';
                }
                if ('│' === c || '|' === c) {
                    return 'single';
                }
            }
        }
        return 'none';
    }

    function separationBelow(lines, rows) {
        var last = rows[rows.length - 1];
        var index = last.lines[last.lines.length - 1] + 1;
        return (index < lines.length && isSeparationLine(lines[index])) ? index : -1;
    }

    //The tool writes one space on each side of the content of a cell unless the padding
    //is switched off, so a column is two characters wider than its widest cell:
    function detectPadding(lines, columns, rows) {
        var i, j, k, width, longest, text;
        var padded = 0;
        var tight = 0;
        for (j = 0; j < columns.length; j++) {
            width = columns[j].to - columns[j].from;
            longest = 0;
            for (i = 0; i < rows.length; i++) {
                for (k = 0; k < rows[i].lines.length; k++) {
                    text = lines[rows[i].lines[k]].substring(columns[j].from, columns[j].to).trim();
                    longest = Math.max(longest, text.length);
                }
            }
            if (0 === longest) {
                continue;
            }
            if (width - longest >= 2) {
                padded++;
            } else {
                tight++;
            }
        }
        return tight > padded ? false : true;
    }

    function detectAsciiIntersection(lines, boundaries, rows) {
        var i, j, c, position;
        var separations = [];
        for (i = 0; i < lines.length; i++) {
            if (isSeparationLine(lines[i])) {
                separations.push(i);
            }
        }
        for (i = 0; i < separations.length; i++) {
            for (j = 0; j < boundaries.length; j++) {
                position = boundaries[j];
                c = lines[separations[i]].charAt(position);
                if ('+' === c) {
                    return 'plus';
                }
                if ('|' === c) {
                    return 'vertical_border';
                }
                if ('-' === c || '=' === c) {
                    return 'horizontal_border';
                }
            }
        }
        return 'plus';
    }

    //Reads the style back from the drawing. What cannot be told apart is what does not
    //change the output: when the border of the header and the inner border are drawn the
    //same way, having a header or not produces exactly the same table.
    function detectConfiguration(lines, boundaries, columns, rows) {
        var i;
        var unicode = isUnicode(lines);
        var top = rows[0].separationAbove;
        var bottom = separationBelow(lines, rows);
        var header = rows.length > 1 ? rows[1].separationAbove : -1;
        var inner = -1;
        for (i = 2; i < rows.length; i++) {
            if (rows[i].separationAbove >= 0) {
                inner = rows[i].separationAbove;
                break;
            }
        }
        var headerWeight = horizontalWeight(lines, header);
        var innerWeight = horizontalWeight(lines, inner);
        //a border after the first line that is not the one used between the other lines
        //only exists when the first line is a header:
        var horizontalHeader = ('none' !== headerWeight && headerWeight !== innerWeight) ?
            'first_line' : 'none';

        var left = columns[0].from > 0 ? columns[0].from - 1 : -1;
        var right = columns[columns.length - 1].to < lines[0].length ?
            columns[columns.length - 1].to : -1;
        var innerHeaderPosition = columns.length > 1 ? columns[1].from - 1 : -1;
        var innerPosition = columns.length > 2 ? columns[2].from - 1 : -1;
        var innerHeaderWeight = verticalWeight(lines, rows, innerHeaderPosition);
        var innerVerticalWeight = verticalWeight(lines, rows, innerPosition);
        var verticalHeader = (-1 !== innerPosition && innerHeaderWeight !== innerVerticalWeight) ?
            'first_column' : 'none';
        if (-1 === innerPosition) {
            //with two columns there is no other inner border to compare with:
            innerVerticalWeight = innerHeaderWeight;
        }

        return {
            charset: unicode ? 'unicode' : 'ascii',
            horizontal_header: horizontalHeader,
            vertical_header: verticalHeader,
            horizontal_top_border: horizontalWeight(lines, top),
            horizontal_inner_header_border: 'none' !== headerWeight ? headerWeight : innerWeight,
            horizontal_inner_border: 'none' !== innerWeight ? innerWeight : 'none',
            horizontal_bottom_border: horizontalWeight(lines, bottom),
            vertical_left_border: verticalWeight(lines, rows, left),
            vertical_inner_header_border: innerHeaderWeight,
            vertical_inner_border: innerVerticalWeight,
            vertical_right_border: verticalWeight(lines, rows, right),
            ascii_intersection: unicode ? 'plus' : detectAsciiIntersection(lines, boundaries, rows),
            spacePadding: detectPadding(lines, columns, rows)
        };
    }

    function parse(text) {
        var r, c, span, cell, anchor, key;
        var lines = alignLines(splitLines(text || ''));
        var boundaries = findBoundaries(lines);
        var columns = findColumns(lines, boundaries);
        var rows = findRows(lines, columns);

        if (columns.length === 0 || rows.length === 0) {
            return {
                data: [],
                mergeCells: [],
                horizontalHeader: null,
                verticalHeader: null,
                configuration: null,
                error: 'No table could be recognized. The columns of the table must be ' +
                    'separated by a vertical border.'
            };
        }

        var data = [];
        var mergeCells = [];
        var covering = {};
        var cells = [];
        var drawnBoundaries = findDrawnBoundaries(lines, rows, columns);

        for (r = 0; r < rows.length; r++) {
            data.push([]);
            for (c = 0; c < columns.length; c++) {
                data[r].push('');
            }
        }

        for (r = 0; r < rows.length; r++) {
            c = 0;
            while (c < columns.length) {
                //how many columns this cell covers, a boundary that is not drawn
                //means that the cells on both sides are merged:
                span = 1;
                while (c + span < columns.length &&
                    drawnBoundaries[columns[c + span].from - 1] &&
                    !isBoundaryDrawn(lines, rows[r], columns[c + span].from - 1)) {
                    span++;
                }
                anchor = null;
                if (r > 0 && isSeparationOpen(lines, rows[r].separationAbove,
                        columns[c].from, columns[c + span - 1].to)) {
                    anchor = covering[(r - 1) + ',' + c];
                }
                if (anchor) {
                    //the cell of the row above continues here:
                    anchor.rowspan += 1;
                    anchor.extraRows.push(rows[r]);
                } else {
                    cell = {
                        row: r,
                        col: c,
                        rowspan: 1,
                        colspan: span,
                        from: columns[c].from,
                        to: columns[c + span - 1].to,
                        mainRow: rows[r],
                        extraRows: []
                    };
                    cells.push(cell);
                    anchor = cell;
                }
                for (var k = 0; k < span; k++) {
                    covering[r + ',' + (c + k)] = anchor;
                }
                c += span;
            }
        }

        for (var i = 0; i < cells.length; i++) {
            cell = cells[i];
            var parts = [cellText(lines, cell.mainRow, cell.from, cell.to)];
            for (var j = 0; j < cell.extraRows.length; j++) {
                parts.push(cellText(lines, cell.extraRows[j], cell.from, cell.to));
            }
            //a cell spanning several rows holds its text on one of them only,
            //depending on its vertical alignment:
            while (parts.length > 0 && '' === parts[0]) {
                parts.shift();
            }
            while (parts.length > 0 && '' === parts[parts.length - 1]) {
                parts.pop();
            }
            data[cell.row][cell.col] = parts.join('\n');
            if (cell.rowspan > 1 || cell.colspan > 1) {
                mergeCells.push({
                    row: cell.row,
                    col: cell.col,
                    rowspan: cell.rowspan,
                    colspan: cell.colspan
                });
            }
        }

        //the style is read from the drawing before the generated headers are removed,
        //they are part of it:
        var configuration = detectConfiguration(lines, boundaries, columns, rows);
        var headers = extractHeaders(data, mergeCells);
        if (headers.horizontalHeader) {
            configuration.horizontal_header = headers.horizontalHeader;
        }
        if (headers.verticalHeader) {
            configuration.vertical_header = headers.verticalHeader;
        }
        return {
            data: data,
            mergeCells: mergeCells,
            horizontalHeader: headers.horizontalHeader,
            verticalHeader: headers.verticalHeader,
            configuration: configuration,
            error: null
        };
    }

    return {
        parse: parse
    };
});
