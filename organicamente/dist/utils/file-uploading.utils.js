"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultImagen = exports.editFileNameEditar = exports.editFileName = exports.imageFileFilter = void 0;
const uuid_1 = require("uuid");
exports.imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return callback(null, false);
    }
    callback(null, true);
};
exports.editFileName = (req, file, callback) => {
    const filename = uuid_1.v4() + '.' + file.originalname.split('.')[1];
    callback(null, `${filename}`);
};
exports.editFileNameEditar = (req, file, callback) => {
    let filename;
    console.log("FILENAME: " + file.filename);
    console.log("ORIGINALNAME: " + file.originalname);
    console.log("PATH: " + file.path);
    if (file.filename == 'default_image.jpg') {
        filename = uuid_1.v4() + '.' + file.originalname.split('.')[1];
    }
    else {
        filename = file.filename;
    }
    callback(null, `${filename}`);
};
exports.defaultImagen = 'default_image.jpg';
//# sourceMappingURL=file-uploading.utils.js.map