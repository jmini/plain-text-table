(function() {
    "use strict";

    function createTable() {
        $("#table-wrapper").handsontable({
            colHeaders: false,
            contextMenu: true,
            mergeCells: true,
            afterRender: genPTT
        });
    }

    createTable();

    updateAsciiIntersectionVisibility(document.getElementById("charset").value);
    updateHorizontalInnerHeaderBorderVisibility(document.getElementById("horizontal_header").value);
    updateVerticalInnerHeaderBorderVisibility(document.getElementById("vertical_header").value);
})();

function charsetSelectChange(cbbox) {
    updateAsciiIntersectionVisibility(cbbox.value);
    generateTable(null);
}

function updateAsciiIntersectionVisibility(charsetValue) {
    if ('ascii' == charsetValue) {
        $('#p_ascii_intersection').show();

        if ('double' == $('#vertical_left_border').val()) {
            $('#vertical_left_border').val('single');
        }
        $("#vertical_left_border option[value='double']").remove();

        if ('double' == $('#vertical_inner_header_border').val()) {
            $('#vertical_inner_header_border').val('single');
        }
        $("#vertical_inner_header_border option[value='double']").remove();

        if ('double' == $('#vertical_inner_border').val()) {
            $('#vertical_inner_border').val('single');
        }
        $("#vertical_inner_border option[value='double']").remove();

        if ('double' == $('#vertical_right_border').val()) {
            $('#vertical_right_border').val('single');
        }
        $("#vertical_right_border option[value='double']").remove();

    } else {
        $('#p_ascii_intersection').hide();

        if ($("#vertical_left_border option[value='double']").length == 0) {
            $("#vertical_left_border").append('<option value="double">Double</option>');
        }
        if ($("#vertical_inner_header_border option[value='double']").length == 0) {
            $("#vertical_inner_header_border").append('<option value="double">Double</option>');
        }
        if ($("#vertical_inner_border option[value='double']").length == 0) {
            $("#vertical_inner_border").append('<option value="double">Double</option>');
        }
        if ($("#vertical_right_border option[value='double']").length == 0) {
            $("#vertical_right_border").append('<option value="double">Double</option>');
        }
    }
}

function horizontalHeaderSelectChange(cbbox) {
    updateHorizontalInnerHeaderBorderVisibility(cbbox.value);
    generateTable(null);
}

function updateHorizontalInnerHeaderBorderVisibility(horizontalHeaderValue) {
    if ('none' == horizontalHeaderValue) {
        $('#p_horizontal_inner_header_border').hide();
    } else {
        $('#p_horizontal_inner_header_border').show();
    }
}

function verticalHeaderSelectChange(cbbox) {
    updateVerticalInnerHeaderBorderVisibility(cbbox.value);
    generateTable(null);
}

function updateVerticalInnerHeaderBorderVisibility(verticalHeaderValue) {
    if ('none' == verticalHeaderValue) {
        $('#p_vertical_inner_header_border').hide();
    } else {
        $('#p_vertical_inner_header_border').show();
    }
}

function borderSelectGetFocus(cbbox) {
    generateTable(cbbox.name.substring(0, cbbox.name.length - 6));
}

function borderSelectChange(cbbox) {
    generateTable(cbbox.name.substring(0, cbbox.name.length - 6));
}

function borderSelectLostFocus(cbbox) {
    generateTable(null);
}

