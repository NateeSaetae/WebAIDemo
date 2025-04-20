export function trainPerceptron(dataset, learningRate = 0.1, epochs = 10) {
  let weights = [0, 0];
  let bias = 0;

  const activation = (z) => (z >= 0 ? 1 : 0);

  const weightsPerEpoch = []; // เก็บค่าถ่วงน้ำหนักแต่ละรอบ
  const errorsPerEpoch = [];  // เก็บค่า error รวมแต่ละ epoch

  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalError = 0;

    for (let { x1, x2, y } of dataset) {
      const z = weights[0] * x1 + weights[1] * x2 + bias;
      const pred = activation(z);
      const error = y - pred;

      weights[0] += learningRate * error * x1;
      weights[1] += learningRate * error * x2;
      bias += learningRate * error;

      totalError += Math.abs(error);
    }

    // clone ค่า weights เก็บไว้ใน array
    weightsPerEpoch.push([...weights]);
    errorsPerEpoch.push(totalError);
  }

  return {
    weights,
    bias,
    predict: (x1, x2) => activation(weights[0] * x1 + weights[1] * x2 + bias),
    weightsPerEpoch,
    errorsPerEpoch
  };
}
