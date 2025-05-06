import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function DecisionBoundaryChart({ dataPoints, weights }) {
  const w1 = weights[0];
  const w2 = weights[1];
  const bias = weights[2];

  // คำนวณจุดสำหรับเส้น decision boundary
  const xValues = [0, 20];
  const yValues = xValues.map(x => -(w1 * x + bias) / w2);

  // แยกข้อมูล 0 และ 1
  const class0 = dataPoints.filter(p => p.y === 0);
  const class1 = dataPoints.filter(p => p.y === 1);

  const data = {
    datasets: [
      {
        label: 'Class 0',
        data: class0.map(p => ({ x: p.x1, y: p.x2 })),
        backgroundColor: 'blue',
      },
      {
        label: 'Class 1',
        data: class1.map(p => ({ x: p.x1, y: p.x2 })),
        backgroundColor: 'red',
      },
      {
        label: 'Decision Boundary',
        data: xValues.map((x, i) => ({ x, y: yValues[i] })),
        type: 'line',
        borderColor: 'rgba(0,0,0,0.7)',
        borderWidth: 2,
        fill: false,
        showLine: true,
      },
    ],
  };

  const options = {
    scales: {
      x: { min: 0, max: 20 },
      y: { min: 0, max: 20 },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      <h3>Decision Boundary</h3>
      <Scatter data={data} options={options} />
    </div>
  );
}
