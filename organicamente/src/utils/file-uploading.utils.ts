import { v4 as uuid } from 'uuid';

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return callback(null, false)
    }
    callback(null, true);
};


export const editFileName = (req, file, callback) => {
    const filename = uuid() + '.' + file.originalname.split('.')[1];
    callback(null, `${filename}`);
};