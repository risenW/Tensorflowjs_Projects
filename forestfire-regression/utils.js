/**
 * Normalize data set using min-max scaling
 */
export function normalizeData(tensor){
    const data_max = tensor.max();
    const data_min = tensor.min();
    
    const normalized_tensor = tensor.sub(data_min).div(data_max.sub(data_min));
    return normalized_tensor;
}