import {CreateNeuralNetwork,train} from '.'
const status_bar = document.getElementById("status_bar");
const training_bar = document.getElementById("training_bar");



export function updateStatus(msg) {
    status_bar.innerHTML = msg
}

export function updateTrainingStatus(curr_epoch, EPOCHs) {
    let msg = `EPOCH: ${curr_epoch + 1} of ${EPOCHs} completed...`
    training_bar.innerHTML = msg
}

export async function setUp() {
    const trainModel = document.getElementById('trainModel')

    trainModel.addEventListener('click', async () => {
        const model = CreateNeuralNetwork();
        await train(model);
    }, false)

}