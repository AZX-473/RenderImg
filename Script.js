var apiUrl = './API/img/';
var isnullurl=true
var imgs = []
var urls = []
function fetchImageFromName() {
  const randomIndex = Math.floor(Math.random() * imgs.length);
  const randomFile = apiUrl+imgs[randomIndex];
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<img src="${randomFile}" alt="Random Image" onclick="fetchImageFromName()"/>`;
}
function fetchImageFromUrl(){
  const randomIndex = Math.floor(Math.random() * urls.length);
  const randomFile = urls[randomIndex];
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<img src="${randomFile}" alt="Random Image" onclick="fetchImageFromUrl()"/>`;
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