import React, { useState } from 'react';
import ResultChart from '../Chart/ResultChart';
import WeightsChart from '../Chart/WeightsChart';
import { trainPerceptron } from './trainPerceptron';
import { Button, Stack, TextField, Box, Container, Divider } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PerceptronExplanationModal from '../AI_Models/PerceptronExplanationModal'
import DecisionBoundaryChart from '../Chart/PerceptronDiagram'

export default function DisplayPerceptron() {
  const [dataset, setDataset] = useState([]);
  const [x1, setX1] = useState('');
  const [x2, setX2] = useState('');
  const [y, setY] = useState('');
  const [errors, setErrors] = useState([]);
  const [weights, setWeights] = useState([]);
  const [trained, setTrained] = useState(false);
  const [openEx, setOpenEx] = useState(false);
  const [blockInput, setBlockInput] = useState(false);
  const font = { fontFamily: 'Prompt', fontWeight: 400, fontSize: '1rem'};

  const datasetTest = [
    { x1: 1, x2: 1.5, y: 0 },
    { x1: 2, x2: 3.0, y: 1 },
    { x1: 0, x2: 2.2, y: 0 },
    { x1: 3, x2: 4.5, y: 1 },
    { x1: 1, x2: 0.5, y: 0 }
  ];

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

  const theme = createTheme({
    typography: {
      fontFamily: 'Prompt, sans-serif',
    },
  });

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
    setDataset(datasetTest);
    setBlockInput(true);
  };

  const cl = () => {
    setDataset([]);
    setErrors([]);
    setWeights([]);
    setBlockInput(false);
    setTrained(false);
    setX1('');
    setX2('');
    setY('');
  };

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
        <h2 style={{ fontWeight: 'bold', fontSize: '3rem', color: '#000' }}>ทฤษฎีของ Perceptron</h2>
        <p style={{ fontSize: '1.5rem', marginTop: '0.5rem'}}>
          Perceptron เป็นโมเดลพื้นฐานของ Machine Learning สำหรับการจำแนกข้อมูลแบบสองกลุ่ม (Binary Classification)
          โดยใช้สมการเชิงเส้นเพื่อแบ่งข้อมูลออกเป็นกลุ่ม 0 หรือ 1
        </p>
        <p style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
          <strong>สมการ Percptron</strong>
          <br />
          <code>y = f(w₁x₁ + w₂x₂ + b)</code>
          <br />
          <TableContainer component={Paper} sx={{ maxWidth: 700, my: 2 ,fontFamily: 'Prompt'}}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={headCellStyle}>ตัวแปร</TableCell>
                <TableCell sx={headCellStyle}>คำอธิบาย</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={tableStyle}><code>x₁, x₂</code></TableCell>
                <TableCell sx={tableStyle}>ค่าข้อมูลนำเข้า (features)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>w₁, w₂</code></TableCell>
                <TableCell sx={tableStyle}>ค่าน้ำหนัก (weights)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>b</code></TableCell>
                <TableCell sx={tableStyle}>ค่าคงที่ (bias)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>f</code></TableCell>
                <TableCell sx={tableStyle}>ฟังก์ชันตัดสินใจ (เช่น step function)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        </p>
        <p style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
          การฝึกโมเดลจะปรับค่าของ <code>w</code> และ <code>b</code> โดยอิงจากข้อผิดพลาด (error) เพื่อให้โมเดลสามารถแยกข้อมูลได้ถูกต้อง
        </p>
        <Divider
          sx={{
            my: 4,
            borderColor: 'grey.400',
            borderBottomWidth: 3,
          }}
          textAlign="left"
        ></Divider>
      </Box>

      <h1 style={{ fontSize: '3rem', marginTop: '0.5rem' }}>Perceptron Interactive Trainer</h1>
      <Button variant='contained' onClick={exModel} sx={{ fontSize: '1.2rem' , fontFamily: 'Prompt'}}>Show Explanation</Button>
      { openEx === true ? <div style={{ padding: '2rem', fontFamily: 'Prompt', background:'#F6F3F3' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '2rem', color: '#1976d2' }}>
          คำอธิบายการใช้งาน Perceptron Interactive Trainer
        </h2>

        <p style={{ marginTop: '1rem', fontSize: '1.4rem' }}>
          โปรแกรมนี้จำลองการทำงานของ <strong>โมเดล Perceptron</strong> สำหรับการจำแนกข้อมูลออกเป็น 2 กลุ่ม (0หรือ 1)
          โดยให้ผู้ใช้งานสามารถป้อนข้อมูลเอง ฝึกโมเดล และดูผลลัพธ์ในรูปแบบกราฟได้
        </p>

        <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>📌 ขั้นตอนการใช้งาน:</h3>
        <ol style={{ paddingLeft: '1.5rem', fontSize: '1.5rem' }}>
          <li><strong style={{ color:'#1976d2'}}>ปือนข้อมูล:</strong> กรอกค่าของ <code>x₁</code>, <code>x₂</code> และ <code>y</code> (ต้องเป็น 0 หรือ 1) แล้วกดปุ่ม <em>“Add Data Point”</em> หรือกดปุ่ม <em>“Load Sample Data”</em> เพื่อเพิ่มตัวอย่างข้อมูลที่จำลองมาให้</li>
          <li><strong style={{ color:'#1976d2'}}>ฝึกโมเดล:</strong> กดปุ่ม <em>“Train Model”</em> เพื่อเริ่มเรียนรู้และปรับค่า weights</li>
          <li><strong style={{ color:'#1976d2'}}>ดูผลลัพธ์:</strong> ระบบจะแสดงกราฟ Error และ Weights per Epoch</li>
          <li><strong style={{ color:'#1976d2'}}>ใช้ตัวอย่าง:</strong> หากยังไม่มีข้อมูล สามารถกดปุ่ม <em>“Load Sample Data”</em></li>
          <li><strong style={{ color:'#1976d2'}}>ล้างข้อมูล:</strong> กดปุ่ม <em>“Reset”</em> เพื่อเริ่มต้นใหม่</li>
        </ol>

        <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>📈 กราฟผลลัพธ์:</h3>
        <ul style={{ paddingLeft: '1.5rem', fontSize: '1.5rem' }}>
          <li><strong>Error per Epoch:</strong> แสดงความผิดพลาดของโมเดลในแต่ละรอบ</li>
          <li><strong>Weights over Epochs:</strong> แสดงการเปลี่ยนแปลงของน้ำหนักตามรอบการฝึก</li>
        </ul>

        <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
          หมายเหตุ: โมเดลนี้ใช้ Learning Rate = <code>0.1</code> และ Epoch = <code>50</code> โดยใช้ Step Function เป็นฟังก์ชันตัดสินใจ
        </p>
      </div> : ''}

      <h3 style={{ fontSize: '2rem' }}>เพิ่มข้อมูล (x1, x2, y)</h3>
      <Stack spacing={2} direction="row">
        <TextField id="outlined-basic" label="x1" variant="outlined" type="number" step="any" value={x1} onChange={e => setX1(e.target.value)} />
        <TextField id="outlined-basic" label="x2" variant="outlined" type="number" step="any" value={x2} onChange={e => setX2(e.target.value)} />
        <TextField id="outlined-basic" label="y (0 or 1)" variant="outlined" type="number" inputProps={{ min: 0, max: 1 }} value={y} onChange={e => setY(e.target.value)} sx={{ minWidth: '150px' }} />
        <Button onClick={handleAddData} disabled={blockInput === true} variant='contained' sx={font}>Add Data Point</Button>
        <Button onClick={handleTrainTest} variant='contained' sx={font}>Load Sample Data</Button>
      </Stack>

      <h4 style={{ fontSize: '2rem' }}>Dataset</h4>

      <TableContainer component={Paper} sx={{ width: '100%', maxWidth: '600px', mb: 4 , fontSize:'2rem'}}>
        <Table>
          <TableHead>
            {dataset.length !== 0 && (
              <TableRow>
                <TableCell sx={headCellStyle}>x1</TableCell>
                <TableCell sx={headCellStyle}>x2</TableCell>
                <TableCell sx={headCellStyle}>y</TableCell>
              </TableRow>
            )}
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
        <Stack spacing={2} direction="row" sx={{ width: '100%', mt: 4 }}>
          <Box sx={{ flex: 1, minWidth: '800px' }}>
            <h3 style={{ fontSize: '1.5rem' }}>📈 Error per Epoch</h3>
            <ResultChart dataPoints={errors} />
          </Box>
          <Box sx={{ flex: 1, minWidth: '800px' }}>
            <h3 style={{ fontSize: '1.5rem' }}>📊 Weights over Epochs</h3>
            <WeightsChart weightsPerEpoch={weights} />
          </Box>
          <Box sx={{ flex: 1, minWidth: '800px' }}>
            <h3 style={{ fontSize: '1.5rem' }}>📊 Weights over Epochs</h3>
            <DecisionBoundaryChart
              dataPoints={dataset}
              weights={weights[weights.length - 1]} // ใช้ weight ล่าสุด
            />
          </Box>
        </Stack>
      )}
    </Container>
  );
}