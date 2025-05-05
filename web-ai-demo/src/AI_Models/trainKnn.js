import React, { use, useState } from 'react';
import KnnResultChart from '../Chart/KnnResultChart'
import { Button, Stack, TextField, Container, Box, Divider} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function euclideanDistance(a, b) {
  return Math.sqrt(
    a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
  );
}

function knnPredict(input, dataset, k) {
  const distances = dataset.map((item) => ({
    ...item,
    distance: euclideanDistance(input, [item.x1, item.x2])
  }));

  const neighbors = distances.sort((a, b) => a.distance - b.distance).slice(0, k);
  const votes = neighbors.reduce((acc, cur) => {
    acc[cur.y] = (acc[cur.y] || 0) + 1;
    return acc;
  }, {});

  const predicted = Object.entries(votes).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  return predicted;
}

export default function TrainKnn() {
  const [dataset, setDataset] = useState([]);
  const [x1, setX1] = useState('');
  const [x2, setX2] = useState('');
  const [y, setY] = useState('');
  const [testX1, setTestX1] = useState('');
  const [testX2, setTestX2] = useState('');
  const [k, setK] = useState('');
  const [blockKnn, setBlockKnn] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [openEx, setOpenEx] = useState(false);
  const font = { fontFamily: 'Prompt', fontWeight: 400, fontSize: '1rem'};
  const datasetKnn = [
        { x1: 1, x2: 2, y: 0 },
        { x1: 2, x2: 1, y: 0 },
        { x1: 2.5, x2: 3, y: 1 },
        { x1: 3, x2: 2.5, y: 1 },
        { x1: 4, x2: 4, y: 1 },
        { x1: 1.5, x2: 1.8, y: 0 },
        { x1: 3.5, x2: 3.2, y: 1 },
        { x1: 0.5, x2: 2.2, y: 0 }
    ]

  const handleAdd = () => {
    const numX1 = parseFloat(x1);
    const numX2 = parseFloat(x2);
    const numY = parseInt(y);
    if (!isNaN(numX1) && !isNaN(numX2) && (numY === 0 || numY === 1)) {
      setDataset([...dataset, { x1: numX1, x2: numX2, y: numY }]);
      setX1('');
      setX2('');
      setY('');
    } else {
      alert('กรุณากรอกข้อมูลให้ครบและ y เป็น 0 หรือ 1');
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

  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  const handleDataTest = () => {

    setDataset(datasetKnn);
    setBlockKnn(true)
  }

  const cl = () => {
    setBlockKnn(false);
    setDataset([])
    setX1('');
    setX2('');
    setY('');
    setTestX1('');
    setTestX2('');
    setK('');
    setPrediction(null);
  }

  const handlePredict = () => {
    if(k%2 !== 0){
        const input = [parseFloat(testX1), parseFloat(testX2)];
        const result = knnPredict(input, dataset, parseInt(k));
        setPrediction(result);
    } else {
        alert('กรุณากรอกข้อมูลให้ครบและ K เป็นเลขคี่');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, fontFamily: 'Prompt', fontWeight: 400 }}>
        <Box sx={{ fontFamily: 'Prompt', mt: 4, mb: 6 }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '3rem', color: '#000' }}>
          ทฤษฎีของ K-Nearest Neighbors (K-NN)
        </h2>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          K-NN เป็นอัลกอริธึมสำหรับการจำแนกประเภทข้อมูล (Classification) หรือการประมาณค่า (Regression)
          โดยใช้ระยะห่างระหว่างจุดข้อมูลใหม่กับข้อมูลในชุดฝึกเพื่อหากลุ่มเพื่อนบ้านที่ใกล้ที่สุดจำนวน <strong>k จุด</strong>
          แล้วตัดสินค่าผลลัพธ์จากคะแนนเสียงข้างมาก (Majority Vote)
        </p>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          เมื่อมีจุดข้อมูลใหม่ ระบบจะคำนวณระยะห่างกับทุกจุดในชุดข้อมูล จากนั้นเลือก k จุดที่ใกล้ที่สุด แล้วดูว่าแต่ละจุดอยู่ในกลุ่มใด
          ถ้าจำนวนมากที่สุดคือกลุ่มใด ก็ให้จุดใหม่นั้นอยู่ในกลุ่มนั้น
        </p>

        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          <strong>สมการ:</strong> การวัดระยะห่าง (Euclidean distance) ระหว่างจุดใหม่กับทุกจุดในชุดข้อมูล:
          <br />
          <code>d(p, q) = √((x₁ᵖ - x₁ᵠ)² + (x₂ᵖ - x₂ᵠ)²)</code>
          <br />แล้วใช้คะแนนเสียงข้างมาก (Majority Vote) จาก <strong>k เพื่อนบ้าน</strong> ที่ใกล้ที่สุดในการตัดสินค่า <code>y</code>
        </p>

        <TableContainer component={Paper} sx={{ maxWidth: 700, my: 2 ,fontFamily: 'Prompt'}}>
          <Table size='medium'>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell sx={headCellStyle}><strong>ตัวแปร</strong></TableCell>
                <TableCell sx={headCellStyle}><strong>คำอธิบาย</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={tableStyle}><code>x₁, x₂</code></TableCell>
                <TableCell sx={tableStyle}>ข้อมูลที่ใช้ทำนาย (features)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>k</code></TableCell>
                <TableCell sx={tableStyle}>จำนวนเพื่อนบ้านที่ใกล้ที่สุด</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>d</code></TableCell>
                <TableCell sx={tableStyle}>ระยะห่างระหว่างจุดข้อมูล (เช่น Euclidean distance)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={tableStyle}><code>y</code></TableCell>
                <TableCell sx={tableStyle}>ค่ากลุ่มที่ต้องการทำนาย (0 หรือ 1)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <p style={{ fontSize: '1.5rem', marginTop: '1.5rem' }}>
          K-NN เป็นโมเดลที่ไม่ต้องฝึก (non-parametric) แต่จะทำการคำนวณระยะห่างใหม่ทุกครั้งที่ต้องการทำนายผลลัพธ์
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
      <div style={{ padding: '2rem', fontFamily: 'Prompt', fontWeight: 400 }}>
        <h1 style={{ fontSize: '3rem', marginTop: '0.5rem' }}>K-NN Classifier</h1>

        <Button variant='contained' onClick={exModel} sx={{ fontSize: '1.2rem' , fontFamily: 'Prompt'}}>Show Explanation</Button>

        {openEx === true ? <div style={{ padding: '2rem', fontFamily: 'Prompt',background:'#F6F3F3' }}>
          <h2 style={{ fontWeight: 'bold', fontSize: '2rem', color: '#1976d2' }}>
            📘 คำอธิบายการใช้งาน K-NN Interactive Classifier
          </h2>

          <p style={{ marginTop: '1rem', fontSize: '1.4rem' }}>
            โปรแกรมนี้สาธิตการทำงานของ <strong>อัลกอริทึม K-Nearest Neighbors (K-NN)</strong> สำหรับการจำแนกข้อมูลออกเป็น 2 กลุ่ม
            โดยใช้ระยะทางเพื่อวัดความใกล้ของจุดใหม่กับจุดในชุดข้อมูลฝึก เพื่อทำนายผลลัพธ์
          </p>

          <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>📌 ขั้นตอนการใช้งาน:</h3>
          <ol style={{ paddingLeft: '1.5rem', fontSize: '1.5rem' }}>
            <li><strong style={{ color:'#1976d2' }}>เพิ่มข้อมูล:</strong> กรอกค่า <code>x₁</code>, <code>x₂</code>, และ <code>y</code> (0 หรือ 1) แล้วกด <em>“Add Data”</em> หรือ <em>“Load Sample Data”</em></li>
            <li><strong style={{ color:'#1976d2' }}>ป้อนจุดทดสอบ:</strong> ใส่ค่าที่ต้องการทำนายใน <code>x₁</code>, <code>x₂</code> และกำหนดค่า <code>k</code> (ต้องเป็นเลขคี่)</li>
            <li><strong style={{ color:'#1976d2' }}>ทำนายผลลัพธ์:</strong> กดปุ่ม <em>“ทำนาย”</em> เพื่อให้ระบบคำนวณผลลัพธ์ที่คาดว่าจะเป็น 0 หรือ 1</li>
            <li><strong style={{ color:'#1976d2' }}>ดูผลลัพธ์:</strong> ระบบจะแสดงค่าที่ทำนายได้ พร้อมข้อมูลการจำแนกและกราฟ</li>
            <li><strong style={{ color:'#1976d2' }}>ล้างข้อมูล:</strong> กด <em>“Reset”</em> เพื่อเริ่มต้นใหม่</li>
          </ol>

          <h3 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>📈 ผลลัพธ์ที่แสดง:</h3>
          <ul style={{ paddingLeft: '1.5rem', fontSize: '1.5rem' }}>
            <li><strong>ผลลัพธ์การทำนาย:</strong> แสดงว่าโมเดลคิดว่าจุดที่ใส่มาอยู่ในกลุ่ม 0 หรือ 1</li>
            <li><strong>กราฟจำแนก:</strong> แสดงตำแหน่งของจุดทั้งหมด (สีม่วง Class 0 สีเขียน Class 1) และจุดที่ทำนาย (สีเเดงรูปนาน)พร้อมสีที่ต่างกัน </li>
          </ul>

          <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
            หมายเหตุ: การใช้ K-NN ไม่จำเป็นต้องฝึกโมเดลล่วงหน้า (Instance-based Learning) และควรเลือกค่า <code>k</code> เป็นเลขคี่เสมอ เพื่อหลีกเลี่ยงผลลัพธ์เสมอ
          </p>
        </div> : ''}

        <h3 style={{ fontSize: '2rem'}} >➕ เพิ่มข้อมูลสอน (x1, x2, y)</h3>

        <Stack spacing={2} direction="row">
          <TextField id="outlined-basic" label="x1" variant="outlined" type="number" step="any" value={x1} onChange={e => setX1(e.target.value)}/>
          <TextField id="outlined-basic" label="x2" variant="outlined" type="number" step="any" value={x2} onChange={e => setX2(e.target.value)}/>
          <TextField id="outlined-basic" label="y (0 or 1)" variant="outlined" type="number" inputProps={{ min: 0, max: 1 }} value={y} onChange={e => setY(e.target.value)} sx={{ minWidth: '150px'}}/>
          <Button onClick={handleAdd} variant='contained' sx={font}>Add Data</Button>
          <Button onClick={handleDataTest} variant='contained' sx={font}>Load Sample Data</Button>
        </Stack>

        <h4 style={{ fontSize: '2rem'}}>📋 Dataset</h4>
        <TableContainer component={Paper} sx={{ width: '100%', maxWidth: '600px', mb: 4 , fontSize:'2rem'}}>
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

        <h3 style={{ fontSize: '2rem'}}>🧪 ทำนายจากข้อมูลใหม่</h3>

        <Stack spacing={2} direction="row">
          <TextField id="outlined-basic" label="x1 ทดสอบ" variant="outlined" type="number" step="any" value={testX1} onChange={e => setTestX1(e.target.value)}/>
          <TextField id="outlined-basic" label="x2 ทดสอบ" variant="outlined" type="number" step="any" value={testX2} onChange={e => setTestX2(e.target.value)}/>
          <TextField id="outlined-basic" label="k (เลขคี่เท่านั้น)" variant="outlined" type="number" step="any" value={k} onChange={e => {
                const val = e.target.value;
                if (val === '') {
                setK('');
                return;
                }

                const num = parseInt(val);
                if (!isNaN(num) && num % 2 === 1) {
                setK(num);
                }
          }}/>
          <Button onClick={handlePredict} disabled={blockKnn === false || testX1 === '' || testX2 === '' || k === ''} variant='contained' sx={font}>🚀 Train Model</Button>
          <Button onClick={cl} variant='contained' sx={font} color="error">Reset</Button>
        </Stack>

        {prediction !== null && (
          <>
              <h4 style={{ fontSize: '2rem'}}>📌 จุด ({testX1},{testX2}) อยู่ใน Class {prediction}</h4>
              <KnnResultChart
                  dataset={dataset}
                  testPoint={{ x1: parseFloat(testX1), x2: parseFloat(testX2) }}
                  prediction={prediction}
              />
          </>
        )}
      </div>
    </Container>
  );
}
