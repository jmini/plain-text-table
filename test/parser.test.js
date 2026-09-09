//Unit tests of the plain text table parser.
//Run them with: node --test test/
//This folder is not published on GitHub Pages, see _config.yml
var test = require('node:test');
var assert = require('node:assert');
var parser = require('../js/parser.js');

//the fixtures are written as arrays of lines, so that the trailing spaces some
//border configurations produce cannot be lost when the file is edited:
function table(lines) {
    return lines.join('\n');
}

test('ascii table with a first line header', function() {
    var result = parser.parse(table([
        '+===========+============+==========+=========+',
        '| Name      | First Name | Track Id | Checked |',
        '+===========+============+==========+=========+',
        '| Sheffield | Alice      | 347      | yes     |',
        '+-----------+------------+----------+---------+',
        '| Smith     | Bob        | 152      |         |',
        '+-----------+------------+----------+---------+',
        '| Samson    | Dick       | 948      | yes     |',
        '+===========+============+==========+=========+'
    ]));
    assert.deepStrictEqual(result.data, [
        ['Name', 'First Name', 'Track Id', 'Checked'],
        ['Sheffield', 'Alice', '347', 'yes'],
        ['Smith', 'Bob', '152', ''],
        ['Samson', 'Dick', '948', 'yes']
    ]);
    assert.deepStrictEqual(result.mergeCells, []);
    assert.strictEqual(result.horizontalHeader, null);
    assert.strictEqual(result.verticalHeader, null);
    assert.strictEqual(result.error, null);
});

