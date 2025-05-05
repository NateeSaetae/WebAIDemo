import React, { useState } from 'react';
import AnnErrorChart from '../Chart/AnnErrorChart'
import { Button, Stack, TextField } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const sigmoid = x => 1 / (1 + Math.exp(-x));
const sigmoidDerivative = x => x * (1 - x);

// Train ANN with 2-input, 1-hidden-layer, 1-output
function trainANN(data, learningRate = 0.5, epochs = 500) {
  let w1 = [Math.random(), Math.random()]; // weights input -> hidden
  let w2 = [Math.random(), Math.random()]; // weights hidden -> output
  let b1 = Math.random();
  let b2 = Math.random();

  const errors = [];

  for (let epoch = 0; epoch < epochs; epoch++) {
    let totalError = 0;
    for (const sample of data) {
      const { x1, x2, y } = sample;
      // Forward pass
      const h_in = x1 * w1[0] + x2 * w1[1] + b1;
      const h_out = sigmoid(h_in);

      const o_in = h_out * w2[0] + b2;
      const o_out = sigmoid(o_in);

      // Error
      const error = y - o_out;
      totalError += error ** 2;

      // Backpropagation
      const d_o = error * sigmoidDerivative(o_out);
      const d_h = d_o * w2[0] * sigmoidDerivative(h_out);

      // Update weights and biases
      w2[0] += learningRate * d_o * h_out;
      b2 += learningRate * d_o;

      w1[0] += learningRate * d_h * x1;
      w1[1] += learningRate * d_h * x2;
      b1 += learningRate * d_h;
    }
    errors.push(totalError.toFixed(4));
  }
  return { weights: { w1, w2, b1, b2 }, errors };
}

export default function AnnTrainerApp() {
  const [dataset, setDataset] = useState([]);
  const [x1, setX1] = useState('');
  const [x2, setX2] = useState('');
  const [y, setY] = useState('');
  const [errorLog, setErrorLog] = useState([]);
  const [trained, setTrained] = useState(false);
  const font  = { fontFamily: 'Prompt',fontWeight: 400};
  const dataTest = [
        { x1: 0, x2: 1, y: 1 },
        { x1: 1, x2: 0, y: 1 },
        { x1: 1, x2: 1, y: 0 },
        { x1: 0, x2: 0, y: 0 }
    ]

  const handleAdd = () => {
    const dx1 = parseFloat(x1);
    const dx2 = parseFloat(x2);
    const dy = parseInt(y);
    if (!isNaN(dx1) && !isNaN(dx2) && (dy === 0 || dy === 1)) {
      setDataset(prev => [...prev, { x1: dx1, x2: dx2, y: dy }]);
      setX1(''); 
      setX2(''); 
      setY('');
    } else {
      alert('กรอกให้ครบ และ y ต้องเป็น 0 หรือ 1');
    }
  };
  const headCellStyle = {
        backgroundColor: '#e3f2fd',
        color: '#0d47a1',
        fontWeight: 'bold',
        fontFamily: 'Prompt'
  };

  const handleTrain = () => {
    const result = trainANN(dataset);
    setErrorLog(result.errors);
    setTrained(true);
  };

  const handleTest = () => {
    setDataset(dataTest)
  }

  const cl = () => {
    setDataset([]);
    setX1(''); 
    setX2(''); 
    setY('');
    setErrorLog([]);
    setTrained(false);
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Prompt', fontWeight: 400 }}>
      <h1>🧠 Simple ANN Trainer</h1>

      <h3 style={{ fontSize: '2rem'}}>➕ เพิ่มข้อมูล (x1, x2, y)</h3>
      <Stack spacing={2} direction="row">
        <TextField id="outlined-basic" label="x1" variant="outlined" type="number" step="any" value={x1} onChange={e => setX1(e.target.value)}/>
        <TextField id="outlined-basic" label="x2" variant="outlined" type="number" step="any" value={x2} onChange={e => setX2(e.target.value)}/>
        <TextField id="outlined-basic" label="y (0 or 1)" variant="outlined" type="number" inputProps={{ min: 0, max: 1 }} value={y} onChange={e => setY(e.target.value)} sx={{ minWidth: '150px'}}/>
        <Button onClick={handleAdd} variant='contained' sx={font}>Add Data</Button>
        <Button onClick={handleTest} variant='contained' sx={font}>🚀 ตัวอย่างข้อมูลจำลอง</Button>
      </Stack>

      <h4 style={{ fontSize: '2rem'}}>📋 Dataset</h4>
      <TableContainer component={Paper} style={{ width: '100%', maxWidth: '400px', marginBottom: '50px'}}>
                  <Table>
                    <TableHead>
                      {dataset.length !== 0 ? 
                      <TableRow>
                        <TableCell sx={headCellStyle} >x1</TableCell>
                        <TableCell sx={headCellStyle} >x2</TableCell>
                        <TableCell sx={headCellStyle} >y</TableCell>
                      </TableRow> 
                      : ''}
                    </TableHead>
                    <TableBody>
                      {dataset.map((d, i) => (
                        <TableRow key={i}>
                          <TableCell>{d.x1}</TableCell>
                          <TableCell>{d.x2}</TableCell>
                          <TableCell>{d.y}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
      </TableContainer>
      <Stack spacing={2} direction="row">
        <Button onClick={handleTrain} disabled={dataset.length === 0} variant='contained' sx={font}>🚀 ฝึกโมเดล</Button>
        <Button onClick={cl} variant='contained' sx={font}>ล้าง</Button>
      </Stack>

      {trained && (
        <>
          <h3>📉 Error per Epoch</h3>
          <AnnErrorChart errors={errorLog} />
        </>
      )}
    </div>
  );
}
