const multer = require("multer");

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("application/octet-stream") || file.mimetype.startsWith("text/csv") || file.mimetype.startsWith('application/vnd.ms-excel')) {
        cb(null, true);
    } else {
        cb("Please upload only CSV.", false);
    }
};

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/document')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-doodleblue-${file.originalname}`);
    },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });

module.exports = uploadFile