const multer     = require('multer');
const fs         = require("fs");

const csvFilter = (req, file, cb) => {
    if (file.mimetype.includes("csv")) {
      cb(null, true);
    } else {
      cb("Please upload only csv file.", false);
    }
  };

var storage    = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.originalname!='')
        {
        cb(null, './public/upload')
    }
    },
    filename: function (req, files, cb) {
        cb(null, 'csv'  +files.originalname.replace(/\s+/g, ''));
    }
});

var uploadFile = multer({ storage: storage, fileFilter: csvFilter });
module.exports = uploadFile;