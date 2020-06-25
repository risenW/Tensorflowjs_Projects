let model;
let webcam
let webcamElement = document.getElementById("webcam")
let capturing = false

async function capture() {
    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
    // array of detected faces from the MediaPipe graph.
    // webcam = await tf.data.webcam(webcamElement);
    capturing = true

    while (capturing) {
        const img = await webcam.capture();
        const predictions = await model.estimateFaces(img);

        if (predictions.length > 0) {
            /*
            `predictions` is an array of objects describing each detected face, for example:
        
            [
              {
                faceInViewConfidence: 1, // The probability of a face being present.
                boundingBox: { // The bounding box surrounding the face.
                  topLeft: [232.28, 145.26],
                  bottomRight: [449.75, 308.36],
                },
                mesh: [ // The 3D coordinates of each facial landmark.
                  [92.07, 119.49, -17.54],
                  [91.97, 102.52, -30.54],
                  ...
                ],
                scaledMesh: [ // The 3D coordinates of each facial landmark, normalized.
                  [322.32, 297.58, -17.54],
                  [322.18, 263.95, -30.54]
                ],
                annotations: { // Semantic groupings of the `scaledMesh` coordinates.
                  silhouette: [
                    [326.19, 124.72, -3.82],
                    [351.06, 126.30, -3.00],
                    ...
                  ],
                  ...
                }
              }
            ]
            */
            let a = []; b = []; c = []
            for (let i = 0; i < predictions.length; i++) {
                const keypoints = predictions[i].mesh;
                // Log facial keypoints.
                for (let i = 0; i < keypoints.length; i++) {
                    const [x, y, z] = keypoints[i];
                    a.push(y)
                    b.push(x)
                    c.push(z)
                    // console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
                }
            }

            // Plotting the mesh
            var data = [
                {
                    opacity: 0.8,
                    color: 'rgb(300,100,200)',
                    type: 'mesh3d',
                    x: a,
                    y: b,
                    z: c,
                }
            ];
            Plotly.newPlot('myDiv', data);

        }
    }
}

async function main() {
    // Load the MediaPipe facemesh model.
    model = await facemesh.load();
    console.log("Model loaded")

    webcam = await tf.data.webcam(webcamElement);
    const imgtemp = await webcam.capture();
    imgtemp.dispose()

    document.getElementById("capture").addEventListener("click", function () {
        capture()
    })

    document.getElementById("stop").addEventListener("click", function () {
        capturing = false
    })
}



main();