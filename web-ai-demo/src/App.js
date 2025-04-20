import React, { useEffect , useState } from "react";
import { trainPerceptron } from "./AI_Models/trainPerceptron";
import ResultChart from "./Chart/ResultChart"

function App() {
  const [errorPerEpoch, setErrorPerEpoch] = useState([]);
  useEffect(() => {
    const data = [
      { x1: 0, x2: 0, y: 0 },
      { x1: 0, x2: 1, y: 0 },
      { x1: 1, x2: 0, y: 0 },
      { x1: 1, x2: 1, y: 1 },
    ];

    const model = trainPerceptron(data);
    console.log("Weights:", model.weights);
    console.log("Bias:", model.bias);
    console.log("Predict (1, 1):", model.predict(1, 1));
    const errors = model.errorsPerEpoch.map((item) => (item)); //[3, 2.5, 1.8, 1.2, 0.7, 0.2, 0.1]
    setErrorPerEpoch(errors);
  }, []);

   /*useEffect(() => {
    // จำลอง error ในแต่ละ epoch จาก Perceptron
    const errors = model.map((item) => (item.weights)); //[3, 2.5, 1.8, 1.2, 0.7, 0.2, 0.1]
    setErrorPerEpoch(errors);
  }, []);*/

  return (
    <div className="App">
      <h1>🧠 Perceptron AI Demo</h1>
      <p>เปิด Console เพื่อดูผลลัพธ์</p>
      <ResultChart dataPoints={errorPerEpoch} />
    </div>
  );
}

export default App;
