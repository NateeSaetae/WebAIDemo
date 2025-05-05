import React, { useState } from 'react';
import * as math from 'mathjs';
import { Button, Stack, TextField } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function OlsRegressionApp() {
  const [dataset, setDataset] = useState([]);
  const [x1, setX1] = useState('');
  const [x2, setX2] = useState('');
  const [y, setY] = useState('');
  const [weights, setWeights] = useState(null);
  const [mse, setMse] = useState(null);
  const font  = { fontFamily: 'Prompt',fontWeight: 400};

  const handleAdd = () => {
    const dx1 = parseFloat(x1);
    const dx2 = parseFloat(x2);
    const dy = parseFloat(y);
    if (!isNaN(dx1) && !isNaN(dx2) && !isNaN(dy)) {
      setDataset(prev => [...prev, { x1: dx1, x2: dx2, y: dy }]);
      setX1(''); setX2(''); setY('');
    } else {
      alert('กรอกข้อมูลให้ถูกต้องทั้งหมด');
    }
  };

  const headCellStyle = {
        backgroundColor: '#e3f2fd',
        color: '#0d47a1',
        fontWeight: 'bold',
        fontFamily: 'Prompt'
  };

  const handleTrainOLS = () => {
    if (dataset.length < 2) {
      alert('ต้องมีข้อมูลอย่างน้อย 2 ชุด');
      return;
    }

    const X = dataset.map(d => [1, d.x1, d.x2]); // 1 สำหรับ bias term
    const Y = dataset.map(d => [d.y]);

    const XT = math.transpose(X);
    const XTX = math.multiply(XT, X);
    const XTX_inv = math.inv(XTX);
    const XTY = math.multiply(XT, Y);
    const W = math.multiply(XTX_inv, XTY); // [b, w1, w2]

    setWeights(W.map(w => w[0]));

    // คำนวณค่า MSE (Mean Squared Error)
    const predictions = X.map(row => math.dot(row, W.map(w => w[0])));
    const errors = predictions.map((pred, i) => pred - Y[i][0]);
    const mseVal = errors.reduce((sum, e) => sum + e ** 2, 0) / errors.length;
    setMse(mseVal.toFixed(4));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Prompt', fontWeight: 400 }}>
      <h1>📊 OLS Linear Regression Trainer</h1>

      <h3 style={{ fontSize: '2rem'}}>➕ เพิ่มข้อมูล (x1, x2, y)</h3>
      <Stack spacing={2} direction="row">
        <TextField id="outlined-basic" label="x1" variant="outlined" type="number" step="any" value={x1} onChange={e => setX1(e.target.value)}/>
        <TextField id="outlined-basic" label="x2" variant="outlined" type="number" step="any" value={x2} onChange={e => setX2(e.target.value)}/>
        <TextField id="outlined-basic" label="y" variant="outlined" type="number" value={y} onChange={e => setY(e.target.value)} sx={{ maxWidth: '150px'}}/>
        <Button onClick={handleAdd} variant='contained' sx={font}>Add Data</Button>
        {/*<Button onClick={handleDataTest} variant='contained' sx={font}>🚀 ตัวอย่างข้อมูลจำลอง</Button>*/}
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

      <button onClick={handleTrainOLS} disabled={dataset.length <= 1}>🚀 ฝึกโมเดล OLS</button>

      {weights && (
        <>
          <h3>✅ ผลลัพธ์:</h3>
          <p><strong>Bias (b):</strong> {weights[0].toFixed(4)}</p>
          <p><strong>Weight w1:</strong> {weights[1].toFixed(4)}</p>
          <p><strong>Weight w2:</strong> {weights[2].toFixed(4)}</p>
          <p><strong>MSE:</strong> {mse}</p>
        </>
      )}
    </div>
  );
}
