var apiUrl = './API/img/';
var isnullurl=true
var imgs = []
var urls = []
function fetchImageFromName() {
  const randomIndex = Math.floor(Math.random() * imgs.length);
  const randomFile = apiUrl+imgs[randomIndex];
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<h2>Image_Name:${imgs[randomIndex]},File_Url:${randomFile}</h2><h2>NUM_AND_SUM:${randomIndex} / ${imgs.length} (SORT:NAME)</h2><img src="${randomFile}" alt="Random Image" onclick="fetchImageFromName()"/>`;
}
function fetchImageFromUrl(){
  const randomIndex = Math.floor(Math.random() * urls.length);
  const randomFile = urls[randomIndex];
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<h2>File_Url:${randomFile}</h2><h2>NUM_AND_SUM:${randomIndex} / ${urls.length} (SORT:NAME)</h2><img src="${randomFile}" alt="Random Image" onclick="fetchImageFromUrl()"/>`;
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
}
loadJsonUrl("./API/file.json")
loadJsonName("./API/file.json")
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
    const feedback = feedbackTextarea.value.trim(); // 获取并去除首尾空格

    if (feedback === "") {
        feedbackMessageDiv.textContent = "反馈内容不能为空！";
        feedbackMessageDiv.style.color = "red";
        return; // 如果为空，则不执行后续操作
    }

    // --- 这里是“存储”到 localStorage 的操作 ---
    try {
        // 1. 从 localStorage 获取已有的反馈列表（如果存在）
        let storedFeedback = localStorage.getItem('userFeedback');
        let feedbackArray = [];

        if (storedFeedback) {
            feedbackArray = JSON.parse(storedFeedback); // 将JSON字符串解析回数组
        }

        // 2. 将新的反馈添加到数组中
        // 可以选择存储一个对象，包含时间戳等信息
        feedbackArray.push({
            text: feedback,
            timestamp: new Date().toLocaleString() // 添加提交的时间
        });

        // 3. 将更新后的数组重新存储到 localStorage
        // JSON.stringify() 将JavaScript对象或数组转换为JSON字符串
        localStorage.setItem('userFeedback', JSON.stringify(feedbackArray));

        // --- 操作完成后的反馈 ---
        feedbackMessageDiv.textContent = "感谢您的反馈！已为您保存。";
        feedbackMessageDiv.style.color = "green";
        feedbackTextarea.value = ""; // 清空输入框

    } catch (error) {
        console.error("存储反馈时发生错误:", error);
        feedbackMessageDiv.textContent = "反馈保存失败，请稍后再试。";
        feedbackMessageDiv.style.color = "red";
    }
}

// --- （可选）加载已有反馈 ---
// 你也可以在这里添加一个功能，读取并显示 localStorage 中的反馈
// 例如，当页面加载时，显示所有存储过的反馈
window.onload = function() {
    let storedFeedback = localStorage.getItem('userFeedback');
    if (storedFeedback) {
        let feedbackArray = JSON.parse(storedFeedback);
        console.log("已存储的反馈:", feedbackArray); // 在浏览器控制台查看
        // 如果你想在页面上直接显示（例如，在一个列表中），你需要构建相应的HTML
        // 但通常，仅靠 JS/HTML 的反馈提交功能，不太会直接在页面上列出所有历史反馈。
    }
};
