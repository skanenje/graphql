// Utility functions for SVG graph generation
export function renderLineChart(container, data) {
  const width = 400;
  const height = 200;
  const margin = 20;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const xScale = (width - 2 * margin) / (data.length - 1);
  const yScale = (height - 2 * margin) / maxValue;

  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Draw axes
  svg += `<line x1="${margin}" y1="${height - margin}" x2="${width - margin}" y2="${height - margin}" stroke="black"/>`;
  svg += `<line x1="${margin}" y1="${margin}" x2="${margin}" y2="${height - margin}" stroke="black"/>`;

  // Draw line
  let path = `M${margin},${height - margin - (data[0].value * yScale)}`;
  data.forEach((d, i) => {
    const x = margin + (i * xScale);
    const y = height - margin - (d.value * yScale);
    path += ` L${x},${y}`;
  });
  svg += `<path d="${path}" stroke="blue" fill="none" stroke-width="2"/>`;

  // Add labels
  data.forEach((d, i) => {
    const x = margin + (i * xScale);
    const y = height - margin - (d.value * yScale);
    svg += `<circle cx="${x}" cy="${y}" r="3" fill="red"/>`;
    svg += `<text x="${x}" y="${height - margin + 15}" font-size="10" text-anchor="middle">${d.date}</text>`;
  });

  svg += '</svg>';
  container.innerHTML = svg;
}

export function renderPieChart(container, data) {
  const size = 200;
  const radius = size / 2;
  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  let cumulativePercent = 0;

  Object.entries(data).forEach(([label, value], i) => {
    const percent = value / total;
    const x1 = radius + radius * Math.cos(2 * Math.PI * cumulativePercent);
    const y1 = radius + radius * Math.sin(2 * Math.PI * cumulativePercent);
    cumulativePercent += percent;
    const x2 = radius + radius * Math.cos(2 * Math.PI * cumulativePercent);
    const y2 = radius + radius * Math.sin(2 * Math.PI * cumulativePercent);

    const largeArcFlag = percent > 0.5 ? 1 : 0;
    const path = [
      `M ${radius} ${radius}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const color = label === 'Passed' ? '#4CAF50' : '#F44336';
    svg += `<path d="${path}" fill="${color}" stroke="white" stroke-width="1"/>`;
    svg += `<text x="${radius}" y="${radius}" font-size="12" text-anchor="middle" fill="white">${label}: ${value}</text>`;
  });

  svg += '</svg>';
  container.innerHTML = svg;
}