function predefinedStyle(value) {
    //the Ascii charset removes the 'double' option of the vertical borders, it is put
    //back before the values below are set, otherwise a style asking for a double
    //vertical border would silently not be applied:
    updateAsciiIntersectionVisibility('unicode');
    if ('unicode2' == value) {
        $('#charset').val('unicode');
        $('#horizontal_header').val('first_line');
        $('#vertical_header').val('first_column');
        $('#horizontal_top_border').val('double');
        $('#horizontal_inner_header_border').val('single');
        $('#horizontal_inner_border').val('none');
        $('#horizontal_bottom_border').val('double');
        $('#vertical_left_border').val('double');
        $('#vertical_inner_header_border').val('single');
        $('#vertical_inner_border').val('none');
        $('#vertical_right_border').val('double');
        $('#ascii_intersection').val('plus');
        $('#spacePadding').prop('checked', true);
    } else if ('unicode3' == value) {
        $('#charset').val('unicode');
        $('#horizontal_header').val('first_line');
        $('#vertical_header').val('first_column');
        $('#horizontal_top_border').val('none');
        $('#horizontal_inner_header_border').val('double');
        $('#horizontal_inner_border').val('none');
        $('#horizontal_bottom_border').val('none');
        $('#vertical_left_border').val('none');
        $('#vertical_inner_header_border').val('single');
        $('#vertical_inner_border').val('none');
        $('#vertical_right_border').val('none');
        $('#ascii_intersection').val('plus');
        $('#spacePadding').prop('checked', true);
    } else if ('unicode4' == value) {
        $('#charset').val('unicode');
        $('#horizontal_header').val('letter');
        $('#vertical_header').val('number');
        $('#horizontal_top_border').val('double');
        $('#horizontal_inner_header_border').val('double');
        $('#horizontal_inner_border').val('single');
        $('#horizontal_bottom_border').val('double');
        $('#vertical_left_border').val('double');
        $('#vertical_inner_header_border').val('double');
        $('#vertical_inner_border').val('single');
        $('#vertical_right_border').val('double');
        $('#ascii_intersection').val('plus');
        $('#spacePadding').prop('checked', true);
    } else if ('unicode5' == value) {
        $('#charset').val('unicode');
        $('#horizontal_header').val('letter');
        $('#vertical_header').val('number');
        $('#horizontal_top_border').val('none');
        $('#horizontal_inner_header_border').val('double');
        $('#horizontal_inner_border').val('none');
        $('#horizontal_bottom_border').val('none');
        $('#vertical_left_border').val('none');
        $('#vertical_inner_header_border').val('double');
        $('#vertical_inner_border').val('single');
        $('#vertical_right_border').val('none');
        $('#ascii_intersection').val('plus');
        $('#spacePadding').prop('checked', true);
    } else if ('unicode6' == value) {
        $('#charset').val('unicode');
        $('#horizontal_header').val('first_line');
        $('#vertical_header').val('letter');
        $('#horizontal_top_border').val('none');
        $('#horizontal_inner_header_border').val('single');
        $('#horizontal_inner_border').val('none');
        $('#horizontal_bottom_border').val('none');
        $('#vertical_left_border').val('single');
        $('#vertical_inner_header_border').val('single');
        $('#vertical_inner_border').val('single');
        $('#vertical_right_border').val('single');
        $('#ascii_intersection').val('plus');
        $('#spacePadding').prop('checked', true);
    } else if ('ascii1' == value) {
        $('#charset').val('ascii');
        $('#horizontal_header').val('first_line');
        $('#vertical_header').val('none');
        $('#horizontal_top_border').val('double');
        $('#horizontal_inner_header_border').val('double');
        $('#horizontal_inner_border').val('single');
        $('#horizontal_bottom_border').val('double');
        $('#vertical_left_border').val('single');
        $('#vertical_inner_header_border').val('single');
        $('#vertical_inner_border').val('single');
        $('#vertical_right_border').val('single');
        $('#ascii_intersection').val('horizontal_border');
        $('#spacePadding').prop('checked', true);
    } else if ('ascii2' == value) {
        $('#charset').val('ascii');
        $('#horizontal_header').val('first_line');
        $('#vertical_header').val('none');
        $('#horizontal_top_border').val('single');
        $('#horizontal_inner_header_border').val('single');
        $('#horizontal_inner_border').val('none');
        $('#horizontal_bottom_border').val('single');
        $('#vertical_left_border').val('single');
        $('#vertical_inner_header_border').val('single');
        $('#vertical_inner_border').val('single');
        $('#vertical_right_border').val('single');
        $('#ascii_intersection').val('plus');
        $('#spacePadding').prop('checked', true);
    } else if ('ascii3' == value) {
        $('#charset').val('ascii');
        $('#horizontal_header').val('first_line');
        $('#vertical_header').val('none');
        $('#horizontal_top_border').val('none');
        $('#horizontal_inner_header_border').val('single');
        $('#horizontal_inner_border').val('none');
        $('#horizontal_bottom_border').val('none');
        $('#vertical_left_border').val('none');
        $('#vertical_inner_header_border').val('none');
        $('#vertical_inner_border').val('none');
        $('#vertical_right_border').val('none');
        $('#ascii_intersection').val('vertical_border');
        $('#spacePadding').prop('checked', true);
    } else if ('ascii4' == value) {
        $('#charset').val('ascii');
        $('#horizontal_header').val('first_line');
        $('#vertical_header').val('none');
        $('#horizontal_top_border').val('none');
        $('#horizontal_inner_header_border').val('single');
        $('#horizontal_inner_border').val('none');
        $('#horizontal_bottom_border').val('none');
        $('#vertical_left_border').val('single');
        $('#vertical_inner_header_border').val('single');
        $('#vertical_inner_border').val('single');
        $('#vertical_right_border').val('single');
        $('#ascii_intersection').val('vertical_border');
        $('#spacePadding').prop('checked', true);
    } else if ('ascii5' == value) {
        $('#charset').val('ascii');
        $('#horizontal_header').val('letter');
        $('#vertical_header').val('number');
        $('#horizontal_top_border').val('none');
        $('#horizontal_inner_header_border').val('single');
        $('#horizontal_inner_border').val('none');
        $('#horizontal_bottom_border').val('none');
        $('#vertical_left_border').val('none');
        $('#vertical_inner_header_border').val('single');
        $('#vertical_inner_border').val('none');
        $('#vertical_right_border').val('none');
        $('#ascii_intersection').val('plus');
        $('#spacePadding').prop('checked', true);
    } else if ('ascii6' == value) {
        $('#charset').val('ascii');
        $('#horizontal_header').val('letter');
        $('#vertical_header').val('number');
        $('#horizontal_top_border').val('double');
        $('#horizontal_inner_header_border').val('double');
        $('#horizontal_inner_border').val('single');
        $('#horizontal_bottom_border').val('double');
        $('#vertical_left_border').val('single');
        $('#vertical_inner_header_border').val('single');
        $('#vertical_inner_border').val('single');
        $('#vertical_right_border').val('single');
        $('#ascii_intersection').val('plus');
        $('#spacePadding').prop('checked', true);
    } else {
        $('#charset').val('unicode');
        $('#horizontal_header').val('first_line');
        $('#vertical_header').val('none');
        $('#horizontal_top_border').val('double');
        $('#horizontal_inner_header_border').val('double');
        $('#horizontal_inner_border').val('single');
        $('#horizontal_bottom_border').val('double');
        $('#vertical_left_border').val('double');
        $('#vertical_inner_header_border').val('none');
        $('#vertical_inner_border').val('single');
        $('#vertical_right_border').val('double');
        $('#ascii_intersection').val('plus');
        $('#spacePadding').prop('checked', true);
    }
    updateAsciiIntersectionVisibility(document.getElementById("charset").value);
    updateHorizontalInnerHeaderBorderVisibility(document.getElementById("horizontal_header").value);
    updateVerticalInnerHeaderBorderVisibility(document.getElementById("vertical_header").value);
    generateTable(null);
}

function genPTT() {
    generateTable(null);
}

