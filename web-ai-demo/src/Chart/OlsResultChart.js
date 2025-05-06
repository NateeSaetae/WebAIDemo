import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function OlsResultChart({ data }) {
  const sortedData = [...data].sort((a, b) => a.x1 - b.x1);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x1" label={{ value: 'x1', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'y', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" stroke="#8884d8" name="Actual" dot={true} />
          <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
