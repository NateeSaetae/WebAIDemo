import {
  LineChart,
  Line,
  Scatter,
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
          <YAxis label={{ value: 'y / ŷ', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Scatter name="Actual" data={sortedData} fill="#8884d8" />
          <Line type="linear" dataKey="predicted" stroke="#82ca9d" dot={false} name="Predicted Line" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