var configurationFields = [
    'charset',
    'horizontal_header',
    'vertical_header',
    'horizontal_top_border',
    'horizontal_inner_header_border',
    'horizontal_inner_border',
    'horizontal_bottom_border',
    'vertical_left_border',
    'vertical_inner_header_border',
    'vertical_inner_border',
    'vertical_right_border',
    'ascii_intersection'
];

function readConfiguration() {
    var i, id;
    var configuration = {};
    for (i = 0; i < configurationFields.length; i++) {
        id = configurationFields[i];
        configuration[id] = $('#' + id).val();
    }
    configuration.spacePadding = $('#spacePadding').prop('checked');
    return configuration;
}

function applyConfiguration(configuration) {
    var i, id;
    if (hasOption('charset', configuration.charset)) {
        $('#charset').val(configuration.charset);
    }
    //the Ascii charset removes the 'double' option of the vertical borders,
    //so the available options must be updated before the border values are set:
    updateAsciiIntersectionVisibility(document.getElementById("charset").value);
    for (i = 1; i < configurationFields.length; i++) {
        id = configurationFields[i];
        //a value that the select does not offer is ignored, so that a link with an
        //unknown or impossible combination does not leave the select without value:
        if (hasOption(id, configuration[id])) {
            $('#' + id).val(configuration[id]);
        }
    }
    $('#spacePadding').prop('checked', false !== configuration.spacePadding);
    updateHorizontalInnerHeaderBorderVisibility(document.getElementById("horizontal_header").value);
    updateVerticalInnerHeaderBorderVisibility(document.getElementById("vertical_header").value);
}

function hasOption(id, value) {
    var i;
    var options = document.getElementById(id).options;
    for (i = 0; i < options.length; i++) {
        if (options[i].value === value) {
            return true;
        }
    }
    return false;
}

function readState() {
    var i, info;
    var table = $('#table-wrapper').handsontable('getInstance');
    var collection = table.mergeCells.mergedCellInfoCollection;
    var mergeCells = [];
    for (i = 0; i < collection.length; i++) {
        info = collection[i];
        mergeCells.push({
            row: info.row,
            col: info.col,
            rowspan: info.rowspan,
            colspan: info.colspan
        });
    }
    return {
        data: table.getData(),
        mergeCells: mergeCells,
        alignments: readAlignments(table),
        configuration: readConfiguration()
    };
}

//the text alignment set with the context menu is kept in the cell meta of the table,
//it is collected as a '<row>,<column>' map, since most cells have no alignment at all:
function readAlignments(table) {
    var i, j, meta;
    var alignments = {};
    var arr = table.getData();
    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr[i].length; j++) {
            meta = table.getCellMeta(i, j);
            if (meta.className) {
                alignments[i + ',' + j] = meta.className;
            }
        }
    }
    return alignments;
}

function resetAlignments(table) {
    var i, j;
    var arr = table.getData();
    for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr[i].length; j++) {
            if (table.getCellMeta(i, j).className) {
                table.setCellMeta(i, j, 'className', '');
            }
        }
    }
}

function applyAlignments(table, alignments) {
    var key, position;
    for (key in alignments) {
        if (alignments.hasOwnProperty(key)) {
            position = key.split(',');
            table.setCellMeta(Number(position[0]), Number(position[1]), 'className', alignments[key]);
        }
    }
}

function applyState(state) {
    var i, info;
    var table = $('#table-wrapper').handsontable('getInstance');
    var collection = table.mergeCells.mergedCellInfoCollection;
    if (state.configuration) {
        applyConfiguration(state.configuration);
    }
    //the merged cells of the previous content are dropped before the new data is loaded,
    //otherwise they could point outside of the new grid:
    collection.splice(0, collection.length);
    table.loadData(copyData(state.data));
    //the alignments are reset and not only added, otherwise the ones of the previous
    //content would stay on the cells the new one does not mention:
    resetAlignments(table);
    if (state.alignments) {
        applyAlignments(table, state.alignments);
    }
    if (state.mergeCells) {
        for (i = 0; i < state.mergeCells.length; i++) {
            info = state.mergeCells[i];
            //the collection takes ownership of the objects it is given, so a copy is stored:
            collection.setInfo({
                row: info.row,
                col: info.col,
                rowspan: info.rowspan,
                colspan: info.colspan
            });
        }
    }
    table.render();
    //the location already describes the state that was just applied:
    cancelSharedLocationUpdate();
}

function copyData(data) {
    var i;
    var result = [];
    for (i = 0; i < data.length; i++) {
        result.push(data[i].slice());
    }
    return result;
}

//Reads back a table pasted in the "Text" tab and puts it in the grid:
function readTextInput() {
    var result = plainTextTableParser.parse($('#text-input').val());
    if (result.error) {
        showTextInputFeedback(result.error);
        return;
    }
    //the grid is shown before it is filled: Handsontable measures the room it has when
    //it draws, and a hidden tab gives it none:
    $('.nav-tabs a[href="#grid-tab"]').tab('show');
    applyState({
        data: result.data,
        mergeCells: result.mergeCells,
        alignments: {},
        configuration: result.configuration
    });
    showTextInputFeedback(describeTable(result));
}

function describeTable(result) {
    var columns = result.data.length > 0 ? result.data[0].length : 0;
    var message = 'Read ' + result.data.length + ' rows and ' + columns + ' columns';
    if (result.mergeCells.length > 0) {
        message += ', ' + result.mergeCells.length + ' merged cells';
    }
    return message + '.';
}

//Puts the current output in the text area, as a starting point to edit it by hand:
function fillTextInput() {
    $('#text-input').val($('#ptt-wrapper').text());
    showTextInputFeedback('');
}

