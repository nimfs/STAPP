const model = new mi.ArbitraryStyleTransferNetwork();
const canvas = document.getElementById('stylized');
const ctx = canvas.getContext('2d');
const contentImg = document.getElementById('content');
const styleImg = document.getElementById('style');
const loading = document.getElementById('loading');
const notLoading = document.getElementById('ready');

setup();

function setup() {
  model.initialize().then(() => {
    // stylize();
    console.log('initialized');
    hideshow('start');
  });
}

function hideshow(state) {
  console.log('state');
  var loader = document.getElementById("loader");
  var inputs = document.getElementById("inputs");
  var result = document.getElementById("result");
  if(state =='creating'){
    loader.style.display="block";
    inputs.style.display = "none";
    result.style.display="block";
  }
  if(state =='done'){
    loader.style.display="none";
    inputs.style.display = "none";
    result.style.display="block";
  }
  if(state =='redo'){
    loader.style.display="none";
    inputs.style.display = "block";
    result.style.display="none";
  }
  if(state =='start'){
    loader.style.display="none";
    inputs.style.display = "block";
    result.style.display="none";
  }



}

async function clearCanvas() {
  // Don't block painting until we've reset the state.
  await mi.tf.nextFrame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  await mi.tf.nextFrame();
}

async function stylize() {
  hideshow('creating');
  await clearCanvas();

  // Resize the canvas to be the same size as the source image.
  canvas.width = contentImg.width;
  canvas.height = contentImg.height;

  // This does all the work!
  model.stylize(contentImg, styleImg).then((imageData) => {
    stopLoading();
    ctx.putImageData(imageData, 0, 0);
    hideshow('done');
  });
}

function applytransform(){
  startLoading();
  stylize();
}

function loadImage(event, imgElement) {
  const reader = new FileReader();
  reader.onload = (e) => {
    imgElement.src = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function loadContent(event) {
  loadImage(event, contentImg);
}

function loadStyle(event) {
  loadImage(event, styleImg);
}

function startLoading() {
  loading.hidden = false;
  notLoading.hidden = true;
  canvas.style.opacity = 0;
}

function stopLoading() {
  loading.hidden = true;
  notLoading.hidden = false;
  canvas.style.opacity = 1;
}
