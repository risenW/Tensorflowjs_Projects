
const tf = require('@tensorflow/tfjs-node')
const books = require("../data/web_book_data.json")


async function loadModel() {
    console.log('Loading Model...')
    model = await tf.loadLayersModel("file:///home/dsn/personal/Tfjs/TensorFlowjs_Projects/recommender-sys/recommender-books/model/model.json", false);
    console.log('Model Loaded Successfull')
    model.summary()
}

loadModel()