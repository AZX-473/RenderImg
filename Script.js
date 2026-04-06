var apiUrl = './API/img/';
var isnullurl=true
var imgs = []
var urls = []
var userimgs = []
var bvids = []
const API = './api';
    
    // 加载聊天记录
    async function loadChat() {
      const chatBox = document.getElementById('chatBox');
      const res = await fetch(`${API}/getChat`);
      const data = await res.json();
      const list = data.data || [];

      chatBox.innerHTML = '';

      list.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = `
          <div class="name">${msg.username}</div>
          <div class="content">${msg.content}</div>
        `;
        chatBox.appendChild(div);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    // 发送消息
    async function sendMsg() {
      const username = document.getElementById('username').value.trim();
      const content = document.getElementById('content').value.trim();

      if (!username || !content) {
        alert('请输入名字和内容');
        return;
      }

      await fetch(`${API}/sendChat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, content })
      });

      document.getElementById('content').value = '';
      loadChat();
    }

    // 回车发送
    document.getElementById('content').addEventListener('keydown', e => {
      if (e.key === 'Enter') sendMsg();
    });

function jumpweb(jnum){
  for(let i=1;i<=5;i++){
    const toblack = document.getElementById('jn-'+i);
    toblack.className = "sidebar-item"
    if(jnum===i){
      toblack.className = "sidebar-item active"
    }
  }
}
async function getImgFiles() {
  const res = await fetch('/api/getImgFiles');
  const result = await res.json();
  if (result.success) {
    imgs = result.data;
    console.log('imgs赋值完成：', imgs);
  } else {
    console.error('获取img文件失败：', result.message);
  }
}

// 改2：获取user文件夹文件（调用新接口）
async function getUserFiles() {
  const res = await fetch('/api/getUserFiles');
  const result = await res.json();
  if (result.success) {
    userimgs = result.data;
    console.log('userimgs赋值完成：', userimgs);
  } else {
    console.error('获取user文件失败：', result.message);
  }
}

// 改3：串行初始化，确保顺序
(async () => {
  await getImgFiles();    // 先拿img
  await getUserFiles();   // 再拿user
  console.log('最终 - imgs：', imgs);
  console.log('最终 - userimgs：', userimgs);
})();
function fetchImageFromName() {
  const randomIndex = Math.floor(Math.random() * imgs.length);
  const randomFile = apiUrl+imgs[randomIndex];
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<h2>Image_Name:${imgs[randomIndex]},File_Url:${randomFile}</h2><h2>NUM_AND_SUM:${randomIndex} / ${imgs.length} (SORT:Unknow)</h2><img src="${randomFile}" alt="Random Image" onclick="fetchImageFromName()"/>`;
  imgs.splice(randomIndex, 1);//随机完就删掉防止重复加载
  if(imgs.length===0){
    getImgFiles();
  }
}
function fetchUserImageFromName() {
  const randomIndex = Math.floor(Math.random() * userimgs.length);
  const randomFile = './API/user/'+userimgs[randomIndex];
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<h2>Image_Name:${userimgs[randomIndex]},File_Url:${randomFile}</h2><h2>NUM_AND_SUM:${randomIndex} / ${userimgs.length} (SORT:Unknow)</h2><img src="${randomFile}" alt="Random Image" onclick="fetchUserImageFromName()"/>`;
  userimgs.splice(randomIndex, 1);//随机完就删掉防止重复加载
  if(userimgs.length===0){
    getUserFiles(false);
  }
}
function home(){
  window.location.href = window.location.href;
}
function fetchImageFromUrl(){
  const randomIndex = Math.floor(Math.random() * urls.length);
  const randomFile = urls[randomIndex];
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<h2>File_Url:${randomFile}</h2><h2>NUM_AND_SUM:${randomIndex} / ${urls.length} (SORT:NULL)</h2><img src="${randomFile}" alt="Random Image" onclick="fetchImageFromUrl()"/>`;
  urls.splice(randomIndex, 1);//随机完就删掉防止重复加载
  if(urls.length===0){
    loadJsonUrl("./API/file.json")
  }
}
function fetchVideoFrombvid(){
  const randomIndex = Math.floor(Math.random() * bvids.length);
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<iframe src="//player.bilibili.com/player.html?bvid=${bvids[randomIndex]}&high_quality=1" allowfullscreen="allowfullscreen" width="1024px" height="576px" scrolling="no" frameborder="0" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"></iframe><h1 onclick="home()">BACK</h1><h1 onclick="fetchVideoFrombvid()">NextVideo</h1>`
  bvids.splice(randomIndex, 1);//随机完就删掉防止重复加载
  if(bvids.length===0){
    loadJsonVideo("./API/file.json")
  }
}
function putimgs(){
  var imgstr=""
  for(var i=0;i<imgs.length;i++){
    imgstr+=`<img src="./API/img/${imgs[i]}" alt="image${i+1}"/ id=>`
  }
  const tmp = document.getElementById('image-container');
  tmp.innerHTML=imgstr
}
function putuserimgs(){
  var imgstr=""
  for(var i=0;i<userimgs.length;i++){
    imgstr+=`<img src="./API/user/${userimgs[i]}" alt="image${i+1}"/ id=>`
  }
  const tmp = document.getElementById('image-container');
  tmp.innerHTML=imgstr
}
async function loadJsonName(url) {
  jumpweb(4)
  try {
    const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      console.log('JSON 数据已加载并解析:', jsonData);
      for(var i=0;i<jsonData.allname.length;i++){
        imgs.push(jsonData.allname[i])
      }
  } catch (error) {    
    console.error('加载或解析 JSON 数据时发生错误:', error);
  }
  putimgs()
}
async function getAllUserFiles() {
  userimgs=[]
  jumpweb(5)
  const res = await fetch('/api/getUserFiles');
  const result = await res.json();
  if (result.success) {
    userimgs = result.data;
    console.log('userimgs赋值完成：', userimgs);
  } else {
    console.error('获取user文件失败：', result.message);
  }
  putuserimgs();
}
function HrefImg(){
  const tmp = document.getElementById('HrefImgName');
  const randomFile = apiUrl+tmp.value;
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<h2>Image_Name:${tmp.value},<h2>File_Url:${randomFile}</h2><img src="${randomFile}" alt="Random Image" onclick="fetchImageFromUrl()"/>`;
}
function AllImg(){
  location.href = "./API/img/";
}
function jumptochat(){
  jumpweb(3);
  let chatstr=`
  <div class="chat-box" id="chatBox"></div>
  <div class="input-area">
    <input type="text" id="username" placeholder="你的名字" value="默认名称">
    <input type="text" id="content" placeholder="输入消息..." value="请输入文本">
    <button onclick="sendMsg()">发送</button>
  </div>`
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML =  chatstr;
  loadChat()
}
function jumptopush(){
  jumpweb(2);
  let pushstr='<div class="card upload-section"><div class="card-title">上传图片</div><p style="color:#9ca3af; margin-bottom:12px;">大小限制：20MB</p><input type="file" id="uploadFile" accept="image/*" style="margin-bottom:12px;"><button class="btn btn-primary" onclick="uploadImage()">上传图片</button><div id="uploadMessage"></div></div>'
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML =  pushstr;
}
/*
async function loadJsonUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    console.log('JSON 数据已加载并解析:', jsonData);
    for(var i=0;i<jsonData.allurl.length;i++){
      urls.push(jsonData.allurl[i])
    }

  } catch (error) {    
    console.error('加载或解析 JSON 数据时发生错误:', error);
  }
}
async function loadJsonName(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    console.log('JSON 数据已加载并解析:', jsonData);
    for(var i=0;i<jsonData.allname.length;i++){
      imgs.push(jsonData.allname[i])
    }

  } catch (error) {    
    console.error('加载或解析 JSON 数据时发生错误:', error);
  }
}*/
async function loadJsonVideo(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    console.log('JSON 数据已加载并解析:', jsonData);
    for(var i=0;i<jsonData.allvideo.length;i++){
      bvids.push(jsonData.allvideo[i])
    }

  } catch (error) {    
    console.error('加载或解析 JSON 数据时发生错误:', error);
  }
}
/*
loadJsonUrl("./API/file.json")
loadJsonName("./API/file.json")*/
loadJsonVideo("./API/file.json")
if (typeof(Storage) !== "undefined") {
  if (localStorage.pageVisitCount) {
    localStorage.pageVisitCount = Number(localStorage.pageVisitCount) + 1;
  } else {
    localStorage.pageVisitCount = 1;
  }
  document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("visitCount").innerText ="This page has been visited " + localStorage.pageVisitCount + " times.";});
} else {
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("visitCount").innerText ="Your browser does not support LocalStorage.";
  });
}


function submitFeedback() {
    const feedbackTextarea = document.getElementById('Feedback');
    const feedbackMessageDiv = document.getElementById('feedbackMessage');
    const feedback = feedbackTextarea.value.trim();

    if (feedback === "") {
        feedbackMessageDiv.textContent = "反馈内容不能为空！";
        feedbackMessageDiv.style.color = "red";
        return; 
    }
    try {
        let storedFeedback = localStorage.getItem('userFeedback');
        let feedbackArray = [];

        if (storedFeedback) {
            feedbackArray = JSON.parse(storedFeedback);
        }
        feedbackArray.push({
            text: feedback,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('userFeedback', JSON.stringify(feedbackArray));
        feedbackMessageDiv.textContent = "感谢您的反馈！已为您保存。";
        feedbackMessageDiv.style.color = "green";
        feedbackTextarea.value = ""; 

    } catch (error) {
        console.error("存储反馈时发生错误:", error);
        feedbackMessageDiv.textContent = "反馈保存失败，请稍后再试。";
        feedbackMessageDiv.style.color = "red";
    }
}
function getuserFeedback() {
    let storedFeedback = localStorage.getItem('userFeedback');
    if (storedFeedback) {
        let feedbackArray = JSON.parse(storedFeedback);
        console.log("已存储的反馈:", feedbackArray); 
    }else{
      console.log("获取反馈失败"); 
    }
};
getuserFeedback()

function submitFeedbackimg() {
    const feedbackTextarea = document.getElementById('Feedbackimg');
    const feedbackMessageDiv = document.getElementById('feedbackMessageimg');
    const feedback = feedbackTextarea.value.trim();

    if (feedback === "") {
        feedbackMessageDiv.textContent = "图片链接不能为空！";
        feedbackMessageDiv.style.color = "red";
        return; 
    }
    try {
        let storedFeedback = localStorage.getItem('userFeedbackimg');
        let feedbackArray = [];

        if (storedFeedback) {
            feedbackArray = JSON.parse(storedFeedback); 
        }
        feedbackArray.push({
            text: feedback,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('userFeedbackimg', JSON.stringify(feedbackArray));
        feedbackMessageDiv.textContent = "感谢您的提交！已为您保存。";
        feedbackMessageDiv.style.color = "green";
        feedbackTextarea.value = ""; 

    } catch (error) {
        console.error("发生错误:", error);
        feedbackMessageDiv.textContent = "保存失败，请稍后再试。";
        feedbackMessageDiv.style.color = "red";
    }
}

function getuserFeedbackimg() {
    let storedFeedback = localStorage.getItem('userFeedbackimg');
    if (storedFeedback) {
        let feedbackArray = JSON.parse(storedFeedback);
        console.log("已存储的上传图片:", feedbackArray);
        for(var i=0;i<feedbackArray.length;i++){
          usreimgs.push(feedbackArray[i].text)
        }
    }
};
getuserFeedbackimg()
function fetchuserFeedimg(){
  const randomIndex = Math.floor(Math.random() * usreimgs.length);
  const randomFile = usreimgs[randomIndex];
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<h2>File_Url:${randomFile}</h2><h2>NUM_AND_SUM:${randomIndex} / ${usreimgs.length} (SORT:NULL)</h2><img src="${randomFile}" alt="Random Image" onclick="fetchuserFeedimg()"/>`;
}
function jumptoallimgname(){
  window.location.href = './ALLIMG_NAME.html';
}
function jumptoallimgnameuser(){
  window.location.href = './ALLIMG_USER.html';
}
async function uploadImage() {
  const fileInput = document.getElementById('uploadFile');
  const messageEl = document.getElementById('uploadMessage');
  
  if (!fileInput.files || fileInput.files.length === 0) {
    messageEl.textContent = '请先选择要上传的图片！';
    messageEl.style.color = 'red';
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/uploadToUser', { // 写全域名，避免相对路径问题
      method: 'POST',
      body: formData,
      headers: {
        // 移除Content-Type，让浏览器自动添加（multipart/form-data需要boundary）
        'Accept': 'application/json'
      }
    });
    
    const rawText = await response.text();
    console.log('后端原始返回：', rawText);

    // 兼容返回HTML错误的情况
    if (rawText.startsWith('<')) {
      throw new Error('接口访问失败：' + rawText.substring(0, 50));
    }

    const result = JSON.parse(rawText);
    if (result.success) {
      messageEl.textContent = result.message;
      messageEl.style.color = 'green';
      await getUserFiles();
      fileInput.value = '';
    } else {
      messageEl.textContent = result.message;
      messageEl.style.color = 'red';
    }
  } catch (error) {
    console.error('上传错误：', error);
    messageEl.textContent = `上传失败：${error.message}`;
    messageEl.style.color = 'red';
  }
}
 function jump_to_new(){
  var currentURL = window.location.href;
  if(currentURL.includes("github")){
    window.location.href = "http://azx.gorsu.ch:59878/Render.html"
  }
 }