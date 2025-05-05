import React, { useState } from 'react';
import KnnResultChart from '../Chart/KnnResultChart'
import { Button, Stack, TextField } from '@mui/material';
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
  const font  = { fontFamily: 'Prompt',fontWeight: 400};
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
        fontFamily: 'Prompt'
  };

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
    <div style={{ padding: '2rem', fontFamily: 'Prompt', fontWeight: 400 }}>
      <h1>🔍 K-NN Classifier</h1>

      <div style={{ padding: '2rem', fontFamily: 'Prompt' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '1.6rem', color: '#1976d2' }}>
          📘 คำอธิบายการใช้งาน K-NN Interactive Classifier
        </h2>

        <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
          โปรแกรมนี้สาธิตการทำงานของ <strong>K-Nearest Neighbors (K-NN)</strong> สำหรับการจำแนกข้อมูลเป็น 2 กลุ่ม โดยใช้ระยะทางทางคณิตศาสตร์เพื่อทำนายผลลัพธ์ของจุดใหม่จากข้อมูลฝึกที่ผู้ใช้ป้อนเข้าไป
        </p>

        <h3 style={{ marginTop: '1.5rem', fontSize: '1.2rem' }}>📌 ขั้นตอนการใช้งาน:</h3>
        <ol style={{ paddingLeft: '1.5rem', fontSize: '1rem' }}>
          <li><strong>เพิ่มข้อมูลฝึก:</strong> ป้อนค่า <code>x1</code>, <code>x2</code> และ <code>y</code> (0 หรือ 1) แล้วกด <em>“Add Data Point”</em></li>
          <li><strong>ทดสอบการทำนาย:</strong> ป้อนข้อมูล <code>x1</code> และ <code>x2</code> ใหม่ พร้อมระบุค่า <code>k</code> (ต้องเป็นเลขคี่)</li>
          <li><strong>กดปุ่ม “Predict”:</strong> โปรแกรมจะคำนวณระยะทางจากทุกจุด และเลือกเพื่อนบ้านใกล้ที่สุด <code>k</code> จุด</li>
          <li><strong>แสดงผล:</strong> แสดงค่าที่คาดว่าจะได้จากการโหวตเสียงข้างมากของเพื่อนบ้าน</li>
        </ol>

        <h3 style={{ marginTop: '1.5rem', fontSize: '1.2rem' }}>🧠 หลักการทำงานเบื้องหลัง:</h3>
        <ul style={{ paddingLeft: '1.5rem', fontSize: '1rem' }}>
          <li>ใช้ระยะทาง <strong>Euclidean Distance</strong> เพื่อหาจุดที่ใกล้ที่สุด</li>
          <li>ไม่มีการฝึกโมเดลล่วงหน้า (Instance-based Learning)</li>
          <li>ใช้เสียงข้างมาก (Majority Vote) ของเพื่อนบ้านที่ใกล้ที่สุดเป็นผลลัพธ์</li>
        </ul>

        <h3 style={{ marginTop: '1.5rem', fontSize: '1.2rem' }}>💡 หมายเหตุ:</h3>
        <ul style={{ paddingLeft: '1.5rem', fontSize: '1rem' }}>
          <li>ค่า <code>k</code> ควรเป็นเลขคี่เพื่อป้องกันผลโหวตเสมอ</li>
          <li>เหมาะสำหรับข้อมูล 2 มิติ และเรียนรู้แนวคิดการจำแนกเบื้องต้น</li>
        </ul>
      </div>

      <h3 style={{ fontSize: '2rem'}} >➕ เพิ่มข้อมูลสอน (x1, x2, y)</h3>

      <Stack spacing={2} direction="row">
        <TextField id="outlined-basic" label="x1" variant="outlined" type="number" step="any" value={x1} onChange={e => setX1(e.target.value)}/>
        <TextField id="outlined-basic" label="x2" variant="outlined" type="number" step="any" value={x2} onChange={e => setX2(e.target.value)}/>
        <TextField id="outlined-basic" label="y (0 or 1)" variant="outlined" type="number" inputProps={{ min: 0, max: 1 }} value={y} onChange={e => setY(e.target.value)} sx={{ minWidth: '150px'}}/>
        <Button onClick={handleAdd} variant='contained' sx={font}>Add Data Point</Button>
        <Button onClick={handleDataTest} variant='contained' sx={font}>Load Sample Data</Button>
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
        <Button onClick={handlePredict} disabled={blockKnn === false || testX1 === '' || testX2 === ''} variant='contained' sx={font}>Predict</Button>
        <Button onClick={cl} variant='contained' sx={font}>Reset</Button>
      </Stack>

      {prediction !== null && (
        <>
            <h4 style={{ fontSize: '2rem'}}>📌 คำทำนาย: y = {prediction}</h4>
            <KnnResultChart
                dataset={dataset}
                testPoint={{ x1: parseFloat(testX1), x2: parseFloat(testX2) }}
                prediction={prediction}
            />
        </>
      )}
    </div>
  );
}