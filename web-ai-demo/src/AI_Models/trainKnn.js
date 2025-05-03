import React, { use, useState } from 'react';
import KnnResultChart from '../Chart/KnnResultChart'

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

  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  const handleDataTest = () => {
    
    setDataset(datasetKnn);
    setBlockKnn(true)
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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🔍 K-NN Classifier</h1>

      <h3>➕ เพิ่มข้อมูลสอน (x1, x2, y)</h3>
      <input type="number" placeholder="x1" value={x1} onChange={e => setX1(e.target.value)} />
      <input type="number" placeholder="x2" value={x2} onChange={e => setX2(e.target.value)} />
      <input type="number" placeholder="y (0 or 1)" value={y} onChange={e => setY(e.target.value)} />
      <button onClick={handleAdd}>เพิ่ม</button>
      <button onClick={handleDataTest}>data test</button>

      <h4>📋 Dataset</h4>
      <ul>
        {dataset.map((d, i) => (
          <li key={i}>x1: {d.x1}, x2: {d.x2}, y: {d.y}</li>
        ))}
      </ul>

      <h3>🧪 ทำนายจากข้อมูลใหม่</h3>
      <input type="number" placeholder="x1 ทดสอบ" value={testX1} onChange={e => setTestX1(e.target.value)} />
      <input type="number" placeholder="x2 ทดสอบ" value={testX2} onChange={e => setTestX2(e.target.value)} />
      <input
        type="number"
        placeholder="k (เลขคี่เท่านั้น)"
        value={k}
        onChange={e => {
            const val = e.target.value;
            if (val === '') {
            setK('');
            return;
            }

            const num = parseInt(val);
            if (!isNaN(num) && num % 2 === 1) {
            setK(num);
            }
        }}
       />
      <button onClick={handlePredict} disabled={blockKnn === false || testX1 === '' || testX2 === ''}>ทำนาย</button>

      {prediction !== null && (
        <>
            <h4>📌 คำทำนาย: y = {prediction}</h4>
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
