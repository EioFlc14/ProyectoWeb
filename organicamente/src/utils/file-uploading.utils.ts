import { v4 as uuid } from 'uuid';

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return callback(null, false)
    }
    callback(null, true);
};


export const editFileName = (req, file, callback) => {
    //const filename = uuid() + '.' + file.originalname.split('.')[1];
    const filename = uuid() + '.' + file.originalname.split('.')[1];
    callback(null, `${filename}`);
};


export const editFileNameEditar = (req, file, callback) => {
    let filename
    console.log("FILENAME: "+ file.filename)
    console.log("ORIGINALNAME: "+ file.originalname)
    console.log("PATH: " + file.path)
    if(file.filename == 'default_image.jpg'){
        filename = uuid() + '.' + file.originalname.split('.')[1];
    } else {
        filename = file.filename;
    }

    callback(null, `${filename}`);
};


export const defaultImagen = 'default_image.jpg';