const { expect } = require('chai')
var assert = require('assert');
var app = require('../src/app'), result, table;

let incorrect_saved_data = []
let table_name = "phones"
let character_256 = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,."
var valid_data =
  [
    { brand: 'Apple', model: '13 Pro', quantity: 50 }
  ]
var invalid_data =
  [
    { brand: 'Meizu', model: '16th', quantity: '280' },
    { brand: 1234, model: 5678, quantity: 8910 },
    { brand: '', model: '', quantity: null },
    { brand: true, model: false, quantity: true },
    { brand: 'Samsung', model: 'Galaxy Z Flip', quantity: 800.15 },
    { brand: 'Motorola', model: 'V195', quantity: 020 }
  ]
var boundary_levels_data =
  [
    { brand: 'Xiaomi', model: 'Mi Mix Fold', quantity: -1000 },
    { brand: 'Meizu', model: '17 Pro', quantity: 1000 },
    { brand: character_256, model: character_256, quantity: 500 }
  ]


describe('Create and access table', function () {

  it('Table should be created', function () {
    result = app.createTable(table_name, { brand: 'string', model: 'string', quantity: 'int' });
    assert.ifError(null, "Table can not be created")
  });

  it('Table should be accessible if exist', function () {
    table = app.getTable(table_name)

    expect(table.columns.brand).to.be.equal('string', "Wrong data type on column")
    expect(table.columns.model).to.be.equal('string', "Wrong data type on column")
    expect(table.columns.quantity).to.be.equal('int', "Wrong data type on column")

  });

  it('Table should not be accessible if not exist', function () {
    assert.equal(app.getTable('cars'), undefined, "Should not be a table with this name")
  });

});

describe('Insert records to the table', function () {

  it('Table should be created valid data', function () {
    result = table.insertRecords(valid_data[0]);
    assert.equal(result, true, "Table cannot be created")
  });

  it('Table should not be inserted with invalid data type (string instead int)', function () {
    result = table.insertRecords(invalid_data[0]);
    assert.equal(result, false, "String data was entered instead of the integer value.")
  });

  it('Table should not be inserted with invalid data type (int instead string)', function () {
    result = table.insertRecords(invalid_data[1]);
    assert.equal(result, false, "Integer data was entered instead of the string value.")
  });

  it('Table should not be inserted with empty data', function () {
    result = table.insertRecords(invalid_data[2]);
    assert.equal(result, false, "Empty data was entered")
  });

  it('Table should not be inserted with invalid data type (boolean)', function () {
    result = table.insertRecords(invalid_data[3]);
    assert.equal(result, false, "Boolean data entered")
  });

  it('Table should not be inserted with invalid data type (float)', function () {
    result = table.insertRecords(invalid_data[4]);
    assert.equal(result, false, "Float data entered")
  });

  it('Table should not be inserted with non-object type', function () {
    result = table.insertRecords('Nokia', '3310', 331);
    assert.equal(result, false, "Data type should be object")
  });

  it('When the quantity is entered starting with (0)', function () {
    result = table.insertRecords(invalid_data[5]);
    getTable = table.getAllRecords();
    assert.equal(result, true, "Table cannot be created")
    assert.notEqual(getTable[5].quantity, invalid_data[5].quantity, "The quantity values matched")
    /*console.log(getTable[5].quantity)
    console.log(invalid_data[5].quantity)*/
  });

});

describe('Boundary levels checks on data', function () {

  it('Negative boundary for integer', function () {
    result = table.insertRecords(boundary_levels_data[0]);

    assert.equal(result, false, "Integer data can not be lower than -999.")
  });

  it('Positive boundary for integer', function () {
    result = table.insertRecords(boundary_levels_data[1]);
    assert.equal(result, false, "Integer data can not be higher than 999.")
  });

  it('string 256 character', function () {
    result = table.insertRecords(boundary_levels_data[2]);
    assert.equal(result, false, "String data can not be longer than 255 character.")
  });

});

describe('Filter records by columns', function () {
  it('Filter with valid (brand) at column', function () {
    result = table.filterRecords({ brand: 'Apple' });

    result.forEach(function (item) {
      item.brand === 'Apple' ?
        assert.ok(true) :
        assert.ok(false, "Filter can not work correctly with (brand)")
    })

  });
  it('Filter with invalid (brand) at column', function () {
    result = table.filterRecords({ brand: 'Ferrari' });

    result.forEach(function (item) {
      item.brand === 'Ferrari' ?
        assert.ok(false) :
        assert.ok(true, "Filter can not work correctly with (brand)")
    })

  });

  it('Filter with valid (model) at column', function () {
    result = table.filterRecords({ model: '13 Pro' });

    result.forEach(function (item) {
      item.model === '13 Pro' ?
        assert.ok(true) :
        assert.ok(false, "Filter can not work correctly with (model)")
    })

  });
  it('Filter with invalid (model) at column', function () {
    result = table.filterRecords({ model: 'SF90 Stradale' });

    result.forEach(function (item) {
      item.model === 'SF90 Stradale' ?
        assert.ok(false) :
        assert.ok(true, "Filter can not work correctly with (model)")
    })

  });

  it('Filter with valid (quantity) at column', function () {
    result = table.filterRecords({ quantity: 20 });

    result.forEach(function (item) {
      item.quantity === 20 ?
        assert.ok(true) :
        assert.ok(false, "Filter can not work correctly with (quantity)")
    });

  });
  it('Filter with invalid (quantity) at column', function () {
    result = table.filterRecords({ quantity: 380 });

    result.forEach(function (item) {
      item.quantity === 380 ?
        assert.ok(false) :
        assert.ok(true, "Filter can not work correctly with (quantity)")
    });

  });

});

describe('Get all records on table', function () {
  it('Get all', function () {
    result = table.getAllRecords();
    assert.equal(result[0], valid_data[0], "Valid data can not be added.")

    for (let i = 0; i <= invalid_data.length; i++) {
      result[i + 1] !== invalid_data[i] ?
        incorrect_saved_data.push(`Invalid data has been added.\n ${result[i + 1].brand}`) :
        assert.ok(true)
    }
    console.error(incorrect_saved_data)
    assert.equal(result.length == valid_data.length, "Invalid data has been added.")
  });
});
