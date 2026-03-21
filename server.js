const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 5500;

// 修复跨域：确保OPTIONS请求能正常响应
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length');
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// 静态文件托管
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 修复multer配置：自定义存储（避免临时文件重命名问题）
const storage = multer.diskStorage({
  // 存储路径
  destination: (req, file, cb) => {
    const userFolder = path.resolve(__dirname, 'API', 'user');
    // 确保文件夹存在
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }
    cb(null, userFolder);
  },
  // 文件名：保留原文件名，避免重复
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // 文件后缀
    const name = path.basename(file.originalname, ext); // 文件名（无后缀）
    // 重复文件命名：name_时间戳.ext（比如 test_1711234567.jpg）
    const fileName = `${name}_${Date.now()}${ext}`;
    cb(null, fileName);
  }
});

// 重新配置multer
const upload = multer({
  storage: storage, // 使用自定义存储
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持上传 jpg/png/gif/webp 格式的图片！'), false);
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// 原有接口：getImgFiles
app.get('/api/getImgFiles', (req, res) => {
  const targetFolder = path.resolve(__dirname, 'API', 'img');
  try {
    if (!fs.existsSync(targetFolder)) throw new Error(`img文件夹不存在：${targetFolder}`);
    const files = getFileNameListSync(targetFolder, false);
    res.json({ success: true, data: files });
  } catch (err) {
    res.json({ success: false, data: [], message: err.message });
  }
});

// 原有接口：getUserFiles
app.get('/api/getUserFiles', (req, res) => {
  const targetFolder = path.resolve(__dirname, 'API', 'user');
  try {
    if (!fs.existsSync(targetFolder)) throw new Error(`user文件夹不存在：${targetFolder}`);
    const files = getFileNameListSync(targetFolder, false);
    res.json({ success: true, data: files });
  } catch (err) {
    res.json({ success: false, data: [], message: err.message });
  }
});

// 修复上传接口：确保始终返回JSON
app.post('/api/uploadToUser', (req, res) => {
  // 用try-catch包裹multer，避免报错时返回非JSON
  upload.single('image')(req, res, (err) => {
    try {
      // 处理multer的错误（文件类型/大小限制）
      if (err) {
        throw new Error(err.message);
      }
      if (!req.file) {
        throw new Error('未选择要上传的图片！');
      }
      // 成功返回JSON
      res.json({
        success: true,
        message: `图片上传成功：${req.file.originalname}（保存为：${req.file.filename}）`,
        fileName: req.file.filename
      });
    } catch (error) {
      // 失败也返回JSON（核心修复！）
      res.status(200).json({
        success: false,
        message: `上传失败：${error.message}`
      });
    }
  });
});

// 遍历函数
function getFileNameListSync(folderPath, isRecursive = false) {
  const fileNameList = [];
  if (!fs.existsSync(folderPath)) return fileNameList;
  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    const fullPath = path.join(folderPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) fileNameList.push(file);
    else if (stat.isDirectory() && isRecursive) fileNameList.push(...getFileNameListSync(fullPath, isRecursive));
  });
  return fileNameList;
}

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行：http://localhost:${port}`);
  console.log(`服务器根目录：${__dirname}`);
});
