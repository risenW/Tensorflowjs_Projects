/***
 * Code for canvas drawing was stolen shamelessly from this nice project below
 * https://github.com/Gogul09/digit-recognizer-live/blob/master/js/app.js
 */

const canvasWidth = 400;
const canvasHeight = 400;
const canvasStrokeStyle = "white";
const canvasLineJoin = "round";
const canvasLineWidth = 2;
const canvasBackgroundColor = "black";
const canvasId = "canvas";

var clickX = new Array();
var clickY = new Array();
var clickD = new Array();
var drawing;

//---------------
// Create canvas
//---------------
const canvasBox = document.getElementById('canvasDiv');
const canvas = document.createElement("canvas");

canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("id", canvasId);
canvas.style.backgroundColor = canvasBackgroundColor;
canvasBox.appendChild(canvas);

ctx = canvas.getContext("2d");


//---------------------
// MOUSE DOWN function
//---------------------
$("#canvas").mousedown(function (e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    drawing = true;
    addUserGesture(mouseX, mouseY);
    drawOnCanvas();
});


//---------------------
// MOUSE MOVE function
//---------------------
$("#canvas").mousemove(function (e) {
    if (drawing) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
        addUserGesture(mouseX, mouseY, true);
        drawOnCanvas();
    }
});


//-------------------
// MOUSE UP function
//-------------------
$("#canvas").mouseup(function (e) {
    drawing = false;
});


//----------------------
// MOUSE LEAVE function
//----------------------
$("#canvas").mouseleave(function (e) {
    drawing = false;
});


//--------------------
// ADD CLICK function
//--------------------
function addUserGesture(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickD.push(dragging);
}

//-------------------
// RE DRAW function
//-------------------
function drawOnCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.strokeStyle = canvasStrokeStyle;
    ctx.lineJoin = canvasLineJoin;
    ctx.lineWidth = canvasLineWidth;

    for (var i = 0; i < clickX.length; i++) {
        ctx.beginPath();
        if (clickD[i] && i) {
            ctx.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            ctx.moveTo(clickX[i] - 1, clickY[i]);
        }
        ctx.lineTo(clickX[i], clickY[i]);
        ctx.closePath();
        ctx.stroke();
    }
}

//------------------------
// CLEAR CANVAS function
//------------------------
function clearCanvas(id) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    clickX = new Array();
    clickY = new Array();
    clickD = new Array();
}


//Updating model status
tstatus = document.getElementById('status')
predval = document.getElementById('predval')


//Load the CNN Model on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadModel();
}, false);


async function loadModel() {
    tstatus.innerText = 'Loading Model...'
    model = await tf.loadLayersModel("http://localhost:3000/assets/model/py_model.json");
    tstatus.innerText = 'Model Loaded Successfully. Start Drawing!'
    // model.summary()
}


/**
 * Preprocess the Image drawn on canvas and reshape it to [1,28,28,1]
 */
function getImageFromCanvas(image) {

    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat()
    return tensor.div(255.0)


}


async function predict() {
    let tensor = getImageFromCanvas(canvas);
    let pred = await model.predict(tensor).argMax([-1])
    predval.innerText = `This is a ${pred.arraySync()}`
}