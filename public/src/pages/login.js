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
        <button type="submit">Login</button>
      </form>
    </div>
  `;

  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const user = await loginUser(client, email, password);
      setCurrentUser(user);
      window.location.hash = 'profile';
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  });
}
