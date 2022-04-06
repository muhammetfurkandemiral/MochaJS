let db = new DB();

function DB() {

  this.tables = [];

}



DB.prototype.createTable = function (name, columns) {

  this.tables[name] = new TABLE(columns);

}



DB.prototype.getTable = function (name) {

  return this.tables[name];

}



function TABLE(columns) {

  this.columns = columns;

  this.rows = [];

}



TABLE.prototype.insertRecords = function (values) {

  // Returns false on error, true on success

  for (let k in values) {

    if (this.columns[k] === 'string' && values[k].length > 255) {

      console.log(k + ' must be 255 characters or less');

      return false;

    } else if ((this.columns[k] === 'int') && (values[k] < -999 || values[k] > 999)) {

      console.log(k + ' out of range');

      return false;

    }

  }

  this.rows.push(values);

  return true;

}



TABLE.prototype.getAllRecords = function () {

  return this.rows;

}



TABLE.prototype.filterRecords = function (filter) {

  let matches = [];

  // For each row, check if all filter conditions are met

  for (let i = 0, len = this.rows.length; i < len; i++) {

    let numFilters = 0;

    let numMatched = 0;

    for (let k in filter) {

      if (this.rows[i][k] === filter[k]) {

        numMatched++;

      }

      numFilters++;

    }

    if (numFilters === numMatched) {

      matches.push(this.rows[i]);

    }

  }

  return matches;

}

module.exports = db;