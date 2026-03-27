const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// que baoUploadmu lu cun zai
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// pei zhimultercun chu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/products');
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: async (req, file, cb) => {
    try {
      const { v4: uuidv4 } = await import('uuid');
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    } catch (error) {
      cb(error);
    }
  }
});

// wen jian guo lv qi
const fileFilter = (req, file, cb) => {
  // zhi yun xu tu pian wen jian
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('zhi yun xuUploadtu pian wen jian'), false);
  }
};

// Createmultershi li
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 // zui duo10ge wen jian
  }
});

/**
 * chu li dan ge tu pianUpload
 * @param {Request} req Expressqing qiu dui xiang
 * @param {Response} res Expressxiang ying dui xiang
 * @param {Function} next xia yi ge zhong jian jian
 */
const uploadSingle = upload.single('image');

/**
 * chu li duo ge tu pianUpload
 * @param {number} maxCount zui daUploadwen jian shu liang
 * @returns {Function} zhong jian jian han shu
 */
const uploadMultiple = (maxCount = 5) => upload.array('images', maxCount);

/**
 * tu pian ya suo chu li
 * @param {string} inputPath shu ru wen jian lu jing
 * @param {string} outputPath shu chu wen jian lu jing
 * @param {Object} options ya suo xuan xiang
 * @returns {Promise<void>}
 */
const compressImage = async (inputPath, outputPath, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'jpeg'
  } = options;

  try {
    await sharp(inputPath)
      .resize(width, height, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality })
      .toFile(outputPath);
  } catch (error) {
    console.error('tu pian ya suoFailed:', error);
    // ru guo ya suoFailed，fu zhi yuan wen jian
    fs.copyFileSync(inputPath, outputPath);
  }
};

/**
 * chu liUploadde tu pian bing ya suo
 * @param {Array} files Uploadde wen jian shu zu
 * @returns {Promise<Array>} chu li hou de wen jianInfoshu zu
 */
const processUploadImages = async (files) => {
  const results = [];
  
  for (const file of files) {
    try {
      // Createya suo hou de wen jian lu jing
      const compressedPath = path.join(
        path.dirname(file.path),
        `compressed_${path.basename(file.path, path.extname(file.path))}.jpg`
      );
      
      // ya suo tu pian
      await compressImage(file.path, compressedPath);
      
      // Deleteyuan wen jian
      fs.unlinkSync(file.path);
      
      // fan hui xiang dui lu jing，Frontendke yi tong guoAPIji chuURLfang wen
      // zhi xu yaoproducts/wen jian ming bu fen，bu xu yaouploadsqian zhui
      const relativePath = path.relative(
        path.join(__dirname, '../../uploads'),
        compressedPath
      );
      
      results.push({
        originalName: file.originalname,
        filename: path.basename(compressedPath),
        path: compressedPath,
        url: `/uploads/${relativePath}`,
        size: fs.statSync(compressedPath).size
      });
    } catch (error) {
      console.error(`chu li tu pianFailed: ${file.originalname}`, error);
      // ru guo chu liFailed，bao liu yuan wen jian lu jing
      const relativePath = path.relative(
        path.join(__dirname, '../../'),
        file.path
      );
      
      results.push({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        url: `/uploads/${relativePath}`,
        size: file.size,
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * DeleteUploadde tu pian
 * @param {string} imagePath tu pian lu jing huoURL
 * @returns {boolean} shi fouDeleteSucceeded
 */
const deleteImage = (imagePath) => {
  try {
    // ru guo shiURL，ti qu xiang dui lu jing
    if (imagePath.startsWith('/')) {
      imagePath = path.join(__dirname, '../../', imagePath);
    }
    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Deletetu pianFailed:', error);
    return false;
  }
};

/**
 * huo qu tu pianInfo
 * @param {string} imagePath tu pian lu jing huoURL
 * @returns {Object|null} tu pianInfo
 */
const getImageInfo = (imagePath) => {
  try {
    // ru guo shiURL，ti qu xiang dui lu jing
    if (imagePath.startsWith('/')) {
      imagePath = path.join(__dirname, '../../', imagePath);
    }
    
    if (!fs.existsSync(imagePath)) {
      return null;
    }
    
    const stats = fs.statSync(imagePath);
    return {
      path: imagePath,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    };
  } catch (error) {
    console.error('huo qu tu pianInfoFailed:', error);
    return null;
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  processUploadImages,
  compressImage,
  deleteImage,
  getImageInfo
};