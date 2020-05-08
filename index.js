import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { ForestDataset, FEATURE_NAMES } from './data';
import { normalizeData } from './utils'

const forestdata = new ForestDataset();
const tensors = {}
/**
 * Convert Array of Arrays to Tensors, and normalize the features
 */
export function arrayToTensor() {
    tensors['Xtrain_tf'] = normalizeData(tf.tensor2d(forestdata.Xtrain))
    tensors['Xtest_tf'] = normalizeData(tf.tensor2d(forestdata.Xtest))
    tensors['ytrain_tf'] = normalizeData(tf.tensor2d(forestdata.ytrain))
    tensors['ytest_tf'] = normalizeData(tf.tensor2d(forestdata.ytest))

}

//Download and convert data to tensor as soon as the page is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await forestdata.loadAllData()
    arrayToTensor();
    tf.print(tensors.Xtrain_tf)
    // ui.updateStatus(

    //     'Data is now available as tensors.\n' +
    //     'Click a train button to begin.');
    // // TODO Explain what baseline loss is. How it is being computed in this
    // // Instance
    // ui.updateBaselineStatus('Estimating baseline loss');
    // computeBaseline();
    // await ui.setup();
}, false);


