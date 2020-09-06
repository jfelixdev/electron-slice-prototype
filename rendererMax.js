const { ipcRenderer } = require('electron');

// Get the #imageCanvas and #imageView elements
const body = document.getElementById('body');
const imageCanvas = document.getElementById('imageCanvas');
//const imageView = document.getElementById('imageView');

// Add event listener to exit out of maximize on click outside image
// @todo Set #imageCanvas size on window creation to make this code work properly again
window.addEventListener("click", function (e) {
  if (e.composedPath()[0] === this || e.composedPath()[0] === imageCanvas) {
    console.log('Clicked on body or canvas');
    console.log(e.composedPath());
    ipcRenderer.send('click-window-unmaximize');
  }
});