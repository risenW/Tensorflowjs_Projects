const PAPA = require('papaparse');
const BASE_PATH = "forestfire/dataset/";

const TRAIN_DATA = "forestfire_train.csv";
const TEST_DATA = "forestfire_test.csv";
const TRAIN_TARGET = "forestfire_train_target.csv";
const TEST_TARGET = "forestfire_test_target.csv";


/**
 * Reads the dataset from the specified path
 */
export const read_csv = async(csv_file)=>{
    return new Promise(resolve=>{
        const file_path = `${BASE_PATH}${file_path}`;
        console.log(`Loading from ${file_path}`);

        PAPA.parse(file_path, {
            header: true,
            dynamicTyping: true,
            complete: (results)=>{
                resolve(results)
            }
        })
    })
}