// Profile card component
export function renderProfileCard(container, user) {
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-header">
        <img src="${user.avatar}" alt="Profile picture" class="profile-pic">
        <div>
          <h2>${user.name}</h2>
          <p class="login">@${user.login}</p>
        </div>
      </div>
      
      ${user.bio ? `<p class="bio">${user.bio}</p>` : ''}
      
      <div class="profile-stats">
        <div class="stat">
          <span class="stat-value">${user.totalXP}</span>
          <span class="stat-label">Total XP</span>
        </div>
        <div class="stat">
          <span class="stat-value">${user.auditRatio}</span>
          <span class="stat-label">Audit Ratio</span>
        </div>
      </div>
    </div>
  `;
}
