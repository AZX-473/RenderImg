const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 5500;

// ==========================================
// 全局解析请求体
// ==========================================
app.use(express.json({ limit: '20MB' }));
app.use(express.urlencoded({ extended: true, limit: '20MB' }));

// ==========================================
// ✅ 终极跨域 + 私有网络策略修复（关键）
// ==========================================
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// 静态托管整个项目
app.use(express.static(path.join(__dirname)));

// ===================== 聊天功能 =====================
const chatFile = path.join(__dirname, 'chatHistory.json');
if (!fs.existsSync(chatFile)) fs.writeFileSync(chatFile, '[]', 'utf8');

function readChat() {
  try { return JSON.parse(fs.readFileSync(chatFile, 'utf8')) || []; } catch { return []; }
}
function saveChat(messages) {
  fs.writeFileSync(chatFile, JSON.stringify(messages, null, 2), 'utf8');
}

app.get('/api/getChat', (req, res) => {
  res.json({ success: true, data: readChat() });
});

app.post('/api/sendChat', (req, res) => {
  try {
    const { username, content } = req.body;
    if (!username || !content) return res.json({ success: false, message: "姓名和内容不能为空" });

    let chat = readChat();
    chat.push({ username: username.trim(), content: content.trim() });
    if (chat.length > 114514) chat.shift();
    saveChat(chat);

    res.json({ success: true, message: "发送成功" });
  } catch (e) {
    res.json({ success: false, message: "发送失败：" + e.message });
  }
});

// ===================== 上传功能 =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userFolder = path.join(__dirname, 'API', 'user');
    if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });
    cb(null, userFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('仅支持图片'), false);
  },
  limits: { fileSize: 20 * 1024 * 1024 }
});

// ===================== 文件接口 =====================
function getFiles(folder) {
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder).filter(f => fs.statSync(path.join(folder, f)).isFile());
}

app.get('/api/getImgFiles', (req, res) => {
  const target = path.join(__dirname, 'API', 'img');
  try {
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
    res.json({ success: true, data: getFiles(target) });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.get('/api/getUserFiles', (req, res) => {
  const target = path.join(__dirname, 'API', 'user');
  try {
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
    res.json({ success: true, data: getFiles(target) });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.post('/api/uploadToUser', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: "未选择文件" });
    res.json({ success: true, fileName: req.file.filename });
  });
});

// ==========================================
// ✅ 监听 0.0.0.0 公网可访问（服务器必须这样写）
// ==========================================
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ 服务器已启动：http://0.0.0.0:${port}`);
});