test('unicode table with merged and multiline cells', function() {
    var result = parser.parse(table([
        '╔════════╦══════╤═══════════╤═════════════╤═══════════╤═══════════╤═════════════╗',
        '║ Who?   ║ Code │ Monday    │ Tuesday     │ Wednesday │ Thursday  │ Friday      ║',
        '╠════════╬══════╪═══════════╧═════════════╧═══════════╪═══════════╪═════════════╣',
        '║ Team A ║ 23   │ Proin id nunc                       │ Fringilla │ Lorem       ║',
        '║        ║      │                                     │           │ Ipsum       ║',
        '╟────────╫──────┼───────────┬─────────────┬───────────┴───────────┼─────────────╢',
        '║ Team B ║ 4    │ Fermentum │ Ante Ipisum │ Amet                  │ Lyks        ║',
        '╟────────╫──────┼───────────┼─────────────┼───────────┬───────────┼─────────────╢',
        '║ Team C ║ 52   │ Metus ex  │ Dxow        │ Malesuada │ Vulputate │ Ullamcorper ║',
        '╟────────╫──────┼───────────┴─────────────┼───────────┤           ├─────────────╢',
        '║ Team D ║ 19   │ Ornare                  │ Tincidunt │           │ Rwe         ║',
        '╚════════╩══════╧═════════════════════════╧═══════════╧═══════════╧═════════════╝'
    ]));
    assert.deepStrictEqual(result.data, [
        ['Who?', 'Code', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        ['Team A', '23', 'Proin id nunc', '', '', 'Fringilla', 'Lorem\nIpsum'],
        ['Team B', '4', 'Fermentum', 'Ante Ipisum', 'Amet', '', 'Lyks'],
        ['Team C', '52', 'Metus ex', 'Dxow', 'Malesuada', 'Vulputate', 'Ullamcorper'],
        ['Team D', '19', 'Ornare', '', 'Tincidunt', '', 'Rwe']
    ]);
    assert.deepStrictEqual(result.mergeCells, [{
        row: 1,
        col: 2,
        rowspan: 1,
        colspan: 3
    }, {
        row: 2,
        col: 4,
        rowspan: 1,
        colspan: 2
    }, {
        row: 3,
        col: 5,
        rowspan: 2,
        colspan: 1
    }, {
        row: 4,
        col: 2,
        rowspan: 1,
        colspan: 2
    }]);
    assert.strictEqual(result.error, null);
});

test('generated letter and number headers are removed from the content', function() {
    var result = parser.parse(table([
        '    ║   A    │     B     │     C      │  D   ',
        ' ═══╬════════╪═══════════╪════════════╪═════ ',
        '  1 ║ Alice  │ Johnson   │ 2018-04-12 │ 293  ',
        '  2 ║ Bob    │ Smith     │ 2019-11-03 │ 2    ',
        '  3 ║ Carrie │ Sheffield │ 2021-06-27 │ 42   '
    ]));
    assert.deepStrictEqual(result.data, [
        ['Alice', 'Johnson', '2018-04-12', '293'],
        ['Bob', 'Smith', '2019-11-03', '2'],
        ['Carrie', 'Sheffield', '2021-06-27', '42']
    ]);
    assert.strictEqual(result.horizontalHeader, 'letter');
    assert.strictEqual(result.verticalHeader, 'number');
});

test('a first line that is not a generated header is kept as content', function() {
    var result = parser.parse(table([
        '┌────┬────────┐',
        '│ Id │ Name   │',
        '├────┼────────┤',
        '│ 1  │ Alice  │',
        '│ 2  │ Bob    │',
        '└────┴────────┘'
    ]));
    assert.deepStrictEqual(result.data, [
        ['Id', 'Name'],
        ['1', 'Alice'],
        ['2', 'Bob']
    ]);
    assert.strictEqual(result.horizontalHeader, null);
    assert.strictEqual(result.verticalHeader, null);
});

test('ascii intersection drawn as a horizontal border', function() {
    var result = parser.parse(table([
        '===============',
        '| Id | Name   |',
        '===============',
        '| 1  | Alice  |',
        '---------------',
        '| 2  | Bob    |',
        '==============='
    ]));
    assert.deepStrictEqual(result.data, [
        ['Id', 'Name'],
        ['1', 'Alice'],
        ['2', 'Bob']
    ]);
});

test('ascii intersection drawn as a vertical border', function() {
    var result = parser.parse(table([
        '|====|========|',
        '| Id | Name   |',
        '|====|========|',
        '| 1  | Alice  |',
        '|----|--------|',
        '| 2  | Bob    |',
        '|====|========|'
    ]));
    assert.deepStrictEqual(result.data, [
        ['Id', 'Name'],
        ['1', 'Alice'],
        ['2', 'Bob']
    ]);
});

test('table without cell padding', function() {
    var result = parser.parse(table([
        '┌──┬──────┐',
        '│Id│Name  │',
        '├──┼──────┤',
        '│1 │Alice │',
        '│2 │Bob   │',
        '└──┴──────┘'
    ]));
    assert.deepStrictEqual(result.data, [
        ['Id', 'Name'],
        ['1', 'Alice'],
        ['2', 'Bob']
    ]);
});

test('a cell spanning several rows keeps its text', function() {
    var result = parser.parse(table([
        '┌────┬───────┐',
        '│ 1  │ Alice │',
        '├────┤       │',
        '│ 2  │       │',
        '├────┼───────┤',
        '│ 3  │ Bob   │',
        '└────┴───────┘'
    ]));
    assert.deepStrictEqual(result.data, [
        ['1', 'Alice'],
        ['2', ''],
        ['3', 'Bob']
    ]);
    assert.deepStrictEqual(result.mergeCells, [{
        row: 0,
        col: 1,
        rowspan: 2,
        colspan: 1
    }]);
});

test('a cell spanning several rows keeps a text written on the lower line', function() {
    var result = parser.parse(table([
        '┌────┬───────┐',
        '│ 1  │       │',
        '├────┤       │',
        '│ 2  │ Alice │',
        '└────┴───────┘'
    ]));
    assert.strictEqual(result.data[0][1], 'Alice');
    assert.deepStrictEqual(result.mergeCells, [{
        row: 0,
        col: 1,
        rowspan: 2,
        colspan: 1
    }]);
});

test('leading and trailing empty lines are ignored', function() {
    var result = parser.parse('\n\n' + table([
        '┌────┐',
        '│ 1  │',
        '└────┘'
    ]) + '\n\n');
    assert.deepStrictEqual(result.data, [
        ['1']
    ]);
});

test('text that is not a table is reported', function() {
    var result = parser.parse('Hello, this is not a table at all.');
    assert.ok(result.error);
    assert.deepStrictEqual(result.data, []);
});

test('empty input is reported', function() {
    var result = parser.parse('');
    assert.ok(result.error);
});

test('the style of an ascii table is read back', function() {
    var result = parser.parse(table([
        '+===========+============+',
        '| Name      | First Name |',
        '+===========+============+',
        '| Sheffield | Alice      |',
        '+-----------+------------+',
        '| Smith     | Bob        |',
        '+===========+============+'
    ]));
    assert.deepStrictEqual(result.configuration, {
        charset: 'ascii',
        horizontal_header: 'first_line',
        vertical_header: 'none',
        horizontal_top_border: 'double',
        horizontal_inner_header_border: 'double',
        horizontal_inner_border: 'single',
        horizontal_bottom_border: 'double',
        vertical_left_border: 'single',
        vertical_inner_header_border: 'single',
        vertical_inner_border: 'single',
        vertical_right_border: 'single',
        ascii_intersection: 'plus',
        spacePadding: true
    });
});

test('the style of a markdown table is read back', function() {
    var result = parser.parse(table([
        '| Name      | First Name |',
        '|-----------|------------|',
        '| Sheffield | Alice      |',
        '| Smith     | Bob        |'
    ]));
    var c = result.configuration;
    assert.strictEqual(c.charset, 'ascii');
    assert.strictEqual(c.horizontal_header, 'first_line');
    assert.strictEqual(c.horizontal_top_border, 'none');
    assert.strictEqual(c.horizontal_bottom_border, 'none');
    assert.strictEqual(c.horizontal_inner_border, 'none');
    assert.strictEqual(c.horizontal_inner_header_border, 'single');
    assert.strictEqual(c.ascii_intersection, 'vertical_border');
    assert.strictEqual(c.spacePadding, true);
});

test('the style of a unicode table without outer border is read back', function() {
    var result = parser.parse(table([
        '    ║   A    │     B     │     C      │  D   ',
        ' ═══╬════════╪═══════════╪════════════╪═════ ',
        '  1 ║ Alice  │ Johnson   │ 2018-04-12 │ 293  ',
        '  2 ║ Bob    │ Smith     │ 2019-11-03 │ 2    ',
        '  3 ║ Carrie │ Sheffield │ 2021-06-27 │ 42   '
    ]));
    var c = result.configuration;
    assert.strictEqual(c.charset, 'unicode');
    assert.strictEqual(c.horizontal_header, 'letter');
    assert.strictEqual(c.vertical_header, 'number');
    assert.strictEqual(c.vertical_left_border, 'none');
    assert.strictEqual(c.vertical_right_border, 'none');
    assert.strictEqual(c.vertical_inner_header_border, 'double');
    assert.strictEqual(c.vertical_inner_border, 'single');
    assert.strictEqual(c.horizontal_top_border, 'none');
    assert.strictEqual(c.horizontal_bottom_border, 'none');
    assert.strictEqual(c.horizontal_inner_header_border, 'double');
    assert.strictEqual(c.horizontal_inner_border, 'none');
});

test('a table without cell padding is recognized as such', function() {
    var padded = parser.parse(table([
        '┌────┬────────┐',
        '│ Id │ Name   │',
        '└────┴────────┘'
    ]));
    var tight = parser.parse(table([
        '┌──┬────┐',
        '│Id│Name│',
        '└──┴────┘'
    ]));
    assert.strictEqual(padded.configuration.spacePadding, true);
    assert.strictEqual(tight.configuration.spacePadding, false);
});

test('a border that no row draws is a border set to none, not a merged cell', function() {
    //with no vertical border between the columns, every row would otherwise look merged:
    var result = parser.parse(table([
        '+----+-------+',
        '| Id   Name  |',
        '+----+-------+',
        '| 1    Alice |',
        '| 2    Bob   |',
        '+----+-------+'
    ]));
    assert.deepStrictEqual(result.mergeCells, []);
    assert.strictEqual(result.configuration.vertical_inner_border, 'none');
    assert.deepStrictEqual(result.data, [
        ['Id', 'Name'],
        ['1', 'Alice'],
        ['2', 'Bob']
    ]);
});

//--- tables that were not produced by this tool, parsed as well as possible ------------

var INVOICE = [
    ['ID', 'Item Description', 'Qty', 'Price'],
    ['01', 'Mechanical Switch', '100', '$0.45'],
    ['02', 'Keycap Set (PBT)', '2', '$45.00'],
    ['03', 'USB-C Cable 2m', '5', '$12.50']
];

test('foreign table: a cell written against its border', function() {
    var result = parser.parse(table([
        '+----+-------------------+--------+-------+',
        '| ID | Item Description  | Qty    | Price |',
        '+----+-------------------+--------+-------+',
        '| 01 | Mechanical Switch | 100    | $0.45 |',
        '| 02 | Keycap Set (PBT)  | 2      | $45.00|',
        '| 03 | USB-C Cable 2m    | 5      | $12.50|',
        '+----+-------------------+--------+-------+',
        '|    | TOTAL             | 107    | $57.95|',
        '+----+-------------------+--------+-------+'
    ]));
    assert.deepStrictEqual(result.data, INVOICE.concat([
        ['', 'TOTAL', '107', '$57.95']
    ]));
    assert.deepStrictEqual(result.mergeCells, []);
});

test('foreign table: a total line merged over two columns', function() {
    var result = parser.parse(table([
        '┌────┬───────────────────┬────────┬────────┐',
        '│ ID │ Item Description  │ Qty    │ Price  │',
        '├────┼───────────────────┼────────┼────────┤',
        '│ 01 │ Mechanical Switch │ 100    │  $0.45 │',
        '│ 02 │ Keycap Set (PBT)  │ 2      │ $45.00 │',
        '│ 03 │ USB-C Cable 2m    │ 5      │ $12.50 │',
        '├────┴───────────────────┼────────┼────────┤',
        '│ TOTAL                  │ 107    │ $57.95 │',
        '└────────────────────────┴────────┴────────┘'
    ]));
    assert.deepStrictEqual(result.data, INVOICE.concat([
        ['TOTAL', '', '107', '$57.95']
    ]));
    assert.deepStrictEqual(result.mergeCells, [{
        row: 4,
        col: 0,
        rowspan: 1,
        colspan: 2
    }]);
});

test('foreign table: corners drawn with slashes', function() {
    var result = parser.parse(table([
        '/----\\-------------------/--------\\--------\\',
        '| ID | Item Description  | Qty    | Price  |',
        '+----+-------------------+--------+--------+',
        '| 01 | Mechanical Switch | 100    |  $0.45 |',
        '| 02 | Keycap Set (PBT)  | 2      | $45.00 |',
        '| 03 | USB-C Cable 2m    | 5      | $12.50 |',
        '\\----+-------------------+--------+--------/'
    ]));
    assert.deepStrictEqual(result.data, INVOICE);
    assert.deepStrictEqual(result.mergeCells, []);
    //the slashes are Ascii, they must not make the table look like a Unicode one:
    assert.strictEqual(result.configuration.charset, 'ascii');
});

test('foreign table: lines that do not line up are aligned before parsing', function() {
    var result = parser.parse(table([
        ' ID | Item Description  | Qty |  Price',
        '  ----+-------------------+-----+---------',
        '   01 | Mechanical Switch | 100 |   $0.45',
        '   02 | Keycap Set (PBT)  |   2 |  $45.00',
        '   03 | USB-C Cable 2m    |   5 |  $12.50'
    ]));
    assert.deepStrictEqual(result.data, INVOICE);
    assert.deepStrictEqual(result.mergeCells, []);
    assert.strictEqual(result.configuration.horizontal_header, 'first_line');
});

test('foreign table: no outer border and a header that does not line up', function() {
    var result = parser.parse(table([
        'ID | Item Description  | Qty |  Price',
        '----+-------------------+-----+---------',
        ' 01 | Mechanical Switch | 100 |   $0.45',
        ' 02 | Keycap Set (PBT)  |   2 |  $45.00',
        ' 03 | USB-C Cable 2m    |   5 |  $12.50',
        '----+-------------------+-----+---------',
        '    | TOTAL             | 107 |  $57.95'
    ]));
    assert.deepStrictEqual(result.data, INVOICE.concat([
        ['', 'TOTAL', '107', '$57.95']
    ]));
    assert.deepStrictEqual(result.mergeCells, []);
});
