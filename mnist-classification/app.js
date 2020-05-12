const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const argparse = require('argparse');

const model = require('./model')


const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const parser = new argparse.ArgumentParser({
    description: 'TensorFlow.js-Node MNIST Classification.',
    addHelp: true
});
parser.addArgument('--epochs', {
    type: 'int',
    defaultValue: 5,
    help: 'Number of epochs to train the model for.'
});
parser.addArgument('--batch_size', {
    type: 'int',
    defaultValue: 128,
    help: 'Batch size to be used during model training.'
})
parser.addArgument('--model_save_path', {
    type: 'string',
    help: 'Path to which the model will be saved after training.'
});
parser.addArgument('--train_mode', {
    type: 'int',
    help: 'Train with full dataset ot not on node backend (1=true, 0=false).'
});

const args = parser.parseArgs();


if (args.train_mode == 1) {
    console.log("Loading Full Dataset. Sit back and relax")
    model.trainModel(args)
}

if (args.train_mode == 0) {
    console.log("Loading Train and Test Dataset. Sit back and relax")
    model.trainModel(args)
}


module.exports = app;