var textInputFeedbackTimeout = null;

function showTextInputFeedback(message) {
    $('#text-input-feedback').text(message);
    if (textInputFeedbackTimeout) {
        clearTimeout(textInputFeedbackTimeout);
    }
    textInputFeedbackTimeout = setTimeout(function() {
        $('#text-input-feedback').text('');
    }, 5000);
}

//Empties the grid, keeping the style that is configured:
function clearTable() {
    var i, j;
    var data = [];
    for (i = 0; i < 5; i++) {
        data.push([]);
        for (j = 0; j < 5; j++) {
            data[i].push('');
        }
    }
    applyState({
        data: data,
        mergeCells: [],
        alignments: {}
    });
}

function clearTextInput() {
    $('#text-input').val('');
    showTextInputFeedback('');
}

//The table is kept in the local storage of the browser, so that it survives a reload.
//It never leaves the browser, exactly like the rest of what the tool does.
var storageKey = 'plain-text-table.state';
var storageTimeout = null;

function saveStateLater() {
    if (storageTimeout) {
        clearTimeout(storageTimeout);
    }
    //the table is re-rendered at each key stroke, so the write is delayed:
    storageTimeout = setTimeout(saveState, 500);
}

function saveState() {
    storageTimeout = null;
    try {
        window.localStorage.setItem(storageKey, JSON.stringify(readState()));
    } catch (e) {
        //the storage can be disabled or full, the tool works without it
    }
}

function loadStoredState() {
    var stored = null;
    try {
        stored = window.localStorage.getItem(storageKey);
    } catch (e) {
        return false;
    }
    if (!stored) {
        return false;
    }
    try {
        applyState(JSON.parse(stored));
        return true;
    } catch (e) {
        console.log('The table of the previous visit could not be read: ' + e.message);
        return false;
    }
}

var sharePrefix = 'ptt:';

function shareLink() {
    var json = JSON.stringify(readState());
    var payload = toBase64Url(pako.deflate(json));
    return window.location.href.split('#')[0] + '#' + sharePrefix + payload;
}

var sharedLocationTimeout = null;

//when the location holds a shared table, it keeps following the changes made to the
//table, so that the address bar always contains a link to what is on the screen.
//A page opened without a shared table keeps a clean address bar until the user asks
//for a link with the button:
function updateSharedLocation() {
    if (!isSharedLocation()) {
        return;
    }
    cancelSharedLocationUpdate();
    //the table is re-rendered at each key stroke, so the update is delayed:
    sharedLocationTimeout = setTimeout(function() {
        sharedLocationTimeout = null;
        if (isSharedLocation()) {
            writeSharedLocation();
        }
    }, 500);
}

function cancelSharedLocationUpdate() {
    if (sharedLocationTimeout) {
        clearTimeout(sharedLocationTimeout);
        sharedLocationTimeout = null;
    }
}

function isSharedLocation() {
    return 0 === window.location.hash.indexOf('#' + sharePrefix);
}

function writeSharedLocation() {
    //replaceState() does not fire the hashchange event, so the table is not reloaded:
    if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', shareLink());
    }
}

function loadSharedState() {
    var hash = window.location.hash;
    if (0 !== hash.indexOf('#' + sharePrefix)) {
        return false;
    }
    try {
        var bytes = fromBase64Url(hash.substring(sharePrefix.length + 1));
        applyState(JSON.parse(pako.inflate(bytes, {
            to: 'string'
        })));
        return true;
    } catch (e) {
        console.log('The shared table could not be read from the link: ' + e.message);
        return false;
    }
}

function toBase64Url(bytes) {
    var i;
    var binary = '';
    for (i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text) {
    var i;
    var base64 = text.replace(/-/g, '+').replace(/_/g, '/');
    while (0 !== base64.length % 4) {
        base64 += '=';
    }
    var binary = atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

function copyShareLink() {
    var link = shareLink();
    cancelSharedLocationUpdate();
    if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', link);
    } else {
        window.location.hash = link.split('#')[1];
    }
    copyToClipboard(link, 'Link copied!');
}

function copyOutput() {
    copyToClipboard($('#ptt-wrapper').text(), 'Copied!');
}

function copyToClipboard(text, message) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showCopyFeedback(message);
        }, function() {
            copyToClipboardFallback(text, message);
        });
    } else {
        copyToClipboardFallback(text, message);
    }
}

function copyToClipboardFallback(text, message) {
    var copied = false;
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        copied = document.execCommand('copy');
    } catch (e) {
        copied = false;
    }
    document.body.removeChild(textarea);
    showCopyFeedback(copied ? message : 'Copy failed, select the text and press Ctrl+C.');
}

var copyFeedbackTimeout = null;

function showCopyFeedback(message) {
    $('#copy-feedback').text(message);
    if (copyFeedbackTimeout) {
        clearTimeout(copyFeedbackTimeout);
    }
    copyFeedbackTimeout = setTimeout(function() {
        $('#copy-feedback').text('');
    }, 3000);
}

