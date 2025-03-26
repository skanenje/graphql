// Profile page module
import { client, GET_USER_PROFILE, GET_XP_HISTORY, GET_PROGRESS_STATS, GET_AUDIT_RATIO } from '../graphql/client.js';
import { getCurrentUser, setCurrentUser } from '../app.js';
import { logoutUser } from '../utils/auth.js';
import { renderProfileCard } from '../components/profile-card.js';
import { renderStatGraph } from '../components/stat-graph.js';

async function fetchProfileData() {
  try {
    // Get basic profile
    const profileData = await client.query(GET_USER_PROFILE);
    
    // Get XP history (last 30 days)
    const endDate = new Date().toISOString();
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const xpData = await client.query(GET_XP_HISTORY, { startDate, endDate });
    
    // Get progress stats
    const progressData = await client.query(GET_PROGRESS_STATS);
    
    // Get audit ratio
    const auditData = await client.query(GET_AUDIT_RATIO);

    return {
      profile: profileData.user[0],
      xpHistory: xpData.transaction,
      progress: progressData.progress,
      auditRatio: calculateAuditRatio(auditData)
    };
  } catch (error) {
    console.error('Failed to fetch profile data:', error);
    throw error;
  }
}

function calculateAuditRatio(auditData) {
  const totalAudits = auditData.result.length;
  const passedAudits = auditData.result.filter(r => r.grade > 0).length;
  const totalXP = auditData.transaction.reduce((sum, t) => sum + t.amount, 0);
  
  return {
    ratio: totalAudits > 0 ? (passedAudits / totalAudits).toFixed(2) : 0,
    totalXP
  };
}

export async function renderProfilePage(container) {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.hash = 'login';
    return;
  }

  container.innerHTML = `
    <div class="profile-page">
      <div id="loading">Loading profile data...</div>
      <div id="profile-content" style="display: none;">
        <div id="profile-card-container"></div>
        <div id="stats-container">
          <div id="xp-graph-container" class="stat-section"></div>
          <div id="progress-graph-container" class="stat-section"></div>
        </div>
        <button id="logout-btn">Logout</button>
      </div>
    </div>
  `;

  try {
    const { profile, xpHistory, progress, auditRatio } = await fetchProfileData();
    
    document.getElementById('loading').style.display = 'none';
    const content = document.getElementById('profile-content');
    content.style.display = 'block';

    // Render profile card with all data
    const profileCardContainer = document.getElementById('profile-card-container');
    renderProfileCard(profileCardContainer, {
      ...profile,
      auditRatio: auditRatio.ratio,
      totalXP: auditRatio.totalXP
    });

    // Render XP graph
    const xpGraphContainer = document.getElementById('xp-graph-container');
    renderStatGraph(xpGraphContainer, {
      type: 'line',
      title: 'XP History (30 days)',
      data: xpHistory.map(x => ({
        date: new Date(x.createdAt).toLocaleDateString(),
        value: x.amount
      }))
    });

    // Render progress graph
    const progressGraphContainer = document.getElementById('progress-graph-container');
    renderStatGraph(progressGraphContainer, {
      type: 'pie',
      title: 'Project Completion',
      data: progress.reduce((acc, p) => {
        const key = p.grade > 0 ? 'Passed' : 'Failed';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    });

    // Setup logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', async () => {
      await logoutUser(client);
      setCurrentUser(null);
      window.location.hash = 'login';
    });

  } catch (error) {
    container.innerHTML = `
      <div class="error">
        Failed to load profile data. 
        <button id="retry-btn">Retry</button>
      </div>
    `;
    document.getElementById('retry-btn').addEventListener('click', () => renderProfilePage(container));
  }
}
