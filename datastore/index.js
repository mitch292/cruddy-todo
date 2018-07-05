const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////



exports.create = (text, callback) => {
  counter.getNextUniqueId((argOne, ourId) => {
    fs.writeFile(`${exports.dataDir}/${counter.zeroPadding(ourId)}.txt`, text, (err) => {
      if (err) {
        throw ('error writing the file');
      } else {
        callback(null, {id: ourId, text: text});
      }
    })   
  });
};

exports.readOne = (id, callback) => {

  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`))
    } else {
      callback(null,{id: id, text: data.toString()});
    }
  })

};


exports.readAll = (callback) => {
  var data = [];

  //go over each file in a directory
  //push each file into the data array as an object with two props
  //id and text 
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('there has been an error reading all the files');
    } else {
      _.each(files, (file) => {
        file = file.substr(0, 5)
        data.push({id: file, text: file});
      })
      return callback(null, data);
  }

  })

};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, {id: id, text: text});
        }
      })
    }
  })
};

exports.delete = (id, callback) => {

  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`))
    } else {
      callback();
    }
  })
  // var item = items[id];
  // delete items[id];
  // if(!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`))
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
