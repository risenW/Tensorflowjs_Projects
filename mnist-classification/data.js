const PAPA = require('papaparse');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');

const BASE_PATH = "dataset/";
const TRAIN_DATA = "train.csv";
const TEST_DATA = "test.csv";

const csvUrl = 'file://home/dsn/personal/Tfjs/TensorFlowjs%20Projects/mnist-classification/public/assets/dataset/train.csv'
console.log(Object.keys(tf.data.csv(csvUrl)))