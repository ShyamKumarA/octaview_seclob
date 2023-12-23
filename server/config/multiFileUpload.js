import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'; // Import 'join' from the 'path' module

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = join(__dirname, "../public/verify_images"); // Use 'join' here
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "aadhaar", maxCount: 1 },
  { name: "pancard", maxCount: 1 },
]);

export default upload;
