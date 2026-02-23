const displayedImage = document.querySelector(".displayed-img");
const thumbBar = document.querySelector(".thumb-bar");
const btn = document.querySelector("button");
const overlay = document.querySelector(".overlay");
const focusedImage = document.querySelector(".focused");
const baseURL = "/lab-4/part-2/images/"

const images = [
    {filename:"pic1.jpg" ,alt:"Closeup of a human eye"},
    {filename:"pic2.jpg" ,alt:"Rock that looks like a wave"},
    {filename:"pic3.jpg" ,alt:"Purple and white pansies"},
    {filename:"pic4.jpg" ,alt:"Section of wall from a pharaoh's tomb"},
    {filename:"pic5.jpg" ,alt:"Large moth on a leaf"}
]


function updateDisplayImage(img) {
    displayedImage.src = img.target.src
}


let counter = 1
for (let image of images) {
    let img = document.createElement("img");
    img.src = baseURL + image.filename;
    img.alt = image.alt;
    img.tabIndex = counter;
    counter += 1;
    img.addEventListener("click",updateDisplayImage);
    img.addEventListener("keydown", (KeyEvent) => {
        if (KeyEvent.code === "Enter") {
            updateDisplayImage(KeyEvent);
        }
    });
    thumbBar.appendChild(img);
}