function generateTable(highlight) {
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
                },
                single: {
                    none: '┌',
                    single: '┬',
                    double: 'Z'
                },
                double: {
                    none: '╓',
                    single: '╥',
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
                    double: '╤'
                },
                double: {
                    none: '╔',
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
            },
            single: {
                none: {
                    none: '└',
                    single: '┴',
                },
                single: {
                    none: '├',
                    single: '┼',
                },
            },
            double: {
                none: {
                    none: '╘',
                    double: '╧'
                },
                single: {
                    none: '╞',
                    double: '╪'
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
                },
                single: {
                    none: 'D',
                },
                double: {
                    none: '╟',
                    single: '╫',
                },
            },
            double: {
                none: {
                    none: '╚',
                    double: '╩'
                },
                double: {
                    none: '╠',
                    double: '╬'
                }
            }
        }
    };
    var line = {
        ascii: {
            none: {
                vertical: ' ',
                horizontal: ' '
            },
            single: {
                vertical: '|',
                horizontal: '-'
            },
            double: {
                horizontal: '='
            }
        },
        unicode: {
            none: {
                vertical: ' ',
                horizontal: ' '
            },
            single: {
                vertical: unicode.single.none.single.none,
                horizontal: unicode.none.single.none.single
            },
            double: {
                vertical: unicode.double.none.double.none,
                horizontal: unicode.none.double.none.double
            }
        }
    };
    var spacePadding = document.getElementById("spacePadding").checked;

    var charset = document.getElementById("charset").value;

    var horizontalHeader = document.getElementById("horizontal_header").value;
    var verticalHeader = document.getElementById("vertical_header").value;

    var border = {
        horizontalTop: document.getElementById("horizontal_top_border").value,
        horizontalInnerHeader: document.getElementById("horizontal_inner_header_border").value,
        horizontalInner: document.getElementById("horizontal_inner_border").value,
        horizontalBottom: document.getElementById("horizontal_bottom_border").value,

        verticalLeft: document.getElementById("vertical_left_border").value,
        verticalInnerHeader: document.getElementById("vertical_inner_header_border").value,
        verticalInner: document.getElementById("vertical_inner_border").value,
        verticalRight: document.getElementById("vertical_right_border").value,

        asciiIntersection: document.getElementById("ascii_intersection").value
    };

    var data = extractData(spacePadding, horizontalHeader, verticalHeader);
    var widths = getWidths(data, spacePadding);
    var heights = getHeights(data, border, horizontalHeader, spacePadding);
    var str = "";
    var i, j, m, offsets;

    // top
    str += generateSeparationLine(data, widths, heights, highlight, unicode, line, charset, horizontalHeader, verticalHeader, border, -1);


    // rows
    for (i = 0; i < data.vLen; i++) {
        offsets = [];
        for (j = 0; j < widths.length; j++) {
            offsets[j] = calculateOffset(data, heights, border, horizontalHeader, i, j);
        }

        for (m = 0; m < heights[i]; m++) {
            str += openHighlighted(highlight, 'verticalLeft');
            str += line[charset][border.verticalLeft].vertical;
            str += closeHighlighted(highlight, 'verticalLeft');
            for (j = 0; j < widths.length; j++) {
                str += generateCellContent(data, offsets[j] + m, widths, i, j);
                j += data.arr[i][j].cell.colspan - 1;
                if ('none' != verticalHeader && j == 0 && data.hLen > 1) {
                    str += openHighlighted(highlight, 'verticalInnerHeader');
                    str += line[charset][border.verticalInnerHeader].vertical;
                    str += closeHighlighted(highlight, 'verticalInnerHeader');
                } else if (j < widths.length - 1) {
                    str += openHighlighted(highlight, 'verticalInner');
                    str += line[charset][border.verticalInner].vertical;
                    str += closeHighlighted(highlight, 'verticalInner');
                }
            }
            str += openHighlighted(highlight, 'verticalRight');
            str += line[charset][border.verticalRight].vertical;
            str += closeHighlighted(highlight, 'verticalRight');
            str += '\n';
        }

        str += generateSeparationLine(data, widths, heights, highlight, unicode, line, charset, horizontalHeader, verticalHeader, border, i);
    }
    if (data.vLen == 0) {
        str += generateSeparationLine(data, widths, heights, highlight, unicode, line, charset, horizontalHeader, verticalHeader, border, data.vLen);
    }
    $('#ptt-wrapper').html(str);
    updateSharedLocation();
    saveStateLater();
}

