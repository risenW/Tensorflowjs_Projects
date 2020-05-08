import { CreateNeuralNetwork, train } from '.'
const status_bar = document.getElementById("status_bar");
const training_bar = document.getElementById("training_bar");



export function updateStatus(msg) {
    status_bar.innerHTML = msg
}

export function updateFinalResult(curr_epoch, EPOCHs) {
    let msg = `EPOCH: ${curr_epoch + 1} of ${EPOCHs} completed...`
    training_bar.innerHTML = msg
}


export function updateTrainingStatus(train_loss, val_loss, test_loss) {
    let msg = `<p>Final Training Loss: ${train_loss.toFixed(4)}</p>
                <p>Final Validation Loss: ${val_loss.toFixed(4)}</p><hr>
                <p>Final Test Loss: ${test_loss? test_loss.toFixed(4): '...'}</p>` //check if loss is undefined
    training_bar.innerHTML = msg
}


export async function setUp() {
    const trainModel = document.getElementById('trainModel')

    trainModel.addEventListener('click', async () => {
        const model = CreateNeuralNetwork();
        await train(model);
    }, false)

}
