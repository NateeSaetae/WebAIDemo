import React, { useState } from 'react';
import AnnErrorChart from '../Chart/AnnErrorChart'
import { Button, Stack, TextField, Container, Box, Divider} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const sigmoid = x => 1 / (1 + Math.exp(-x));
const sigmoidDerivative = x => x * (1 - x);

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
  const [openEx, setOpenEx] = useState(false);
  const font = { fontFamily: 'Prompt', fontWeight: 400, fontSize: '1rem'};
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
        fontFamily: 'Prompt',
        fontSize: '1.5rem',
  };

  const tableStyle = {
    fontFamily: 'Prompt',
    fontSize:'1.4rem'
  }

  const exModel = () => {
    if(openEx === false){
      setOpenEx(true)
    } else {
      setOpenEx(false)
    }
  }

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
    <Container maxWidth="xl" sx={{ py: 4, fontFamily: 'Prompt', fontWeight: 400 }}>

      <Box sx={{ fontFamily: 'Prompt', mt: 4, mb: 6 }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '3rem', color: '#000' }}>
          ทฤษฎีของ Artificial Neural Network (ANN)
        </h2>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          Artificial Neural Network (ANN) เป็นโมเดลที่จำลองการทำงานของเซลล์ประสาทในสมองมนุษย์
          โดยใช้โครงข่ายของหน่วยประมวลผล (Neuron) หลายๆ ตัวที่เชื่อมโยงกันเป็นชั้นๆ เพื่อเรียนรู้ความสัมพันธ์ของข้อมูล
        </p>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          ANN นิยมใช้ในการแก้ปัญหาที่มีความซับซ้อน เช่น การจำแนกรูปภาพ การรู้จำเสียง การทำนายแนวโน้ม ฯลฯ
          โดยใช้กระบวนการเรียนรู้แบบปรับน้ำหนักของแต่ละเส้นเชื่อมในเครือข่ายให้เหมาะสม
        </p>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          <strong>สมการของ Neuron:</strong>
          <br />
          <code>y = f(w₁x₁ + w₂x₂ + ... + wₙxₙ + b)</code>
          <br />
          โดย <code>f</code> คือฟังก์ชันแอคติเวชัน เช่น Sigmoid, ReLU เป็นต้น
        </p>

        <TableContainer component={Paper} sx={{ maxWidth: 700, my: 2, fontFamily: 'Prompt' }}>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.5rem', fontFamily: 'Prompt', color: '#0d47a1' }}>
                  ตัวแปร
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.5rem', fontFamily: 'Prompt', color: '#0d47a1' }}>
                  คำอธิบาย
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={tableStyle}><code>x₁, x₂, ..., xₙ</code></TableCell>
                <TableCell sx={tableStyle}>ข้อมูลนำเข้า (features)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>w₁, w₂, ..., wₙ</code></TableCell>
                <TableCell sx={tableStyle}>ค่าน้ำหนักของแต่ละ input</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>b</code></TableCell>
                <TableCell sx={tableStyle}>ค่าคงที่ (bias)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>f</code></TableCell>
                <TableCell sx={tableStyle}>ฟังก์ชัน activation (เช่น Sigmoid, ReLU)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>y</code></TableCell>
                <TableCell sx={tableStyle}>ผลลัพธ์ที่ได้จาก neuron</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <p style={{ fontSize: '1.5rem', marginTop: '1.5rem' }}>
          ANN ต้องผ่านการฝึกโดยใช้กระบวนการ Backpropagation และ Gradient Descent เพื่อปรับน้ำหนักและ bias
          ให้โมเดลสามารถทำนายข้อมูลได้แม่นยำยิ่งขึ้น
        </p>

        <Divider sx={{ my: 4, borderColor: 'grey.400', borderBottomWidth: 3 }} />
      </Box>


      <div style={{ padding: '2rem', fontFamily: 'Prompt', fontWeight: 400 }}>
        <h1 style={{ fontSize: '3rem', marginTop: '0.5rem' }}>Simple ANN Trainer</h1>
        <Button variant='contained' onClick={exModel} sx={{ fontSize: '1.2rem' , fontFamily: 'Prompt'}}>Show Explanation</Button>
        {openEx === true ? <div style={{ padding: '2rem', fontFamily: 'Prompt', background:'#F6F3F3' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2rem', color: '#1976d2' }}>
            🧠 คำอธิบายการใช้งาน Artificial Neural Network (ANN) Interactive Trainer
          </h2>

          <p style={{ marginTop: '1rem', fontSize: '1.4rem' }}>
            โปรแกรมนี้จำลองการทำงานของ <strong>โครงข่ายประสาทเทียม (ANN)</strong> อย่างง่าย 
            โดยมีโครงสร้างแบบ 1 ชั้นซ่อน (Single Hidden Layer) เพื่อช่วยให้ผู้เรียนเข้าใจหลักการของการฝึกโมเดลผ่านการปรับค่า weights และ bias โดยใช้การถ่ายทอดย้อนกลับ (Backpropagation)
          </p>

          <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>📌 ขั้นตอนการใช้งาน:</h3>
          <ol style={{ paddingLeft: '1.5rem', fontSize: '1.5rem' }}>
            <li>
              <strong style={{ color: '#1976d2' }}>เพิ่มข้อมูล:</strong> กรอกค่า <code>x₁</code>, <code>x₂</code> และ <code>y</code> (0 หรือ 1) แล้วกดปุ่ม <em>“Add Data”</em> หรือใช้ปุ่ม <em>“Load Sample Data”</em>
            </li>
            <li>
              <strong style={{ color: '#1976d2' }}>ฝึกโมเดล:</strong> กด <em>“Train Model”</em> เพื่อให้ระบบเริ่มการเรียนรู้ผ่านกระบวนการ backpropagation
            </li>
            <li>
              <strong style={{ color: '#1976d2' }}>ดูผลลัพธ์:</strong> กราฟจะแสดงค่าความผิดพลาด (Error) ของโมเดลในแต่ละรอบการฝึก
            </li>
            <li>
              <strong style={{ color: '#1976d2' }}>ล้างข้อมูล:</strong> กดปุ่ม <em>“Reset”</em> เพื่อล้างข้อมูลทั้งหมดและเริ่มใหม่
            </li>
          </ol>

          <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>🧮 องค์ประกอบภายในโมเดล:</h3>
          <ul style={{ paddingLeft: '1.5rem', fontSize: '1.5rem' }}>
            <li><code>sigmoid()</code>: ฟังก์ชัน activation สำหรับ hidden และ output layer</li>
            <li><code>learningRate = 0.5</code>: ค่าความเร็วในการเรียนรู้</li>
            <li><code>epochs = 500</code>: จำนวนรอบในการฝึกโมเดล</li>
            <li><code>w1, w2</code>: ค่าน้ำหนักสำหรับการส่งผ่านข้อมูล</li>
            <li><code>b1, b2</code>: ค่าคงที่ (bias) ในแต่ละชั้น</li>
          </ul>

          <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>📈 กราฟผลลัพธ์:</h3>
          <ul style={{ paddingLeft: '1.5rem', fontSize: '1.5rem' }}>
            <li><strong>Error per Epoch:</strong> แสดงค่าความผิดพลาดของโมเดลในแต่ละรอบการฝึก (ควรลดลงเรื่อย ๆ)</li>
          </ul>

          <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
            หมายเหตุ: โมเดลนี้เหมาะสำหรับการจำแนกข้อมูลแบบ XOR และข้อมูลที่ไม่สามารถแบ่งได้ด้วยเส้นตรง
            และจะสุ่มค่าน้ำหนักใหม่ทุกครั้งเมื่อฝึกใหม่ ทำให้ผลลัพธ์อาจแตกต่างกันเล็กน้อย
          </p>
        </div> : ''}

        <h3 style={{ fontSize: '2rem'}}>➕ เพิ่มข้อมูล (x1, x2, y)</h3>
        <Stack spacing={2} direction="row">
          <TextField id="outlined-basic" label="x1" variant="outlined" type="number" step="any" value={x1} onChange={e => setX1(e.target.value)}/>
          <TextField id="outlined-basic" label="x2" variant="outlined" type="number" step="any" value={x2} onChange={e => setX2(e.target.value)}/>
          <TextField id="outlined-basic" label="y (0 or 1)" variant="outlined" type="number" inputProps={{ min: 0, max: 1 }} value={y} onChange={e => setY(e.target.value)} sx={{ minWidth: '150px'}}/>
          <Button onClick={handleAdd} variant='contained' sx={font}>Add Data</Button>
          <Button onClick={handleTest} variant='contained' sx={font}>Load Sample Data</Button>
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
          <Button onClick={handleTrain} disabled={dataset.length === 0} variant='contained' sx={font}>🚀 Train Model</Button>
          <Button onClick={cl} variant='contained' sx={font} color="error">Reset</Button>
        </Stack>

        {trained && (
          <>
            <h3>📉 Error per Epoch</h3>
            <AnnErrorChart errors={errorLog} />
          </>
        )}
      </div>
    </Container>
  );
}
