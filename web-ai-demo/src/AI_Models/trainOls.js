import React, { useState } from 'react';
import * as math from 'mathjs';

export default function OlsRegressionApp() {
  const [dataset, setDataset] = useState([]);
  const [x1, setX1] = useState('');
  const [x2, setX2] = useState('');
  const [y, setY] = useState('');
  const [weights, setWeights] = useState(null);
  const [mse, setMse] = useState(null);

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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📊 OLS Linear Regression Trainer</h1>

      <h3>➕ เพิ่มข้อมูล (x1, x2, y)</h3>
      <input type="number" placeholder="x1" value={x1} onChange={e => setX1(e.target.value)} />
      <input type="number" placeholder="x2" value={x2} onChange={e => setX2(e.target.value)} />
      <input type="number" placeholder="y" value={y} onChange={e => setY(e.target.value)} />
      <button onClick={handleAdd}>เพิ่ม</button>

      <h4>📋 Dataset</h4>
      <ul>
        {dataset.map((d, i) => (
          <li key={i}>x1: {d.x1}, x2: {d.x2}, y: {d.y}</li>
        ))}
      </ul>

      <button onClick={handleTrainOLS}>🚀 ฝึกโมเดล OLS</button>

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
