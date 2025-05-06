import React, { useState } from 'react';
import * as math from 'mathjs';
import { Button, Stack, TextField, Container, Box, Divider } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import OlsResultChart from '../Chart/OlsResultChart'

export default function OlsRegressionApp() {
  const [dataset, setDataset] = useState([]);
  const [x1, setX1] = useState('');
  const [y, setY] = useState('');
  const [weights, setWeights] = useState(null);
  const [mse, setMse] = useState(null);
  const [openEx, setOpenEx] = useState(false);
  const font = { fontFamily: 'Prompt', fontWeight: 400 };
  const dataTest = [
    { x1: 1, y: 3.5 },
    { x1: 2, y: 5.0 },
    { x1: 3, y: 6.8 },
    { x1: 4, y: 9.2 },
    { x1: 5, y: 11.1 },
    { x1: 6, y: 13.0 },
];

  const handleAdd = () => {
    const dx1 = parseFloat(x1);
    const dy = parseFloat(y);
    if (!isNaN(dx1) && !isNaN(dy)) {
      setDataset(prev => [...prev, { x1: dx1, y: dy }]);
      setX1(''); setY('');
    } else {
      alert('กรอกข้อมูลให้ถูกต้องทั้งหมด');
    }
  };

  const handleTrainOLS = () => {
    if (dataset.length < 2) {
      alert('ต้องมีข้อมูลอย่างน้อย 2 ชุด');
      return;
    }

    const X = dataset.map(d => [1, d.x1]);
    const Y = dataset.map(d => [d.y]);

    try {
      const XT = math.transpose(X);
      const XTX = math.multiply(XT, X);
      const XTX_inv = math.inv(XTX);
      const XTY = math.multiply(XT, Y);
      const W = math.multiply(XTX_inv, XTY);

      setWeights(W.map(w => w[0]));

      const predictions = X.map(row => math.dot(row, W.map(w => w[0])));
      const errors = predictions.map((pred, i) => pred - Y[i][0]);
      const mseVal = errors.reduce((sum, e) => sum + e ** 2, 0) / errors.length;
      setMse(mseVal.toFixed(4));
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการคำนวณ OLS');
      setWeights(null);
      setMse(null);
    }
  };

  const cl = () => {
    setDataset([]);
    setX1('');
    setY('');
    setWeights(null);
    setMse(null);
  };

  const handleTest = () => {
    setDataset(dataTest)
  }

  const exModel = () => {
    if(openEx === false){
      setOpenEx(true)
    } else {
      setOpenEx(false)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, fontFamily: 'Prompt', fontWeight: 400 }}>
      <Box sx={{ fontFamily: 'Prompt', mt: 4, mb: 6 }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '3rem', color: '#000' }}>
          ทฤษฎีของ Ordinary Least Squares (OLS)
        </h2>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          OLS เป็นวิธีการพื้นฐานในการสร้างโมเดลเชิงเส้น (Linear Regression) โดยใช้หลักการลดผลรวมของค่าความคลาดเคลื่อนยกกำลังสอง (Sum of Squared Errors)
          ระหว่างค่าที่พยากรณ์กับค่าจริง เพื่อหาเส้นตรงที่เหมาะสมที่สุดสำหรับจำลองข้อมูล
        </p>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          <strong>สมการเชิงเส้นพื้นฐาน:</strong><br />
          <code>y = w₁x₁ + b</code><br />
          โดยที่ w₁ คือค่าน้ำหนัก (slope) และ b คือค่า bias (intercept)
        </p>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          เป้าหมายคือการหาค่าน้ำหนักที่ทำให้ <code>∑(ŷ - y)²</code> มีค่าน้อยที่สุด (ŷ คือค่าที่โมเดลทำนาย)
          ซึ่งสามารถคำนวณได้จากสูตรเมทริกซ์:
        </p>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          <code>w = (XᵀX)<sup>-1</sup>Xᵀy</code>
        </p>

        <Divider sx={{ my: 4, borderColor: 'grey.400', borderBottomWidth: 3 }} />
      </Box>

      <div style={{ padding: '2rem', fontFamily: 'Prompt', fontWeight: 400 }}>
        <h1>📊 OLS Linear Regression Trainer</h1>
        <Button variant='contained' onClick={exModel} sx={{ fontSize: '1.2rem' , fontFamily: 'Prompt'}}>Show Explanation</Button>

        {openEx === true ? <div style={{ padding: '.1rem', fontFamily: 'Prompt',background:'#F6F3F3' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2rem', color: '#1976d2' }}>
            📐 คำอธิบายการใช้งาน OLS Linear Regression Trainer
          </h2>

          <p style={{ marginTop: '1rem', fontSize: '1.4rem' }}>
            โปรแกรมนี้จำลองการทำงานของ <strong>การถดถอยเชิงเส้น (Linear Regression)</strong> โดยใช้เทคนิค
            <strong> OLS (Ordinary Least Squares)</strong> เพื่อหาสมการเส้นตรงที่เหมาะสมที่สุดสำหรับใช้พยากรณ์ค่าของ <code>y</code> จากตัวแปรต้น <code>x₁</code>
          </p>

          <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>📌 ขั้นตอนการใช้งาน:</h3>
          <ol style={{ paddingLeft: '1.5rem', fontSize: '1.5rem' }}>
            <li>
              <strong style={{ color: '#1976d2' }}>เพิ่มข้อมูล:</strong> กรอกค่า <code>x₁</code> และ <code>y</code> แล้วกดปุ่ม <em>“Add Data”</em> เพื่อเพิ่มเข้าสู่ dataset
            </li>
            <li>
              <strong style={{ color: '#1976d2' }}>ฝึกโมเดล:</strong> เมื่อมีข้อมูลอย่างน้อย 2 ชุด กดปุ่ม <em>“🚀 Train Model”</em> เพื่อให้ระบบคำนวณค่าพารามิเตอร์ของสมการ
            </li>
            <li>
              <strong style={{ color: '#1976d2' }}>ดูผลลัพธ์:</strong> ระบบจะแสดงค่า <strong>Bias (b)</strong>, <strong>Weight (w₁)</strong> และ <strong>Mean Squared Error (MSE)</strong>
            </li>
            <li>
              <strong style={{ color: '#1976d2' }}>ล้างข้อมูล:</strong> กดปุ่ม <em>“Reset”</em> เพื่อล้าง dataset และเริ่มต้นใหม่
            </li>
          </ol>

          <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
            หมายเหตุ: โปรแกรมนี้เหมาะกับข้อมูลที่มีความสัมพันธ์เชิงเส้น และ x₁ ควรมีค่าหลากหลายเพื่อให้ผลลัพธ์แม่นยำยิ่งขึ้น
          </p>
        </div> : ''}

        <h3 style={{ fontSize: '2rem' }}>➕ เพิ่มข้อมูล (x1, y)</h3>
        <Stack spacing={2} direction="row">
          <TextField label="x1" variant="outlined" type="number" step="any" value={x1} onChange={e => setX1(e.target.value)} />
          <TextField label="y" variant="outlined" type="number" value={y} onChange={e => setY(e.target.value)} sx={{ maxWidth: '150px' }} />
          <Button onClick={handleAdd} variant='contained' sx={font}>Add Data</Button>
          <Button onClick={handleTest} variant='contained' sx={font}>Load Sample Data</Button>
        </Stack>

        <h4 style={{ fontSize: '2rem' }}>📋 Dataset</h4>
        <TableContainer component={Paper} style={{ width: '100%', maxWidth: '400px', marginBottom: '50px' }}>
          <Table>
            <TableHead>
              {dataset.length !== 0 && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Prompt' }}>x1</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Prompt' }}>y</TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {dataset.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{d.x1}</TableCell>
                  <TableCell>{d.y}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={2} direction="row">
          <Button onClick={handleTrainOLS} disabled={dataset.length <= 1} variant='contained' sx={font}>🚀 Train Model</Button>
          <Button onClick={cl} variant='contained' color="error" sx={font}>Reset</Button>
        </Stack>

        {weights && (
          <Box mt={4}>
            <h3>✅ ผลลัพธ์:</h3>
            <p><strong>Bias (b):</strong> {weights[0].toFixed(4)}</p>
            <p><strong>Weight w1:</strong> {weights[1].toFixed(4)}</p>
            <p><strong>MSE:</strong> {mse}</p>
            <OlsResultChart data={dataset} />
          </Box>
        )}
      </div>
    </Container>
  );
}