function extractData(spacePadding, horizontalHeader, verticalHeader) {
    var i, j, k, cell, item, lines, w, meta, vAlign, hAlign, vLen, hLen, mergedData;
    var result = [];
    var table = $('#table-wrapper').handsontable('getInstance');
    var arr = table.getData();
    var iOffset = 0;
    var jOffset = 0;
    for (i = 0; i < arr.length; i++) {
        if (i == 0 && ('number' == horizontalHeader || 'letter' == horizontalHeader)) {
            result.push([]);
            if ('number' == verticalHeader || 'letter' == verticalHeader) {
                //add an empty item that will be replaced later:
                result[0][0] = {
                    cell: {
                        x: 0,
                        y: 0,
                        colspan: 1,
                        rowspan: 1
                    },
                    empty: true
                };
                jOffset = 1;
            }
            for (j = 0; j < arr[i].length; j++) {
                //add an empty item that will be replaced later:
                result[0][j + jOffset] = {
                    cell: {
                        x: 0,
                        y: (j + jOffset),
                        colspan: 1,
                        rowspan: 1
                    },
                    empty: true
                };
            }
            iOffset = 1;
        }
        result.push([]);
        if ('number' == verticalHeader || 'letter' == verticalHeader) {
            //add an empty item that will be replaced later:
            result[i + iOffset][0] = {
                cell: {
                    x: (i + iOffset),
                    y: 0,
                    colspan: 1,
                    rowspan: 1
                },
                empty: true
            };
            jOffset = 1;
        }
        for (j = 0; j < arr[i].length; j++) {
            mergedData = table.mergeCells.mergedCellInfoCollection.getInfo(i, j);
            if (mergedData) {
                cell = {
                    x: mergedData.row + iOffset,
                    y: mergedData.col + jOffset,
                    colspan: mergedData.colspan,
                    rowspan: mergedData.rowspan
                };
            } else {
                cell = {
                    x: i + iOffset,
                    y: j + jOffset,
                    colspan: 1,
                    rowspan: 1
                };
            }
            item = arr[i][j];
            if (!item) {
                result[i + iOffset][j + jOffset] = {
                    cell: cell,
                    empty: true
                };
            } else {
                w = 0;
                lines = item.split('\n');
                for (k = 0; k < lines.length; k++) {
                    if (spacePadding) {
                        if (lines[k].indexOf(' ', 0) !== 0) {
                            lines[k] = ' ' + lines[k];
                        }
                        if (lines[k].indexOf(' ', lines[k].length - 1) === -1) {
                            lines[k] = lines[k] + ' ';
                        }
                    }
                    if (lines[k].length > w) {
                        w = lines[k].length;
                    }
                }
                meta = table.getCellMeta(i, j);
                hAlign = 'left';
                vAlign = 'top';
                if (meta.className) {
                    if (meta.className.indexOf('htCenter') > -1) {
                        hAlign = 'center';
                    } else if (meta.className.indexOf('htRight') > -1) {
                        hAlign = 'right';
                    } else if (meta.className.indexOf('htJustify') > -1) {
                        hAlign = 'justify';
                    }
                    if (meta.className.indexOf('htMiddle') > -1) {
                        vAlign = 'middle';
                    } else if (meta.className.indexOf('htBottom') > -1) {
                        vAlign = 'bottom';
                    }
                }
                result[i + iOffset][j + jOffset] = {
                    cell: cell,
                    empty: false,
                    pseudoRows: lines,
                    maxWidth: w,
                    vAlign: vAlign,
                    hAlign: hAlign
                };
            }
        }
    }
    vLen = getVLen(result, (i + iOffset - 1), (j + jOffset - 1));
    hLen = getHLen(result, (i + iOffset - 1), (j + jOffset - 1));
    if ('none' != verticalHeader) {
        jOffset = 1;
    }
    if ('number' == horizontalHeader || 'letter' == horizontalHeader) {
        for (j = 0; j < hLen - jOffset; j++) {
            result[0][j + jOffset] = generateHeader(0, j + jOffset, horizontalHeader, spacePadding, j);
        }
    }
    if ('none' != horizontalHeader) {
        iOffset = 1;
    }
    if ('number' == verticalHeader || 'letter' == verticalHeader) {
        for (i = 0; i < vLen - iOffset; i++) {
            result[i + iOffset][0] = generateHeader(i + iOffset, 0, verticalHeader, spacePadding, i);
        }
    }
    return {
        arr: result,
        vLen: vLen,
        hLen: hLen
    };
}

function getVLen(arr, vMax, hMax) {
    var i, j, item, v;
    var vLen = 0;

    for (i = vMax; i >= 0; i--) {
        for (j = 0; j <= hMax; j++) {
            item = arr[i][j];
            if (!item.empty) {
                v = item.cell.x + item.cell.rowspan;
                if (v > vLen) {
                    vLen = v;
                }
            }
        }
    }
    return vLen;
}

function getHLen(arr, vMax, hMax) {
    var i, j, item, h;
    var hLen = 0;

    for (j = hMax; j >= 0; j--) {
        for (i = 0; i <= vMax; i++) {
            item = arr[i][j];
            if (!item.empty) {
                h = item.cell.y + item.cell.colspan;
                if (h > hLen) {
                    hLen = h;
                }
            }
        }
    }
    return hLen;
}

function generateHeader(i, j, headerType, spacePadding, id) {
    var str = "";
    var num, s;
    if (spacePadding) {
        str += ' ';
    }
    if ('letter' == headerType) {
        s = '';
        num = id;
        do {
            s = String.fromCharCode(65 + (num % 26)) + s;
            num = Math.floor(num / 26) - 1;
        } while (num > -1);
        str += s;
    } else {
        str += (id + 1).toString();
    }
    if (spacePadding) {
        str += ' ';
    }
    return {
        cell: {
            x: i,
            y: j,
            colspan: 1,
            rowspan: 1
        },
        empty: false,
        pseudoRows: [str],
        maxWidth: str.length,
        vAlign: 'middle',
        hAlign: 'center'
    };
}

function getWidths(data, spacePadding) {
    var widths = [];
    var mergedCells = [];
    var i, j, w, item, m, a;

    for (j = 0; j < data.hLen; j++) {
        w = 0;
        if (spacePadding) {
            w = 1;
        }
        for (i = 0; i < data.vLen; i++) {
            item = data.arr[i][j];
            if (!item.empty) {
                if (item.cell.colspan == 1 && item.cell.rowspan == 1) {
                    if (item.maxWidth > w) {
                        w = item.maxWidth;
                    }
                } else if (i == item.cell.x && j == item.cell.y) {
                    mergedCells.push(item);
                }
            }
        }
        widths[j] = w;
    }
    if (mergedCells.length > 0) {
        m = findNotFittingMergedCellWithWidths(mergedCells, widths);
        while (m.hasNext) {
            a = divideAsArray(m.len, m.item.cell.colspan);
            for (j = 0; j < m.item.cell.colspan; j++) {
                widths[m.item.cell.y + j] += a[j];
            }
            m = findNotFittingMergedCellWithWidths(mergedCells, widths);
        }
    }
    return widths;
}

function findNotFittingMergedCellWithWidths(mergedCells, widths) {
    var k, item, width, w;
    var match = {
        hasNext: true,
        len: 0
    };
    for (k = 0; k < mergedCells.length; k++) {
        item = mergedCells[k];
        width = calculateWidth(widths, item);
        w = item.maxWidth - width;
        if (w > match.len) {
            match = {
                hasNext: true,
                len: w,
                item: item
            };
        }
    }
    if (match.len > 0) {
        return match;
    }
    return {
        hasNext: false
    };
}

