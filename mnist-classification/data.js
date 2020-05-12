const tf = require('@tensorflow/tfjs-node');


const BASE_PATH = "file:///home/dsn/personal/Tfjs/TensorFlowjs_Projects/mnist-classification/dataset/";
const TRAIN_DATA = `${BASE_PATH}train.csv`;
const IMAGE_WIDTH = 28
const IMAGE_HEIGHT = 28
const IMAGE_CHANNEL = 1
const NUM_CLASSES = 10;
const DATA_SIZE = 42000
const NUM_TRAIN_DATA = 38000
const NUM_TEST_DATA = DATA_SIZE - NUM_TRAIN_DATA

const TENSOR_DATA = []
const LABEL = []


async function loadData() {
    const csvDataset = tf.data.csv(TRAIN_DATA, {
        columnConfigs: {
            label: { isLabel: true }
        }
    });
    await csvDataset.forEachAsync(row => process(row));

}


async function process(row) {
    TENSOR_DATA.push(Object.values(row['xs']))
    LABEL.push(Object.values(row['ys'])[0])
}


exports.MnistClass = class MnistDataset {
    constructor() {
        this.Xtrain = null
        this.Xval = null
        this.ytrain = null
        this.ytest = null
    }

    async startDataLoading(train_mode) {
        // dat = new MnistDataset()
        await loadData()
        if (train_mode == 0) {
            //partial training
            this.Xtrain = tf.tensor(TENSOR_DATA.slice(0, NUM_TRAIN_DATA)).reshape([NUM_TRAIN_DATA, IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_CHANNEL]).div(255.0)
            this.Xtest = tf.tensor(TENSOR_DATA.slice(NUM_TRAIN_DATA)).reshape([NUM_TEST_DATA, IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_CHANNEL]).div(255.0)
            this.ytrain = tf.oneHot(tf.tensor1d(LABEL.slice(0, NUM_TRAIN_DATA), 'int32'), NUM_CLASSES);
            this.ytest = tf.oneHot(tf.tensor1d(LABEL.slice(NUM_TRAIN_DATA), 'int32'), NUM_CLASSES);
        } else {
            //full training
            this.Xtrain = tf.tensor(TENSOR_DATA).reshape([DATA_SIZE, IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_CHANNEL]).div(255.0)
            this.ytrain = tf.oneHot(tf.tensor1d(LABEL, 'int32'), NUM_CLASSES);

        }

    }

}