const PAPA = require('papaparse');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');

const BASE_PATH = "file:///home/dsn/personal/Tfjs/TensorFlowjs_Projects/mnist-classification/dataset/";
const TRAIN_DATA = `${BASE_PATH}train.csv`;
const IMAGE_WIDTH = 28
const IMAGE_HEIGHT = 28
const IMAGE_CHANNEL = 1
const IMAGE_SIZE = 784;
const NUM_CLASSES = 10;



exports.loaddata = async () => {
    const csvDataset = tf.data.csv(TRAIN_DATA, {
        columnConfigs: {
            label: { isLabel: true }
        }
    });

    const num_features = (await csvDataset.columnNames()).length - 1

    const proc_data = csvDataset.take(5000).map(({ xs, ys }) => {
        return {
            xs: tf.tensor3d(Object.values(xs), [IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_CHANNEL]),
            ys: tf.tensor1d(Object.values(ys), "int32").oneHot(NUM_CLASSES)
        }
        // tf.print(tf.tensor1d(Object.values(ys), "int32").oneHot(NUM_CLASSES).shape)
        
    }).batch(128)


    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
    }));
    model.add(tf.layers.conv2d({
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
    model.add(tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: 'relu',
    }));
    model.add(tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: 'relu',
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dropout({ rate: 0.25 }));
    model.add(tf.layers.dense({ units: 512, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

    const optimizer = 'rmsprop';
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });


    // Fit the model using the prepared Dataset
    return model.fitDataset(proc_data, {
        epochs: 5,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                console.log(epoch + ':' + logs.acc);
            }
        }
    });




}

