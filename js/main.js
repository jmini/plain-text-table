(function(){
    "use strict";

    function createTable(){
        $("#table-wrapper").handsontable({
            colHeaders: false,
            contextMenu: true,
            afterChange: genPTT,
            afterCreateRow: genPTT,
            afterRemoveRow: genPTT,
            afterCreateCol: genPTT,
            afterRemoveCol: genPTT,
            afterSetCellMeta: genPTT
        });
    }

    createTable();
})();

function borderSelectGetFocus(cbbox){
    generateTable(cbbox.name);
}

function borderSelectChange(cbbox){
    generateTable(cbbox.name);
}

function borderSelectLostFocus(cbbox){
    generateTable(null);
}

function genPTT(){
    generateTable(null);
}

function generateTable(highlight){
    var unicode = {
        none: {
            none: {
                none: {
                    none: ' ',
                    single: ' ',
                    double: ' '
                },
                single: {
                    none: ' ',
                    single: '┐',
                    double: '╕'
                },
                double: {
                    none: ' ',
                    single: '╖',
                    double: '╗'
                },
            },
            single: {
                none: {
                    none: ' ',
                    single: '─',
                    double: 'X'
                },
                single: {
                    none: '┌',
                    single: '┬',
                    double: 'Z'
                },
                double: {
                    none: '╓',
                    single: '╥',
                    double: 'X'
                },
            },
            double: {
                none: {
                    none: ' ',
                    single: 'X',
                    double: '═'
                },
                single: {
                    none: '╒',
                    single: 'X',
                    double: '╤'
                },
                double: {
                    none: '╔',
                    single: 'X',
                    double: '╦'
                },
            },
        },
        single: {
            none: {
                none: {
                    none: ' ',
                    single: '┘',
                    double: '╛'
                },
                single: {
                    none: '│',
                    single: '┤',
                    double: '╡'
                },
                double: {
                    none: 'X',
                    single: 'X',
                    double: 'X'
                },
            },
            single: {
                none: {
                    none: '└',
                    single: '┴',
                    double: 'X'
                },
                single: {
                    none: '├',
                    single: '┼',
                    double: 'X'
                },
                double: {
                    none: 'X',
                    single: 'X',
                    double: 'X'
                },
            },
            double: {
                none: {
                    none: '╘',
                    single: 'X',
                    double: '╧'
                },
                single: {
                    none: '╞',
                    single: 'X',
                    double: '╪'
                },
                double: {
                    none: 'X',
                    single: 'X',
                    double: 'X'
                },
            },
        },
        double: {
            none: {
                none: {
                    none: ' ',
                    single: '╜',
                    double: '╝'
                },
                single: {
                    none: 'X',
                    single: 'X',
                    double: 'X'
                },
                double: {
                    none: '║',
                    single: '╢',
                    double: '╣'
                },
            },
            single: {
                none: {
                    none: '╙',
                    single: '╨',
                    double: 'X'
                },
                single: {
                    none: 'D',
                    single: 'X',
                    double: 'X'
                },
                double: {
                    none: '╟',
                    single: '╫',
                    double: 'X'
                },
            },
            double: {
                none: {
                    none: '╚',
                    single: 'X',
                    double: '╩'
                },
                single: {
                    none: 'X',
                    single: 'X',
                    double: 'X'
                },
                double: {
                    none: '╠',
                    single: 'X',
                    double: '╬'
                }
            }
        }
    };
    var spacePadding = document.getElementById("spacePadding").checked;
    
    var horizontalHeader = document.getElementById("horizontal_header").value;
    var horizontalTopBorder = document.getElementById("horizontal_top_border").value;
    var horizontalInnerHeaderBorder = document.getElementById("horizontal_inner_header_border").value;
    var horizontalInnerBorder = document.getElementById("horizontal_inner_border").value;
    var horizontalBottomBorder = document.getElementById("horizontal_bottom_border").value;
    
    var verticalHeader = document.getElementById("vertical_header").value;
    var verticalLeftBorder = document.getElementById("vertical_left_border").value;
    var verticalInnerHeaderBorder = document.getElementById("vertical_inner_header_border").value;
    var verticalInnerBorder = document.getElementById("vertical_inner_border").value;
    var verticalRightBorder = document.getElementById("vertical_right_border").value;
    
    var data = extractData(spacePadding, horizontalHeader, verticalHeader);
    var widths = getWidths(data, spacePadding);
    var heights = getHeights(data, spacePadding);
    var str = "";
    var i, j, k, m, entry, item, offsets, end;

    // top
    if ('none' != horizontalTopBorder) {
        str += generateUnicodeSeparationLine(widths, highlight, unicode, verticalHeader, verticalLeftBorder, verticalInnerHeaderBorder, verticalInnerBorder, verticalRightBorder, "horizontal_top_border", true, false, horizontalTopBorder);
    }

    // rows
    for (i = 0; i < heights.length; i++) {
        offsets = [];
        for (j = 0; j < widths.length; j++) {
            if('bottom' == data.arr[i][j].vAlign) {
                offsets[j] = data.arr[i][j].pseudoRows.length - heights[i];
            } else if ('middle' == data.arr[i][j].vAlign) {
                offsets[j] = Math.ceil((data.arr[i][j].pseudoRows.length - heights[i]) / 2);
            } else {
                offsets[j] = 0;
            }
        }

        for (m = 0; m < heights[i]; m++) {
            str += openHighlighted(highlight, "vertical_left_border");
            str += unicode[verticalLeftBorder]['none'][verticalLeftBorder]['none'];
            str += closeHighlighted(highlight, "vertical_left_border");
            for (j = 0; j < widths.length; j++) {
                item = data.arr[i][j];
                if(item.empty) {
                    entry = '';
                } else {
                    entry = item.pseudoRows[m + offsets[j]] || '';
                }
                if('right' == data.arr[i][j].hAlign) {
                    end = widths[j] - entry.length;
                } else if ('center' == data.arr[i][j].hAlign) {
                    end = Math.floor((widths[j] - entry.length) / 2);
                } else {
                    end = 0;
                }
                for (k = 0; k < end; k++) {
                    str += ' ';
                }
                str += entry;
                end = widths[j] - entry.length - end;
                for (k = 0; k < end; k++) {
                    str += ' ';
                }
                if ('none' != verticalHeader && j == 0 && heights.length > 0) {
                    str += openHighlighted(highlight, "vertical_inner_header_border");
                    str += unicode[verticalInnerHeaderBorder]['none'][verticalInnerHeaderBorder]['none'];
                    str += closeHighlighted(highlight, "vertical_inner_header_border");
                } else if(j < widths.length - 1) {
                    str += openHighlighted(highlight, "vertical_inner_border");
                    str += unicode[verticalInnerBorder]['none'][verticalInnerBorder]['none'];
                    str += closeHighlighted(highlight, "vertical_inner_border");
                }
            }
            str += openHighlighted(highlight, "vertical_right_border");
            str += unicode[verticalRightBorder]['none'][verticalRightBorder]['none'];
            str += closeHighlighted(highlight, "vertical_right_border");
            str += '\n';
        }

        if ('none' != horizontalInnerHeaderBorder && 'none' != horizontalHeader && i == 0 && heights.length > 0) {
            str += generateUnicodeSeparationLine(widths, highlight, unicode, verticalHeader, verticalLeftBorder, verticalInnerHeaderBorder, verticalInnerBorder, verticalRightBorder, "horizontal_inner_header_border", false, false, horizontalInnerHeaderBorder);
        } else if('none' != horizontalInnerBorder && i < heights.length - 1) {
            str += generateUnicodeSeparationLine(widths, highlight, unicode, verticalHeader, verticalLeftBorder, verticalInnerHeaderBorder, verticalInnerBorder, verticalRightBorder, "horizontal_inner_border", false, false, horizontalInnerBorder);
        }
    }

    // bottom
    if ('none' != horizontalBottomBorder) {
        str += generateUnicodeSeparationLine(widths, highlight, unicode, verticalHeader, verticalLeftBorder, verticalInnerHeaderBorder, verticalInnerBorder, verticalRightBorder, "horizontal_bottom_border", false, true, horizontalBottomBorder);
    }
    $('#ptt-wrapper').html(str);
}