function getHeights(data, border, horizontalHeader, spacePadding) {
    var heights = [];
    var mergedCells = [];
    var i, j, h, item, m, a;

    for (i = 0; i < data.vLen; i++) {
        h = 0;
        if (spacePadding) {
            h = 1;
        }
        for (j = 0; j < data.hLen; j++) {
            item = data.arr[data.arr[i][j].cell.x][data.arr[i][j].cell.y];
            if (!item.empty) {
                if (item.cell.colspan == 1 && item.cell.rowspan == 1) {
                    if (item.pseudoRows.length > h) {
                        h = item.pseudoRows.length;
                    }
                } else if (i == item.cell.x && j == item.cell.y) {
                    mergedCells.push(item);
                }
            }
        }
        heights[i] = h;
    }
    if (mergedCells.length > 0) {
        m = findNotFittingMergedCellWithHeights(data, border, horizontalHeader, mergedCells, heights);
        while (m.hasNext) {
            a = divideAsArray(m.len, m.item.cell.rowspan);
            for (i = 0; i < m.item.cell.rowspan; i++) {
                heights[m.item.cell.x + i] += a[i];
            }
            m = findNotFittingMergedCellWithHeights(data, border, horizontalHeader, mergedCells, heights);
        }
    }
    return heights;
}

function findNotFittingMergedCellWithHeights(data, border, horizontalHeader, mergedCells, heights) {
    var k, item, height, h;
    var match = {
        hasNext: true,
        len: 0
    };
    for (k = 0; k < mergedCells.length; k++) {
        item = mergedCells[k];
        height = calcultateHeight(data, border, horizontalHeader, heights, item, 0).height;
        h = item.pseudoRows.length - height;
        if (h > match.len) {
            match = {
                hasNext: true,
                len: h,
                item: item
            };
        }
    }
    if (match.len > 0) {
        return match;
    }
    return {
        hasNext: false
    };
}

function generateSeparationLine(data, widths, heights, highlight, unicode, line, charset, horizontalHeader, verticalHeader, border, i) {
    var j, k, horizontalBorderKey, generateBorder, item, offset;
    var str = '';

    if (i == -1) {
        horizontalBorderKey = 'horizontalTop';
        if ('none' == border.horizontalTop) {
            return str;
        }
    } else if (i >= data.vLen - 1) {
        horizontalBorderKey = 'horizontalBottom';
        if ('none' == border.horizontalBottom) {
            return str;
        }
    } else {
        if (hasHorizontalInnerHeader(data, border, i, horizontalHeader)) {
            horizontalBorderKey = 'horizontalInnerHeader';
        } else if (hasHorizontalInner(data, border, i)) {
            horizontalBorderKey = 'horizontalInner';
        } else {
            return str;
        }
    }
    var horizontalBorder = border[horizontalBorderKey];
    var horizontalChar = line[charset][horizontalBorder].horizontal;

    str += openHighlighted(highlight, horizontalBorderKey);
    str += generateIntersection(data, charset, border, highlight, horizontalHeader, verticalHeader, unicode, line, i, -1);
    for (j = 0; j < widths.length; j++) {
        generateBorder = true;
        if (i > -1) {
            item = data.arr[i][j];
            if (item.cell.x + item.cell.rowspan - 1 > i) {
                generateBorder = false;
                offset = calculateOffset(data, heights, border, horizontalHeader, i + 1, j) - 1;
                str += generateCellContent(data, offset, widths, i, j);
                j += item.cell.colspan - 1;
            }
        }
        if (generateBorder) {
            for (k = 0; k < widths[j]; k++) {
                str += horizontalChar;
            }
        }
        str += generateIntersection(data, charset, border, highlight, horizontalHeader, verticalHeader, unicode, line, i, j);
    }
    if (widths.length == 0) {
        str += generateIntersection(data, charset, border, highlight, horizontalHeader, verticalHeader, unicode, line, i, widths.length);
    }
    str += closeHighlighted(highlight, horizontalBorderKey);
    str += '\n';
    return str;
}

function generateIntersection(data, charset, border, highlight, horizontalHeader, verticalHeader, unicode, line, i, j) {
    var top, bottom, left, right, horizontalBorderKey, item, verticalBorderKey, intersectionChar;
    var str = '';
    if (i == -1) {
        top = true;
        bottom = false;
        horizontalBorderKey = 'horizontalTop';
    } else if (i >= data.vLen - 1) {
        top = false;
        bottom = true;
        horizontalBorderKey = 'horizontalBottom';
    } else {
        top = false;
        bottom = false;
        if (hasHorizontalInnerHeader(data, border, i, horizontalHeader)) {
            horizontalBorderKey = 'horizontalInnerHeader';
        } else if (hasHorizontalInner(data, border, i)) {
            horizontalBorderKey = 'horizontalInner';
        } else {
            //unexpected: empty string return statement in generateSeparationLine(..)
            return str;
        }
    }

    if (j == -1) {
        left = true;
        right = false;
        verticalBorderKey = 'verticalLeft';
    } else if (j >= data.hLen - 1) {
        left = false;
        right = true;
        verticalBorderKey = 'verticalRight';
    } else {
        left = false;
        right = false;
        if ('none' != verticalHeader && j == 0) {
            verticalBorderKey = 'verticalInnerHeader';
        } else if (j < data.hLen - 1) {
            verticalBorderKey = 'verticalInner';
        } else {
            return str;
        }
    }

    //handle merged cells (modify the values of top, right, bottom, left):
    if (!top && j >= 0) {
        item = data.arr[i][j];
        if (item.cell.y + item.cell.colspan - 1 > j) {
            top = true;
        }
    }
    if (!bottom && j >= 0) {
        item = data.arr[i + 1][j];
        if (item.cell.y + item.cell.colspan - 1 > j) {
            bottom = true;
        }
    }
    if (!left && i >= 0) {
        item = data.arr[i][j];
        if (item.cell.x + item.cell.rowspan - 1 > i) {
            left = true;
        }
    }
    if (!right && i >= 0) {
        item = data.arr[i][j + 1];
        if (item.cell.x + item.cell.rowspan - 1 > i) {
            right = true;
        }
    }

    var horizontalBorder = border[horizontalBorderKey];
    var verticalBorder = border[verticalBorderKey];
    if ('ascii' == charset) {
        if (top && !right && bottom && !left) {
            intersectionChar = line.ascii[horizontalBorder].horizontal;
        } else if (!top && right && !bottom && left) {
            intersectionChar = line.ascii[verticalBorder].vertical;
        } else if ('horizontal_border' == border.asciiIntersection) {
            intersectionChar = line.ascii[horizontalBorder].horizontal;
        } else if ('vertical_border' == border.asciiIntersection) {
            intersectionChar = line.ascii[verticalBorder].vertical;
        } else {
            intersectionChar = '+';
        }
    } else {
        intersectionChar = unicode[(top) ? 'none' : verticalBorder][(right) ? 'none' : horizontalBorder][(bottom) ? 'none' : verticalBorder][(left) ? 'none' : horizontalBorder];
    }

    str += openHighlighted(highlight, verticalBorderKey);
    str += intersectionChar;
    str += closeHighlighted(highlight, verticalBorderKey);
    return str;
}

