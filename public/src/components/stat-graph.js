// Stat graph component
import { renderLineChart, renderPieChart } from '../utils/svgUtils.js';

export function renderStatGraph(container, config) {
  const { type, title, data } = config;
  
  container.innerHTML = `
    <div class="stat-graph">
      <h3>${title}</h3>
      <div class="graph-container"></div>
    </div>
  `;

  const graphContainer = container.querySelector('.graph-container');
  
  switch(type) {
    case 'line':
      renderLineChart(graphContainer, data);
      break;
    case 'pie':
      renderPieChart(graphContainer, data);
      break;
    default:
      graphContainer.innerHTML = '<p>Unsupported graph type</p>';
  }
}
