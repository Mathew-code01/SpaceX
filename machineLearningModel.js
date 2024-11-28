import * as tf from '@tensorflow/tfjs';

export class MachineLearningModel {
  static async predict(image) {
    const model = await tf.loadLayersModel('model.json');
    const tensor = tf.node.decodeImage(image.buffer, 3);
    const resized = tf.image.resizeBilinear(tensor, [224, 224]);
    const normalized = resized.toFloat().div(255);
    const predictions = await model.predict(normalized.expandDims(0));
    const labels = predictions.argMax(-1).dataSync();

    return labels;
  }
}

