// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron');

//Code I was playing with to open files from input args
/* const { remote } = require('electron')
const cwd = remote.process.cwd();
const inputArgs = remote.process.argv;
const inputPath = inputArgs.pop();
console.log('cwd: ' + cwd);
console.log('inputArgs: ' + inputArgs);
console.log('inputPath: ' + inputPath); */

// Get the #imageCanvas and #imageView elements
const body = document.getElementById('body');
const imageCanvas = document.getElementById('imageCanvas');
const imageView = document.getElementById('imageView');

/**
 * Calculates and resizes #ImageCanvas and #ImageView elements.
 * Called on window 'resize' event
 */
function onWindowResize(){
  // Calculate aspect ratio of available area (screen size minus taskbar)
  // NOTE: This gets the aspect ratio of the primary monitor's available area
  let aspectRatio = screen.availWidth / screen.availHeight;

  // Resize the canvas to fit the current window according to the calculated aspect ratio
  // Compares aspect ratio of window vs screen aspect ratio
  let canvasWidth = ((window.innerWidth / window.innerHeight) < aspectRatio) ? window.innerWidth : window.innerHeight * aspectRatio;
  let canvasHeight = ((window.innerWidth / window.innerHeight) < aspectRatio) ?  window.innerWidth / aspectRatio : window.innerHeight;
  imageCanvas.style.width = canvasWidth + 'px';
  imageCanvas.style.height = canvasHeight + 'px';
  
  /*
  * 
  * CHANGE HOW THIS LOGIC WORKS
  * Notice how the image behaves if already zoomed past 1 and then resized
  * 
  */
   //Calculate size of image and set zoom
  let imageWidth = parseInt(getComputedStyle(imageView).getPropertyValue('--image-width'), 10);
  let imageHeight = parseInt(getComputedStyle(imageView).getPropertyValue('--image-height'), 10);
  console.log(`imageWidth: ${imageWidth} imageHeight: ${imageHeight}`);
  console.log(`window.innerWidth: ${window.innerWidth} window.innerHeight: ${window.innerHeight}`);
  let widthZoom, heightZoom = 1;
  if(window.innerWidth < imageWidth){
    widthZoom = window.innerWidth/imageWidth;
  }
  if(window.innerHeight < imageHeight){
    heightZoom = window.innerHeight/imageHeight;
  }
  //Set smallest of the two zoom values
  let zoom = (widthZoom < heightZoom) ? widthZoom : heightZoom;
  console.log(`widthZoom: ${widthZoom} heightZoom: ${heightZoom} zoom: ${zoom}`);
  imageView.style.setProperty('--image-zoom', zoom);
}
onWindowResize(); //Call on startup

//Attach window resize event listener
window.addEventListener('resize', function(e){
  e.preventDefault();
  onWindowResize();
})

setInterval(function(){

  imageView.style.setProperty('--image-zoom', (imageView.style.getPropertyValue('--image-zoom') * 0.9));
}, 1000);

// Code to not show image until document is ready
/*document.addEventListener("DOMContentLoaded", function(event) { 
  console.log('document ready, displaying image');
  imageView.style.display = 'block';
});*/

body.addEventListener("click", function (e) {
  if (e.composedPath()[0] === this || e.composedPath()[0] === imageCanvas) {
    console.log('Clicked on body or canvas');
    ipcRenderer.send('click-window-unmaximize');
}
});