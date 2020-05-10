const tf = require('@tensorflow/tfjs-node');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const argparse = require('argparse');

const data = require('./data')
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
parser.addArgument('--train', {
    type: 'int',
    defaultValue: 0,
    help: 'Train model on node backend (1=true, 0=false).'
});

const args = parser.parseArgs();


if (args.train == 1) {
    console.log("Training Started. Sit back and relax")
    const cnn_model = model.getModel()
    data.loadModelAndTrain(args).then((da) => {
        cnn_model.fitDataset(da, {
            epochs: args.epochs,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    console.log(epoch + ':' + logs.acc);
                }
            }
        })
        // da.forEachAsync(e => console.log(e))

    })
    // Fit the model using the prepared Dataset
    // cnn_model.fitDataset(data.loadModelAndTrain(args), {
    //     epochs: args.epochs,
    //     callbacks: {
    //         onEpochEnd: async (epoch, logs) => {
    //             console.log(epoch + ':' + logs.acc);
    //         }
    //     }
    // });



    // data.loadModelAndTrain(args).then(cnn_model => {
    //     console.log(`Final Loss: ${cnn_model.history.loss}\n`)
    //     console.log(`Final Accuracy: ${cnn_model.history.acc}\n`)
    //     console.log(`Saving Model in ${args.model_save_path}\n`)
    //     if (args.model_save_path != null) {
    //         cnn_model.save(args.model_save_path).then(() => {
    //             console.log(`Saved model to path: ${args.model_save_path}\n`);
    //         })
    //     }

    // }).catch(err => {
    //     console.log(err)
    // })
}


module.exports = app;