function calculateOffset(data, heights, border, horizontalHeader, i, j) {
    var offset, item, calc;
    item = data.arr[data.arr[i][j].cell.x][data.arr[i][j].cell.y];
    calc = calcultateHeight(data, border, horizontalHeader, heights, item, i);
    offset = calc.offset;
    if ('bottom' == item.vAlign) {
        offset += item.pseudoRows.length - calc.height;
    } else if ('middle' == item.vAlign) {
        offset += Math.ceil((item.pseudoRows.length - calc.height) / 2);
    } else {
        offset += 0;
    }
    return offset;
}

function calcultateHeight(data, border, horizontalHeader, heights, item, i) {
    var offset, height, k;
    offset = 0;
    height = heights[item.cell.x];
    for (k = 1; k < item.cell.rowspan; k++) {
        height += (hasHorizontalInnerHeader(data, border, item.cell.x + k - 1, horizontalHeader) || hasHorizontalInner(data, border, item.cell.x + k - 1)) ? 1 : 0;
        if (item.cell.x + k <= i) {
            offset = height;
        }
        height += heights[item.cell.x + k];
    }
    return {
        height: height,
        offset: offset
    };
}

function generateCellContent(data, offset, widths, i, j) {
    var item, width, k, entry, end;
    var str = '';
    item = data.arr[data.arr[i][j].cell.x][data.arr[i][j].cell.y];
    width = calculateWidth(widths, item);
    if (item.empty) {
        entry = '';
    } else {
        entry = item.pseudoRows[offset] || '';
    }
    if ('right' == item.hAlign) {
        end = width - entry.length;
    } else if ('center' == item.hAlign) {
        end = Math.floor((width - entry.length) / 2);
    } else {
        end = 0;
    }
    for (k = 0; k < end; k++) {
        str += ' ';
    }
    str += escapeHTMLEntities(entry);
    end = width - entry.length - end;
    for (k = 0; k < end; k++) {
        str += ' ';
    }
    return str;
}

function calculateWidth(widths, item) {
    var width, k;
    width = widths[item.cell.y];
    for (k = 1; k < item.cell.colspan; k++) {
        width += 1;
        width += widths[item.cell.y + k];
    }
    return width;
}

function hasHorizontalInnerHeader(data, border, i, horizontalHeader) {
    return ('none' != border.horizontalInnerHeader && 'none' != horizontalHeader && i == 0 && data.vLen > 1);
}

function hasHorizontalInner(data, border, i) {
    return ('none' != border.horizontalInner && i < data.vLen - 1);
}

function openHighlighted(highlight, key) {
    if (key == highlight) {
        return '<span class="highlighted">';
    } else {
        return '';
    }
}

function closeHighlighted(highlight, key) {
    if (key == highlight) {
        return '</span>';
    } else {
        return '';
    }
}

function divideAsArray(number, size) {
    var k, r;
    var result = [];
    var nb = number;
    for (k = 0; k < size; k++) {
        r = Math.ceil(nb / (size - k));
        result[k] = r;
        nb = nb - r;
    }
    return result;
}

function escapeHTMLEntities(text) {
    return text.replace(/[<>\&]/g, function(c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}

(function() {
    "use strict";

    //A grid drawn while its tab is hidden gets no room to measure itself: it stays
    //squeezed to its smallest size and its wrapper keeps no height, which lets the rest
    //of the page overlap it. Drawing it again once the tab is visible fixes both.
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(event) {
        if ('#grid-tab' === $(event.target).attr('href')) {
            $('#table-wrapper').handsontable('getInstance').render();
        }
    });

    //the example links of the page are shared links, following them only changes the
    //hash, the browser does not reload the page:
    $(window).on('hashchange', function() {
        loadSharedState();
    });

    //a link pointing to the table that is already displayed changes nothing in the
    //location, so the hashchange event does not fire and the state is applied here:
    $(document).on('click', 'a[href^="#' + sharePrefix + '"]', function() {
        if (window.location.hash === this.hash) {
            loadSharedState();
        }
    });

    //this block is at the end of the file, so that the variables it needs are assigned.
    //A shared link wins over the stored table, it is what the visitor asked to see:
    if (!loadSharedState()) {
        loadStoredState();
    }
})();
