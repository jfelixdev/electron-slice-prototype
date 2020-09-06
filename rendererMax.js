const { ipcRenderer } = require('electron');

// Get the #imageCanvas and #imageView elements
const body = document.getElementById('body');
const imageCanvas = document.getElementById('imageCanvas');
//const imageView = document.getElementById('imageView');

//Set the canvas size to the available screen area
imageCanvas.style.width = screen.availWidth + 'px';
imageCanvas.style.height = screen.availHeight + 'px';

// Add event listener to exit out of maximize on click outside image
// @todo Set #imageCanvas size on window creation to make this code work properly again
body.addEventListener("click", function (e) {
  if (e.composedPath()[0] === body || e.composedPath()[0] === imageCanvas) {
    ipcRenderer.send('click-window-unmaximize');
  }
});