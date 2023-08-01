import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${process.cwd()}/uploads`);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
      //console.log(file.originalname)
    },
  });
  
  // Create a multer instance with the storage options
const upload = multer({ storage });
export { upload };

