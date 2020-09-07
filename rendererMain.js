//const { ipcRenderer } = require('electron');

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
  
   // Calculate size of image and set zoom
   // @todo Make this logic work if zoom is set past 1 when resize begins
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

// Attach window resize event listener
// @todo Don't attach this listener to maxWindow
window.addEventListener('resize', function(e){
  e.preventDefault();
  onWindowResize();
});