var AWS = require("aws-sdk");

var multer = require("multer");
var multerS3 = require("multer-s3");
var path = require("path");
var s3 = new AWS.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`);
    },
    acl: "public-read",
  }),
});

module.exports = { upload };