function extractData(spacePadding, horizontalHeader, verticalHeader){
    var i, j, k, item, lines, w, meta, vAlign, hAlign, vLen, hLen;
    var result = [];
    var table = $('#table-wrapper');
    var arr = table.handsontable('getData');
    var iOffset = 0;
    var jOffset = 0;
    for(i = 0; i < arr.length; i++) {
        if(i == 0 && ('number' == horizontalHeader || 'letter' == horizontalHeader)) {
            result.push([]);
            if('number' == verticalHeader || 'letter' == verticalHeader) {
                //add an empty item that will be replaced later:
                result[0][0] = {empty: true};
                jOffset = 1;
            }
            for (j = 0; j < arr[i].length; j++) {
                //add an empty item that will be replaced later:
                result[0][j + jOffset] = {empty: true};
            }
            iOffset = 1;
        }
        result.push([]);
        if('number' == verticalHeader || 'letter' == verticalHeader) {
            //add an empty item that will be replaced later:
            result[i + iOffset][0] = {empty: true};
            jOffset = 1;
        }
        for (j = 0; j < arr[i].length; j++) {
            item = arr[i][j];
            if (! item) {
                result[i + iOffset][j + jOffset] = {empty: true};
            } else {
                w = 0;
                lines = item.split('\n');
                for (k = 0; k < lines.length; k++) {
                    if(spacePadding) {
                        if(lines[k].indexOf(' ', 0) !== 0) {
                            lines[k] = ' ' + lines[k];
                        }
                        if(lines[k].indexOf(' ', lines[k].length - 1) === -1) {
                            lines[k] = lines[k] + ' ';
                        }
                    }
                    if (lines[k].length > w) {
                        w = lines[k].length;
                    }
                }
                meta = table.handsontable('getCellMeta', i, j);
                hAlign = 'left';
                vAlign = 'top';
                if(meta.className) {
                    if(meta.className.indexOf('htCenter') > -1) {
                        hAlign = 'center';
                    } else if(meta.className.indexOf('htRight') > -1) {
                        hAlign = 'right';
                    } else if(meta.className.indexOf('htJustify') > -1) {
                        hAlign = 'justify';
                    }
                    if(meta.className.indexOf('htMiddle') > -1) {
                        vAlign = 'middle';
                    } else if(meta.className.indexOf('htBottom') > -1) {
                        vAlign = 'bottom';
                    }
                }
                result[i + iOffset][j + jOffset] = {empty: false, pseudoRows: lines, maxWidth: w, vAlign: vAlign, hAlign: hAlign};
            }
        }
    }
    vLen = getVLen(result, (i + iOffset - 1), (j + jOffset - 1));
    hLen = getHLen(result, (i + iOffset - 1), (j + jOffset - 1));
    if('none' != verticalHeader) {
        jOffset = 1;
    }
    if('number' == horizontalHeader || 'letter' == horizontalHeader) {
        for (j = 0; j < hLen - jOffset; j++) {
            result[0][j + jOffset] = generateHeader(horizontalHeader, spacePadding, j);
        }
    }
    if('none' != horizontalHeader) {
        iOffset = 1;
    }
    if('number' == verticalHeader || 'letter' == verticalHeader) {
        for (i = 0; i < vLen - iOffset; i++) {
            result[i + iOffset][0] = generateHeader(verticalHeader, spacePadding, i);
        }
    }
    return {arr: result, vLen: vLen, hLen: hLen};
}

