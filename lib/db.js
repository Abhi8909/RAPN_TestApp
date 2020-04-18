/**
 * This will have to logic for CRUD operation
 * currently will using file system
 */

const fs = require("fs");
const path = require("path");

let db = {};

db.baseDir = path.join(__dirname, "/../.data/");

// write data to file
db.create = function (dir, file, data, callback) {
  // opening the file to write
  let stringfyData = JSON.stringify(data);
  fs.open(db.baseDir + dir + "/" + file + ".json", "wx", function (
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      fs.writeFile(fileDescriptor, stringfyData, function (err) {
        if (!err) {
          fs.close(fileDescriptor, function (err) {
            if (!err) {
              callback(false);
            } else {
              callback("Error in closing the file");
            }
          });
        } else {
          callback("Error in writing file");
        }
      });
    } else {
      callback("Error creating the file. file may alerady exists");
    }
  });
};

// read data to file
db.read = function (dir, file, callback) {
  fs.readFile(db.baseDir + dir + "/" + file + ".json", "utf8", function (
    err,
    data
  ) {
    if (!err && data) {
      callback(false, JSON.parse(data));
    } else {
      callback("error in reading the file");
    }
  });
};

// update data to file
db.update = function (dir, file, data, callback) {
  let stringfyData = JSON.stringify(data);

  fs.open(db.baseDir + dir + "/" + file + ".json", "r+", function (
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      // truncate the file
      fs.truncate(fileDescriptor, function (err) {
        if (!err) {
          fs.writeFile(fileDescriptor, stringfyData, function (err) {
            if (!err) {
              fs.close(fileDescriptor, function (err) {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error in closing the file");
                }
              });
            } else {
              callback("Error updating the data in file");
            }
          });
        } else {
          callback("Error trucating the file");
        }
      });
    } else {
      callback("Error file may not exist yet");
    }
  });
};

// delete file to file
db.delete = function (dir, file, callback) {
  fs.unlink(db.baseDir + dir + "/" + file + ".json", function (err) {
    if (!err) {
      callback(false);
    } else {
      callback("Error in deleting the file");
    }
  });
};

// export the module
module.exports = db;
