import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function WeightsChart({ weightsPerEpoch }) {
  const labels = weightsPerEpoch.map((_, i) => `Epoch ${i + 1}`);
  const weight0 = weightsPerEpoch.map((w) => w[0]);
  const weight1 = weightsPerEpoch.map((w) => w[1]);

  const data = {
    labels,
    datasets: [
      {
        label: "Weight w1",
        data: weight0,
        borderColor: "rgb(255, 99, 132)",
        fill: false,
      },
      {
        label: "Weight w2",
        data: weight1,
        borderColor: "rgb(54, 162, 235)",
        fill: false,
      },
    ],
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px" }}>
      <Line data={data} />
    </div>
  );
}