function getVLen(arr, vMax, hMax){
    var i, j, item;

    for (i = vMax; i >= 0; i--) {
        for (j = 0; j <= hMax; j++) {
            item = arr[i][j];
            if (!item.empty) {
                return i + 1;
            }
        }
    }
    return 0;
}

function getHLen(arr, vMax, hMax){
    var i, j, item;

    for (j = hMax; j >= 0; j--) {
        for (i = 0; i <= vMax; i++) {
            item = arr[i][j];
            if (!item.empty) {
                return j + 1;
            }
        }
    }
    return 0;
}

function generateHeader(headerType, spacePadding, id) {
    var str = "";
    var num, s;
    if (spacePadding) {
        str += ' ';
    }
    if('letter' == headerType) {
        s = '';
        num = id;
        do {
            s = String.fromCharCode(65 + (num % 26)) + s;
            num = Math.floor(num / 26) - 1;
        } while(num > -1);
        str += s;
    } else {
        str += (id + 1).toString();
    }
    if (spacePadding) {
        str += ' ';
    }
    return {empty: false, pseudoRows: [str], maxWidth: str.length, vAlign: 'middle', hAlign: 'center'};
}

function getWidths(data, spacePadding){
    var widths = [];
    var i, j, w, item;

    for (j = 0; j < data.hLen; j++) {
        w = 0;
        if(spacePadding) {
            w = 1;
        }
        for (i = 0; i < data.vLen; i++) {
            item = data.arr[i][j];
            if (!item.empty) {
                if (item.maxWidth > w) {
                    w = item.maxWidth;
                }
            }
        }
        widths[j] = w;
    }
    return widths;
}

