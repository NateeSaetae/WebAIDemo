import React, { useState } from 'react';
import ResultChart from '../Chart/ResultChart'
import WeightsChart from '../Chart/WeightsChart'
import { trainPerceptron } from './trainPerceptron'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export default function DisplayPerceptron() {
    const [dataset, setDataset] = useState([]);
      const [x1, setX1] = useState('');
      const [x2, setX2] = useState('');
      const [y, setY] = useState('');
      const [errors, setErrors] = useState([]);
      const [weights, setWeights] = useState([]);
      const [trained, setTrained] = useState(false);
      const [blockInput, setBlockInput] = useState(false);
      
      const datasetTest = [
        {x1: 1, x2: 1.5, y: 0},
        {x1: 2, x2: 3.0, y: 1},
        {x1: 0, x2: 2.2, y: 0},
        {x1: 3, x2: 4.5, y: 1},
        {x1: 1, x2: 0.5, y: 0}
      ]
    
      const handleAddData = () => {
        const parsedX1 = parseFloat(x1);
        const parsedX2 = parseFloat(x2);
        const parsedY = parseInt(y);
    
        if (!isNaN(parsedX1) && !isNaN(parsedX2) && (parsedY === 0 || parsedY === 1)) {
          const newPoint = { x1: parsedX1, x2: parsedX2, y: parsedY };
          setDataset([...dataset, newPoint]);
          setX1('');
          setX2('');
          setY('');
          setTrained(false);
        } else {
          alert("กรุณากรอก x1, x2 เป็นตัวเลข และ y เป็น 0 หรือ 1 เท่านั้น");
        }
      };
    
      const handleTrain = () => {
        const result = trainPerceptron(dataset, 0.1, 50);
        setErrors(result.errorsPerEpoch);
        setWeights(result.weightsPerEpoch);
        setTrained(true);
      };
    
      const handleTrainTest = () => {
        setDataset(datasetTest)
        setBlockInput(true)
        //handleTrain()
      }
    
      const cl = () => {
        setDataset([]);
        setErrors([]);
        setWeights([]);
        setBlockInput(false);
        setTrained(false);
        setX1('');
        setX2('');
        setY('');
      }
    
      return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
          <h1>🧠 Perceptron Interactive Trainer</h1>
    
          <h3>➕ เพิ่มข้อมูล (x1, x2, y)</h3>
          <Stack spacing={2} direction="row">
            <TextField id="outlined-basic" label="x1" variant="outlined" type="number" step="any" value={x1} onChange={e => setX1(e.target.value)}/>
            <TextField id="outlined-basic" label="x2" variant="outlined" type="number" step="any" value={x2} onChange={e => setX2(e.target.value)}/>
            <TextField id="outlined-basic" label="y (0 or 1)" variant="outlined" type="number" inputProps={{ min: 0, max: 1 }} value={y} onChange={e => setY(e.target.value)}/>
            <Button onClick={handleAddData} disabled={blockInput === true} variant='contained'>Add Data</Button>
            <Button onClick={handleTrainTest} variant='contained'>🚀 ตัวอย่างข้อมูลจำลอง</Button>
          </Stack>
    
          <h4>📋 Dataset</h4>
          <ul>
            {dataset.map((d, i) => (
              <li key={i}>x1: {d.x1}, x2: {d.x2}, y: {d.y}</li>
            ))}
          </ul>

          <Stack spacing={2} direction="row">
            <Button onClick={handleTrain} disabled={dataset.length === 0} variant='contained'>🚀 ฝึกโมเดล</Button>
            <Button onClick={cl} variant='contained'>ล้าง</Button>
          </Stack>
    
          {trained && (
            <>
              <h3>📈 Error per Epoch</h3>
              <ResultChart dataPoints={errors} />
    
              <h3>📊 Weights over Epochs</h3>
              <WeightsChart weightsPerEpoch={weights} />
            </>
          )}
        </div>
      );
}