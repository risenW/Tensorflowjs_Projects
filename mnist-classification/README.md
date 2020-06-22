## Build and Train a Neural Network to classify Mnist Handwritten Digits Using Tensorflow.js

### INSTALLATION PROCESS

- Clone the repo

```
   git clone https://github.com/risenW/Tensorflowjs_Projects
   cd Tensorflowjs_Projects/mnist-classification
```

- Install [Node.js](https://nodejs.org/en/) (Any version greater than 8)
- Install a package manager (preferably [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)

### Install Packages

```
    npm install

```

### Train CNN Model in the backend (Set training command line arguments)

```
node app.js --train_mode=0 --epochs=10 --batch_size=64 --model_save_path='file:///home/TensorFlowjs_Projects/mnist-classification/public/assets/model'

```
### Start the Web server

```
npm start

```

### [Link](https://heartbeat.fritz.ai/deep-learning-in-javascript-part-2-a2823defd3d9) to Medium article!
