import React, { useEffect, useState } from "react";
import { trainPerceptron } from "./AI_Models/trainPerceptron";
import ResultChart from "./Chart/ResultChart";
import {TextField , Button , Box} from '@mui/material';

function App() {
  const [errorPerEpoch, setErrorPerEpoch] = useState([]);
  const [model, setModel] = useState(null);
  const [inputX1, setInputX1] = useState("");
  const [inputX2, setInputX2] = useState("");
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const data = [
      { x1: 0, x2: 0, y: 0 },
      { x1: 0, x2: 1, y: 0 },
      { x1: 1, x2: 0, y: 0 },
      { x1: 1, x2: 1, y: 1 },
    ];

    const trainedModel = trainPerceptron(data, 0.1, 20);
    setErrorPerEpoch(trainedModel.errorsPerEpoch);
    setModel(trainedModel);
  }, []);

  const handlePredict = () => {
    if (model && inputX1 !== "" && inputX2 !== "") {
      const result = model.predict(parseInt(inputX1), parseInt(inputX2));
      setPrediction(result);
    }
  };

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Perceptron AI Demo</h1>
      <p>โมเดล: ฝึกจากฟังก์ชัน AND</p>

      <h2 style={{ marginTop: "2rem" }}>กรอกค่า Input</h2>
      <div style={{ marginBottom: "1rem" }}>
        <Box style={{ marginTop: "2rem"}}>
        <TextField
          id="x1"
          label="x1"
          type="number"
          variant="filled"
          value={inputX1}
          onChange={(e) => setInputX1(e.target.value)}
          style={{ marginRight: "1rem" }}
        />

      <TextField
        id="x2"
        label="x2"
        type="number"
        variant="filled"
        value={inputX2}
        onChange={(e) => setInputX2(e.target.value)}
      />
        <Button variant="contained" onClick={handlePredict} style={{ marginLeft: "1rem"}}>ทำนายผล</Button>
      </Box>
      </div>
      {prediction !== null && (
        <div>
          <strong>ผลลัพธ์:</strong> y = {prediction}
        </div>
      )}
      <h2 style={{ marginTop: "2rem" }}>📉 แสดงกราฟ Error ต่อ Epoch</h2>
      <ResultChart dataPoints={errorPerEpoch} />
    </div>
  );
}

export default App;

/*
import React, { useState } from "react";
import { trainPerceptron } from "./AI_Models/trainPerceptron";
import ResultChart from "./Chart/ResultChart";

function App() {
  const [dataset, setDataset] = useState([]);
  const [x1, setX1] = useState("");
  const [x2, setX2] = useState("");
  const [y, setY] = useState("");
  const [errorPerEpoch, setErrorPerEpoch] = useState([]);
  const [trained, setTrained] = useState(false);

  const handleAddData = () => {
    if (x1 !== "" && x2 !== "" && y !== "") {
      const newEntry = {
        x1: parseInt(x1),
        x2: parseInt(x2),
        y: parseInt(y),
      };
      setDataset([...dataset, newEntry]);
      setX1("");
      setX2("");
      setY("");
      setTrained(false);
    }
  };

  const handleTrain = () => {
    if (dataset.length > 0) {
      const model = trainPerceptron(dataset, 0.1, 20);
      setErrorPerEpoch(model.errorsPerEpoch);
      setTrained(true);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🧠 Perceptron - สร้าง Dataset เอง</h1>

      <h3>➕ เพิ่มข้อมูลฝึก</h3>
      <input
        type="number"
        placeholder="x1"
        value={x1}
        onChange={(e) => setX1(e.target.value)}
      />
      <input
        type="number"
        placeholder="x2"
        value={x2}
        onChange={(e) => setX2(e.target.value)}
      />
      <input
        type="number"
        placeholder="y"
        value={y}
        onChange={(e) => setY(e.target.value)}
      />
      <button onClick={handleAddData}>เพิ่มข้อมูล</button>

      <h4 style={{ marginTop: "1rem" }}>📋 Dataset ที่ใส่:</h4>
      <ul>
        {dataset.map((item, index) => (
          <li key={index}>
            x1: {item.x1}, x2: {item.x2}, y: {item.y}
          </li>
        ))}
      </ul>

      <button onClick={handleTrain} disabled={dataset.length === 0}>
        🚀 ฝึกโมเดลจาก Dataset นี้
      </button>

      {trained && (
        <>
          <h3 style={{ marginTop: "2rem" }}>📈 Error Chart</h3>
          <ResultChart dataPoints={errorPerEpoch} />
        </>
      )}
    </div>
  );
}

export default App;

*/