function getHeights(data, spacePadding){
    var heights = [];
    var i, j, h, item;

    for (i = 0; i < data.vLen; i++) {
        h = 0;
        if(spacePadding) {
            h = 1;
        }
        for (j = 0; j < data.hLen; j++) {
            item = data.arr[i][j];
            if (!item.empty) {
                if (item.pseudoRows.length > h) {
                    h = item.pseudoRows.length;
                }
            }
        }
        heights[i] = h;
    }
    return heights;
}

function generateUnicodeSeparationLine(widths, highlight, unicode, verticalHeader, verticalLeftBorder, verticalInnerHeaderBorder, verticalInnerBorder, verticalRightBorder, horizontalLineMarker, top, bottom, horizontalBorder){
    
    var leftChar = unicode[(top) ? 'none' : verticalLeftBorder][horizontalBorder][(bottom) ? 'none' : verticalLeftBorder]['none'];
    var inHeadCh = unicode[(top) ? 'none' : verticalInnerHeaderBorder][horizontalBorder][(bottom) ? 'none' : verticalInnerHeaderBorder][horizontalBorder];
    var innerCha = unicode[(top) ? 'none' : verticalInnerBorder][horizontalBorder][(bottom) ? 'none' : verticalInnerBorder][horizontalBorder];
    var rightCha = unicode[(top) ? 'none' : verticalRightBorder]['none'][(bottom) ? 'none' : verticalRightBorder][horizontalBorder];
    
    var horizontalChar = unicode['none'][horizontalBorder]['none'][horizontalBorder];
    
    return generateSeparationLine(widths, highlight, verticalHeader, horizontalLineMarker, leftChar, inHeadCh, innerCha, rightCha, horizontalChar);
}

function generateSeparationLine(widths, highlight, verticalHeader, horizontalLineMarker, leftChar, innerHeaderChar, innerChar, rightChar, horizontalChar){
    var j, k;
    var str = "";
    str += openHighlighted(highlight, horizontalLineMarker);
    str += openHighlighted(highlight, "vertical_left_border");
    str += leftChar;
    str += closeHighlighted(highlight, "vertical_left_border");
    for (j = 0; j < widths.length; j++) {
        for (k = 0; k < widths[j]; k++) {
            str += horizontalChar;
        }
        if ('none' != verticalHeader && j == 0) {
            str += openHighlighted(highlight, "vertical_inner_header_border");
            str += innerHeaderChar;
            str += closeHighlighted(highlight, "vertical_inner_header_border");
        } else if(j < widths.length - 1) {
            str += openHighlighted(highlight, "vertical_inner_border");
            str += innerChar;
            str += closeHighlighted(highlight, "vertical_inner_border");
        }
    }
    str += openHighlighted(highlight, "vertical_right_border");
    str += rightChar;
    str += closeHighlighted(highlight, "vertical_right_border");
    str += closeHighlighted(highlight, horizontalLineMarker);
    str += '\n';
    return str;
}

function openHighlighted(highlight, key){
    if(key == highlight) {
        return '<span class="highlighted">';
    } else {
        return '';
    }
}

function closeHighlighted(highlight, key){
    if(key == highlight) {
        return '</span>';
    } else {
        return '';
    }
}

