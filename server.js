const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 5500;

// ========== 核心修复：跨域配置（解决Failed to fetch的关键） ==========
// 1. 替换*为具体前端域名（本地+服务器），支持带凭证
const ALLOWED_ORIGINS = [
  'http://localhost:8080', // 本地前端地址（根据你的实际端口调整）
  'https://azx.frpok.com'
];

app.use((req, res, next) => {
  // 动态获取请求来源，只允许白名单内的域名
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]); // 兜底用本地
  }
  
  // 补充缺失的CORS头，支持文件上传和凭证传递
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允许带凭证（关键）
  res.setHeader('Access-Control-Max-Age', '3600'); // 预检请求缓存1小时，减少OPTIONS请求
  
  // 处理OPTIONS预检请求（返回204而非200，符合规范）
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  
  // 设置请求超时（5分钟，避免大文件上传超时）
  req.setTimeout(300000, () => {
    res.status(408).json({ success: false, message: '上传超时，请重试' });
  });
  
  next();
});

// 静态文件托管
app.use(express.static(__dirname));
// 增大请求体限制（适配文件上传）
app.use(express.json({ limit: '20MB' }));
app.use(express.urlencoded({ extended: true, limit: '20MB' }));

// ========== multer配置（保留你的原有逻辑，仅优化错误处理） ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userFolder = path.resolve(__dirname, 'API', 'user');
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }
    cb(null, userFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const fileName = `${name}_${Date.now()}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
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

// ========== 原有接口：保持不变 ==========
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

// ========== 上传接口：优化错误状态码 ==========
app.post('/api/uploadToUser', (req, res) => {
  upload.single('image')(req, res, (err) => {
    try {
      if (err) {
        // 错误时返回400状态码（而非200），前端更容易识别
        return res.status(400).json({
          success: false,
          message: `上传失败：${err.message}`
        });
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '未选择要上传的图片！'
        });
      }
      res.json({
        success: true,
        message: `图片上传成功：${req.file.originalname}（保存为：${req.file.filename}）`,
        fileName: req.file.filename
      });
    } catch (error) {
      // 服务器内部错误返回500
      res.status(500).json({
        success: false,
        message: `服务器错误：${error.message}`
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

// ========== 启动服务器：绑定0.0.0.0，允许外部访问 ==========
app.listen(port, '0.0.0.0', () => {
  console.log(`服务器运行：http://0.0.0.0:${port}`); // 替换localhost为0.0.0.0，允许服务器外部访问
  console.log(`服务器根目录：${__dirname}`);
});
