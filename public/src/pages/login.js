// Login page module
import { client } from '../graphql/client.js';
import { setCurrentUser } from '../app.js';
import { loginUser } from '../utils/auth.js';

export function renderLoginPage(container) {
  container.innerHTML = `
    <div class="login-container">
      <h1>Login</h1>
      <form id="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required>
        </div>
        <div id="error-message" class="error-message" style="display: none;"></div>
        <button type="submit">Login</button>
      </form>
    </div>
  `;

  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    try {
      errorDiv.style.display = 'none';
      const user = await loginUser(client, email, password);
      if (user) {
        setCurrentUser(user);
        window.location.hash = 'profile';
      } else {
        throw new Error('Login failed - no user data received');
      }
    } catch (error) {
      console.error('Login error:', error);
      errorDiv.textContent = error.message;
      errorDiv.style.display = 'block';
    }
  });
}
