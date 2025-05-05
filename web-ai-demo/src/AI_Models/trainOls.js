import React, { useState } from 'react';
import * as math from 'mathjs';
import { Button, Stack, TextField, Container, Box, Divider} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function OlsRegressionApp() {
  const [dataset, setDataset] = useState([]);
  const [x1, setX1] = useState('');
  const [x2, setX2] = useState('');
  const [y, setY] = useState('');
  const [weights, setWeights] = useState(null);
  const [mse, setMse] = useState(null);
  const [openEx, setOpenEx] = useState(false);
  const font = { fontFamily: 'Prompt', fontWeight: 400, fontSize: '1rem'};
  const dataTest = [
    { x1: 1, x2: 2, y: 5 },
    { x1: 2, x2: 4, y: 9 },
    { x1: 3, x2: 1, y: 7 },
    { x1: 4, x2: 3, y: 10 },
    { x1: 5, x2: 0, y: 8 },
  ];

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
        fontFamily: 'Prompt',
        fontSize: '1.5rem',
  };

  const tableStyle = {
    fontFamily: 'Prompt',
    fontSize:'1.4rem'
  }

  const cl = () => {
    setDataset([]);
    setX1('');
    setX2('');
    setY('');
    setWeights('')
  }

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
          <code>y = w₁x₁ + w₂x₂ + b</code><br />
          โดยที่ w₁, w₂ คือค่าน้ำหนัก (slope) และ b คือค่า bias (intercept)
        </p>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          เป้าหมายคือการหาค่าน้ำหนักที่ทำให้ <code>∑(ŷ - y)²</code> มีค่าน้อยที่สุด (ŷ คือค่าที่โมเดลทำนาย)
          ซึ่งสามารถคำนวณได้จากสูตรเมทริกซ์:
        </p>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          <code>w = (XᵀX)<sup>-1</sup>Xᵀy</code>
        </p>

        <TableContainer component={Paper} sx={{ maxWidth: 700, my: 2, fontFamily: 'Prompt' }}>
          <Table size='medium'>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.5rem', fontFamily: 'Prompt', color: '#0d47a1' }}>ตัวแปร</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.5rem', fontFamily: 'Prompt', color: '#0d47a1' }}>คำอธิบาย</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={tableStyle}><code>x₁, x₂</code></TableCell>
                <TableCell sx={tableStyle}>ข้อมูลอิสระ (Independent Variables)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>y</code></TableCell>
                <TableCell sx={tableStyle}>ค่าที่ต้องการพยากรณ์ (Dependent Variable)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>w</code></TableCell>
                <TableCell sx={tableStyle}>ค่าน้ำหนักที่บ่งบอกอิทธิพลของตัวแปร x แต่ละตัว</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>b</code></TableCell>
                <TableCell sx={tableStyle}>ค่าคงที่ (intercept)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <p style={{ fontSize: '1.5rem', marginTop: '1.5rem' }}>
          OLS เป็นพื้นฐานสำคัญของการวิเคราะห์เชิงสถิติและการพัฒนาโมเดลเชิงเส้นใน Machine Learning
        </p>

        <Divider
          sx={{
            my: 4,
            borderColor: 'grey.400',
            borderBottomWidth: 3,
          }}
          textAlign="left"
        />
      </Box>
      <div style={{ padding: '2rem', fontFamily: 'Prompt', fontWeight: 400 }}>
            <h1>📊 OLS Linear Regression Trainer</h1>
            <Button variant='contained' onClick={exModel} sx={{ fontSize: '1.2rem' , fontFamily: 'Prompt'}}>Show Explanation</Button>

            {openEx ? <div style={{ padding: '2rem', fontFamily: 'Prompt', background:'#F6F3F3' }}>
              <h2 style={{ fontWeight: 'bold', fontSize: '2rem', color: '#1976d2' }}>
                📐 คำอธิบายการใช้งาน OLS Linear Regression Trainer
              </h2>

              <p style={{ marginTop: '1rem', fontSize: '1.4rem' }}>
                โปรแกรมนี้จำลองการทำงานของ <strong>OLS (Ordinary Least Squares)</strong> ซึ่งเป็นเทคนิคการถดถอยเชิงเส้น 
                สำหรับการทำนายค่าตัวแปรเป้าหมาย <code>y</code> จากตัวแปรต้น เช่น <code>x₁</code> และ <code>x₂</code> 
                ด้วยสมการเชิงเส้นแบบง่าย
              </p>

              <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>📌 ขั้นตอนการใช้งาน:</h3>
              <ol style={{ paddingLeft: '1.5rem', fontSize: '1.5rem' }}>
                <li>
                  <strong style={{ color:'#1976d2' }}>เพิ่มข้อมูล:</strong> กรอกค่า <code>x₁</code>, <code>x₂</code>, และ <code>y</code> แล้วกดปุ่ม <em>“Add Data”</em> หรือใช้ปุ่ม <em>“Load Sample Data”</em>
                </li>
                <li>
                  <strong style={{ color:'#1976d2' }}>ฝึกโมเดล:</strong> กดปุ่ม <em>“Train Model”</em> เพื่อให้ระบบคำนวณน้ำหนัก (w₁, w₂) และ bias (b) ที่เหมาะสมที่สุด
                </li>
                <li>
                  <strong style={{ color:'#1976d2' }}>ดูผลลัพธ์:</strong> ระบบจะแสดงค่าที่ได้จากโมเดล และ <strong>Mean Squared Error (MSE)</strong>
                </li>
                <li>
                  <strong style={{ color:'#1976d2' }}>ล้างข้อมูล:</strong> กดปุ่ม <em>“Reset”</em> เพื่อเริ่มต้นใหม่
                </li>
              </ol>

              {/*<h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>🧮 สมการของโมเดล:</h3>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', fontSize: '1.3rem', borderRadius: '8px' }}>
                ŷ = b + w₁·x₁ + w₂·x₂
              </pre>*/}

              <p style={{ fontSize: '1.2rem' }}>
                โดยระบบจะใช้สูตร <code>W = (XᵀX)⁻¹XᵀY</code> ในการคำนวณค่าน้ำหนักและ bias ผ่านเมทริกซ์
              </p>

              <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>📈 ค่าที่แสดงผล:</h3>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '1.5rem' }}>
                <li><strong>Bias (b):</strong> ค่าคงที่ในสมการ</li>
                <li><strong>Weights (w₁, w₂):</strong> น้ำหนักของตัวแปรต้น</li>
                <li><strong>MSE:</strong> ค่าความผิดพลาดเฉลี่ย ยิ่งน้อยยิ่งดี</li>
              </ul>

              <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
                หมายเหตุ: OLS เหมาะสำหรับข้อมูลที่มีความสัมพันธ์เชิงเส้น และเข้าใจง่ายแม้สำหรับผู้เริ่มต้นในสาย Data Science
              </p>
            </div> : ''}

        <h3 style={{ fontSize: '2rem'}}>➕ เพิ่มข้อมูล (x1, x2, y)</h3>
        <Stack spacing={2} direction="row">
          <TextField id="outlined-basic" label="x1" variant="outlined" type="number" step="any" value={x1} onChange={e => setX1(e.target.value)}/>
          <TextField id="outlined-basic" label="x2" variant="outlined" type="number" step="any" value={x2} onChange={e => setX2(e.target.value)}/>
          <TextField id="outlined-basic" label="y" variant="outlined" type="number" value={y} onChange={e => setY(e.target.value)} sx={{ maxWidth: '150px'}}/>
          <Button onClick={handleAdd} variant='contained' sx={font}>Add Data</Button>
          <Button onClick={handleTest} variant='contained' sx={font}>Load Sample Data</Button>
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

        <Stack spacing={2} direction="row">
          <Button onClick={handleTrainOLS} disabled={dataset.length <= 2} variant='contained' sx={font}>🚀 Train Model</Button>
          <Button onClick={cl} variant='contained' sx={font} color="error">Reset</Button>
        </Stack>

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
    </Container>
  );
}
