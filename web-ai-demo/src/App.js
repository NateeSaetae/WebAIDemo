// src/App.js หรือหน้าอื่นๆ
import React, { useEffect } from "react";
import { trainPerceptron } from "./AI_Models/trainPerceptron";

function App() {
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
  }, []);

  return (
    <div className="App">
      <h1>🧠 Perceptron AI Demo</h1>
      <p>เปิด Console เพื่อดูผลลัพธ์</p>
    </div>
  );
}

export default App;
