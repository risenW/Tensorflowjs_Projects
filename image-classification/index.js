let base_net,webcam;
const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();


async function addExample(classId) {
    // Capture an image from the web camera.
    const img = await webcam.capture();

    // Get the intermediate activation of MobileNet
    const activation = base_net.infer(img, true);

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);

    // Dispose the tensor to release the memory.
    img.dispose();
}



async function app() {
    console.log('DownLoading mobilenet..');
    // Load the MobileNet pretrained model.
    base_net = await mobilenet.load();
    console.log('Successfully loaded model');

    // Create an object from Tensorflow.js data API which could capture image 
    // from the web camera as Tensor.
    webcam = await tf.data.webcam(webcamElement);
    // Reads an image from the webcam and associates it with a specific class
    // index.

    // When clicking a button, add an example for that class.
    document.getElementById('class-up').addEventListener('click', () => addExample(0));
    document.getElementById('class-down').addEventListener('click', () => addExample(1));
    document.getElementById('class-left').addEventListener('click', () => addExample(2));
    document.getElementById('class-right').addEventListener('click', () => addExample(3));
    document.getElementById('class-nothing').addEventListener('click', () => addExample(4));


    while (true) {
        if (classifier.getNumClasses() > 0) {
            const img = await webcam.capture();

            // Get the activation from mobilenet from the webcam.
            const activation = base_net.infer(img, 'conv_preds');
            // Get the most likely class and confidence from the classifier module.
            const result = await classifier.predictClass(activation);

            const classes = ['up', 'down', 'left', 'right', 'nothing'];
            let finalpred = classes[result.label]
            let prob = (Number(result.confidences[result.label]) * 100).toFixed(2)
            if (finalpred === 'nothing') {
                document.getElementById('output').innerText = `I am ${prob}% sure you're pointing nothing`
            } else {
                document.getElementById('output').innerText = `I am ${prob}% sure you're pointing ${finalpred}`
            }

            // Dispose the tensor to release the memory.
            img.dispose();
        }

        await tf.nextFrame();
    }
}

app();