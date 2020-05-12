const tf = require('@tensorflow/tfjs-node');
const data = require('./data')

const IMAGE_WIDTH = 28
const IMAGE_HEIGHT = 28
const IMAGE_CHANNEL = 1



function getModel() {

    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [IMAGE_HEIGHT, IMAGE_WIDTH, IMAGE_CHANNEL],
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
    model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

    const optimizer = 'rmsprop';
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return model

}


exports.trainModel = async (args) => {
    const cnn_model = getModel()
    const train_mode = args.train_mode
    mnist = data.MnistClass
    dataset = new mnist()

    if (train_mode == 0) {
        //partial training with train and test set
        dataset.startDataLoading(train_mode).then(async () => {
            console.log("Data Loaded Successfully. Training started.")
            await cnn_model.fit(dataset.Xtrain, dataset.ytrain, {
                epochs: args.epochs,
                batchSize: args.batch_size,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: async (epoch, logs) => {
                        console.log(`EPOCH (${epoch + 1}): Train Accuracy: ${(logs.acc * 100).toFixed(2)}, Val Accuracy:  ${(logs.val_acc * 100).toFixed(2)}\n`);
                    }
                }
            })

            console.log("Testing on Final Test Set")
            const eval = cnn_model.evaluate(dataset.Xtest, dataset.ytest)
            console.log(`Test Loss: ${(eval[0].dataSync()[0]).toFixed(3)}, Test Accuracy:  ${(eval[1].dataSync()[0] * 100).toFixed(2)}\n`);

        })

    } else {
        //full mode training 
        dataset.startDataLoading(train_mode).then(async () => {
            console.log("Full Data Loaded Successfully. Training started.")
            await cnn_model.fit(dataset.Xtrain, dataset.ytrain, {
                epochs: args.epochs,
                batchSize: args.batch_size,
                callbacks: {
                    onEpochEnd: async (epoch, logs) => {
                        console.log(`EPOCH (${epoch + 1}): Train Accuracy: ${(logs.acc * 100).toFixed(2)}\n`);
                    }
                }
            })

            console.log('*************************\n')
            console.log(`Saving Model to ${args.model_save_path}`)
            await cnn_model.save(args.model_save_path)
            console.log(`Saved model to path: ${args.model_save_path}\n`);
        })

    }

}