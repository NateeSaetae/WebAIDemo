// KnnResultChart.jsx
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function KnnResultChart({ dataset, testPoint, prediction }) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x1" name="x1" label={{ value: 'x1', position: 'bottom' }} />
          <YAxis type="number" dataKey="x2" name="x2" label={{ value: 'x2', angle: -90, position: 'insideLeft' }} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />

          {/* กลุ่ม class 0 */}
          <Scatter name="Class 0" data={dataset.filter(d => d.y === 0)} fill="#8884d8" />

          {/* กลุ่ม class 1 */}
          <Scatter name="Class 1" data={dataset.filter(d => d.y === 1)} fill="#82ca9d" />

          {/* จุดทดสอบ */}
          {testPoint && (
            <Scatter
              name={`Test Point (Predicted: ${prediction})`}
              data={[testPoint]}
              fill="#ff0000"
              shape="star"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
