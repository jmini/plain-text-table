(function(){
    "use strict";

    function createTable(){
        $("#table-wrapper").handsontable({
            colHeaders: false,
            contextMenu: true,
            afterChange: genPTT
        });
    }

    createTable();
})();

function genPTT(){
    var style;
    var styleOption = document.getElementById('style').value;
    if('double' == styleOption) {
        style = {
            horizontal: '═',
            vertical: '║',
            top_left: '╔',
            top_center: '╦',
            top_right: '╗',
            middle_left: '╠',
            middle_center: '╬',
            middle_right: '╣',
            bottom_left: '╚',
            bottom_center: '╩',
            bottom_right: '╝'
        }
    } else if('ascii' == styleOption) {
        style = {
            horizontal: '-',
            vertical: '|',
            top_left: '+',
            top_center: '+',
            top_right: '+',
            middle_left: '+',
            middle_center: '+',
            middle_right: '+',
            bottom_left: '+',
            bottom_center: '+',
            bottom_right: '+'
        }
    } else {
        style = {
            horizontal: '─',
            vertical: '│',
            top_left: '┌',
            top_center: '┬',
            top_right: '┐',
            middle_left: '├',
            middle_center: '┼',
            middle_right: '┤',
            bottom_left: '└',
            bottom_center: '┴',
            bottom_right: '┘'
        }
    }
    var spacePadding = document.getElementById("spacePadding").checked

    var data = extractData(spacePadding);
    var widths = getWidths(data, spacePadding);
    var str = "";
    var i, j, k, m, entry, row, pseudoRows, plen;
    var typeOption = document.getElementById('type').value;

    // top
    str += generateSeparationLine(widths, style, 'top_left', 'top_center', 'top_right');

    // rows
    var arr = data['arr'];
    for (k = 0; k < arr.length; k++) {

        row = arr[k];
        pseudoRows = [];

        for (i = 0; i < widths.length; i++) {
            entry = arr[k][i];
            if (entry['empty']) continue;
            entry = entry['pseudoRows'];
            plen = pseudoRows.length;
            for (j = 0; j < entry.length - plen; j++) {
                pseudoRows.push([]);
            }
            for (j = 0; j < entry.length; j++) {
                pseudoRows[j][i] = entry[j];
            }
        }

        for (m = 0; m < pseudoRows.length; m++) {
            str += style['vertical'];
            for (i = 0; i < widths.length; i++) {
                entry = pseudoRows[m][i] || '';
                str += entry;
                for (j = entry.length; j < widths[i]; j++) {
                    str += ' ';
                }
                if (i < widths.length-1) {
                    str += style['vertical'];
                }
            }
            str += style['vertical'];
            str += '\n';
        }

        if (('grid' == typeOption && k < arr.length-1) || ('header' == typeOption && k == 0)) {
            str += generateSeparationLine(widths, style, 'middle_left', 'middle_center', 'middle_right');
        }
    }

    // bottom
    str += generateSeparationLine(widths, style, 'bottom_left', 'bottom_center', 'bottom_right');
    $('#ptt-wrapper').text(str);
}

function extractData(spacePadding){
    var item, lines, w;
    var result = [];
    var arr = $('#table-wrapper').handsontable('getData');
    for(i = 0; i < arr.length; i++) {
        result.push([]);
        for (j = 0; j < arr[i].length; j++) {
            item = arr[i][j];
            if (! item) {
                result[i][j] = {empty: true};
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
                result[i][j] = {empty: false, pseudoRows: lines, maxWidth: w};
            }
        }
    }
    return {arr: result, vLen: i, hLen: j};
}

function getWidths(data, spacePadding){
    var widths = [];
    var i, j, w, item;
    var hasContent = false;

    for (j = data['hLen'] - 1; j >= 0; j--) {
        w = 0;
        for(i = 0; i < data['vLen']; i++) {
            item = data['arr'][i][j];
            if (!item['empty']) {
                if (item['maxWidth'] > w) {
                    w = item['maxWidth'];
                }
            }
        }
        if(hasContent || w > 0) {
            if(spacePadding && w == 0) {
                w = 1;
            }
            widths[j] = w;
            hasContent = true;
        }
    }
    return widths;
}

function generateSeparationLine(widths, style, leftKey, centerKey, rightKey){
    var str = "";
    str += style[leftKey];
    for (i = 0; i < widths.length; i++) {
        for (j = 0; j < widths[i]; j++) {
            str += style['horizontal'];
        }
        if (i < widths.length-1) {
            str += style[centerKey];
        }
    }
    str += style[rightKey];
    str += '\n';
    return str;
}
