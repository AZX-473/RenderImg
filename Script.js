var apiUrl = './API/img/';
var isnullurl=true
var imgs = [
        "008ybfh5gy1hrcyxvw09qj32b32azkjm.jpg",
"008ybfh5gy1hww1v400gyj30rs0rsdph.jpg",
"124177.jpg",
"139649.jpg",
"2020_Christmas.jpg",
"281910ee2cdf36c2840be627e7c3cd623493282386545566_waifu2x_2x_3n_png.png",
"2a17e729b93853496df310fa13efebf53493282386545566.png",
"355983.jpg",
"36873de4759f24db82764d4d13f2691d3632313418124040.png",
"44d181e6ff19626989625eac49b0b776354558777.jpg",
"479e4ed041371d6b930fe04beac77282354558777.jpg",
"5396370120876b8a9745ce3929788fa73493282386545566.png",
"56ae8e1ca8c352003ba511ef714e0274354558777.jpg",
"56e2a764ed9bea8c0518246a92c0f6c21121044614.jpg",
"57b92d22aaad760c65deb274c7b92134354558777.jpg",
"634115958.png",
"634115963.png",
"790fc58138a2a388bc179a584e7449841121044614.jpg",
"7ceaff610ece80b81728fe81586ebfb71121044614.jpg",
"7e3e6709c93d70cf3bc7f7fdc68bc600baa1cc11fdbe.webp",
"8e0fe2f13880f201de95b3e76ac86c353494352093448281.jpg",
"9202c2bbf904e0456091c11b83af7e66354558777.jpg",
"c6dddcea392bac6ce0cc3c39e2e38a0d1121044614.jpg",
"c9d2d87ebb6543b350f5593b79dd8ad33493265644980448 (1).png",
"CH0335_home_Idle_01_4.965739999999986.png",
"dd33566491f6bfa31674f7d96d8f6e533493087535958327.png",
"e2149cf15f3b8419994e54ffac5707e11121044614.jpg",
"ed22da1b44eb6f10fd65d201fbe183fc354558777.jpg",
"fc3c0dbd2200a7fe352c79c47376810e354558777.jpg",
"GEMm1uNbMAAat84.jpg",
"GgszvixbYAAqsFx.jpg",
"Midori_home_Dummy_0.033006581481720865.png",
"Momoi_home_Dummy_0.032633157747970376.png",
"Open_Wallpaper C_android.jpg",
"Snipaste_2025-12-23_12-58-10.png",
"Snipaste_2026-02-05_13-36-12.png",
"Snipaste_2026-02-12_17-59-54.png",
"ブルアカ2nd記念情報.jpg",
"宫子3840x2160.png",
"微信图片_20251228100930_350_97.png"
]
function fetchImage() {
  const randomIndex = Math.floor(Math.random() * imgs.length);
  const randomFile = apiUrl+imgs[randomIndex];
  const imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = `<img src="${randomFile}" alt="Random Image" />`;
}
function AllImg(){
location.href = "./API/img/";
}