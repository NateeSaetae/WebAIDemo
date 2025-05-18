import React, { useEffect, useRef } from 'react';
import { Delaunay } from 'd3-delaunay';

export default function PerceptronVoronoiChart({ dataPoints, weights }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 500;
    const height = canvas.height = 500;

    ctx.clearRect(0, 0, width, height);

    const margin = 20;
    const scale = 50;

    const points = dataPoints.map(d => [d.x1 * scale + width / 2, height / 2 - d.x2 * scale]);

    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    points.forEach((point, i) => {
      const cell = voronoi.cellPolygon(i);
      if (!cell) return;
      ctx.beginPath();
      ctx.moveTo(cell[0][0], cell[0][1]);
      for (let j = 1; j < cell.length; j++) {
        ctx.lineTo(cell[j][0], cell[j][1]);
      }
      ctx.closePath();
      ctx.fillStyle = dataPoints[i].y === 0 ? '#4f83cc' : '#e57373';
      ctx.fill();
    });

    dataPoints.forEach(p => {
      const x = p.x1 * scale + width / 2;
      const y = height / 2 - p.x2 * scale;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#000';
      ctx.fill();
    });
  }, [dataPoints, weights]);

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <h3>📊 Voronoi แสดงขอบเขตการจำแนก</h3>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }} />
    </div>
  );
}
