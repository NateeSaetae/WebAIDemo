import React, { useState } from 'react';
import ResultChart from '../Chart/ResultChart'
import WeightsChart from '../Chart/WeightsChart'
import { trainPerceptron } from './trainPerceptron'
import { Button, Stack, TextField, Box} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function DisplayPerceptron() {
    const [dataset, setDataset] = useState([]);
      const [x1, setX1] = useState('');
      const [x2, setX2] = useState('');
      const [y, setY] = useState('');
      const [errors, setErrors] = useState([]);
      const [weights, setWeights] = useState([]);
      const [trained, setTrained] = useState(false);
      const [blockInput, setBlockInput] = useState(false);
      const font  = { fontFamily: 'Prompt',fontWeight: 400};
      
      const datasetTest = [
        {x1: 1, x2: 1.5, y: 0},
        {x1: 2, x2: 3.0, y: 1},
        {x1: 0, x2: 2.2, y: 0},
        {x1: 3, x2: 4.5, y: 1},
        {x1: 1, x2: 0.5, y: 0}
      ]

      const headCellStyle = {
        backgroundColor: '#e3f2fd',
        color: '#0d47a1',
        fontWeight: 'bold',
        fontFamily: 'Prompt'
      };

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
        <div style={{ padding: '2rem', fontFamily: 'Prompt', fontWeight: 400 }}>
          <Box className="bg-yellow-50 border rounded p-4 mb-6" sx={{ fontFamily: 'Prompt' }}>
  <h2 className="text-xl font-bold text-blue-800">🧠 ทฤษฎีของ Perceptron</h2>
  <p style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
    Perceptron เป็นโมเดลพื้นฐานของ Machine Learning สำหรับการจำแนกข้อมูลแบบสองกลุ่ม (Binary Classification)
    โดยใช้สมการเชิงเส้นเพื่อแบ่งข้อมูลออกเป็นกลุ่ม 0 หรือ 1
  </p>
  <p style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>
    <strong>สมการ:</strong> &nbsp;
    <code>y = f(w₁x₁ + w₂x₂ + b)</code>
    <br />
    โดยที่:
    <ul style={{ marginLeft: '1rem', marginTop: '0.3rem' }}>
      <li><code>x₁, x₂</code>: ค่าข้อมูลนำเข้า (features)</li>
      <li><code>w₁, w₂</code>: ค่าน้ำหนัก (weights)</li>
      <li><code>b</code>: ค่าคงที่ (bias)</li>
      <li><code>f</code>: ฟังก์ชันตัดสินใจ (เช่น step function)</li>
    </ul>
  </p>
  <p style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>
    การฝึกโมเดลจะปรับค่าของ <code>w</code> และ <code>b</code> โดยอิงจากข้อผิดพลาด (error) เพื่อให้โมเดลสามารถแยกข้อมูลได้ถูกต้อง
  </p>
</Box>

          <h1>🧠 Perceptron Interactive Trainer</h1>
    
          <h3 style={{ fontSize: '2rem'}}>➕ เพิ่มข้อมูล (x1, x2, y)</h3>
          <Stack spacing={2} direction="row">
            <TextField id="outlined-basic" label="x1" variant="outlined" type="number" step="any" value={x1} onChange={e => setX1(e.target.value)}/>
            <TextField id="outlined-basic" label="x2" variant="outlined" type="number" step="any" value={x2} onChange={e => setX2(e.target.value)}/>
            <TextField id="outlined-basic" label="y (0 or 1)" variant="outlined" type="number" inputProps={{ min: 0, max: 1 }} value={y} onChange={e => setY(e.target.value)} sx={{ minWidth: '150px'}}/>
            <Button onClick={handleAddData} disabled={blockInput === true} variant='contained' sx={font}>Add Data</Button>
            <Button onClick={handleTrainTest} variant='contained' sx={font}>🚀 ตัวอย่างข้อมูลจำลอง</Button>
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
            <Stack spacing={2} direction="row" sx={{ width: '60%' }}>
              <Box sx={{ flex: 1, minWidth: '600px' }}>
                <h3 style={{ fontSize: '1.5rem'}}>📈 Error per Epoch</h3>
                <ResultChart dataPoints={errors} />
              </Box>
              <Box sx={{ flex: 1, minWidth: '600px' }}>
                <h3 style={{ fontSize: '1.5rem'}}>📊 Weights over Epochs</h3>
                <WeightsChart weightsPerEpoch={weights} />
              </Box>
            </Stack>

          )}
        </div>
      );
}