// src/components/ResultChart.js
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function ResultChart({ dataPoints }) {
  const data = {
    labels: dataPoints.map((_, i) => `Epoch ${i + 1}`),
    datasets: [
      {
        label: "Loss (Error)",
        data: dataPoints,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.2,
      },
    ],
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px" }}>
      <Line data={data} />
    </div>
  );
}
