var apiUrl = './API/img/';
var isnullurl=true
var imgs = []
var urls = []
var usreimgs = []
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
  imageContainer.innerHTML = `<h2>File_Url:${randomFile}</h2><h2>NUM_AND_SUM:${randomIndex} / ${urls.length} (SORT:NULL)</h2><img src="${randomFile}" alt="Random Image" onclick="fetchImageFromUrl()"/>`;
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
function jumptoallimgurl(){
  window.location.href = './ALLIMG_URL.html';
}