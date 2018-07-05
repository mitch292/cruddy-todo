const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter.js');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////



exports.create = (text, callback) => {
  counter.getNextUniqueId((err, ourId) => {
    if (err) {
      console.log('there has been an error getting our ID');
    } else {
      let file = path.join(exports.dataDir, `${counter.zeroPadding(ourId)}.txt`)
      fs.writeFile(file, text, (err) => {
        if (err) {
           callback(err);
        } else {
          callback(null, {id: ourId, text: text});
        }
      }) 
    }
  });
};

exports.readOne = (id, callback) => {

  let file = path.join(exports.dataDir, `${id}.txt`)
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(null, {id: id, text: data});
    }
  })

};


exports.readAll = (callback) => {
  var data = [];
  let filesRead = 0;

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('there has been an error reading all the files');
    } else {
      if (files.length === 0) {
        return callback(null, data);
      }
      _.each(files, (file) => {
        let filePath = path.join(exports.dataDir, file);
        fs.readFile(filePath, 'utf-8', (err, contents) => {
          if (err) {
            cb(err)
          } else {
            data.push({id: file.substr(0,5), text: contents});
            filesRead++
            if(filesRead === files.length) {
              callback(null, data)
            }
          }
        })
      })
  }

  })


  ////solution code below


};

exports.update = (id, text, callback) => {
  let file = path.join(exports.dataDir, `${id}.txt`)
  fs.readFile(file, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(file, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, {id: id, text: text});
        }
      })
    }
  })
};

exports.delete = (id, callback) => {
  let file = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(file, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(err, data);
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
