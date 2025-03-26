// Main application module
import { client } from './graphql/client.js';
import { renderLoginPage } from './pages/login.js';
import { renderProfilePage } from './pages/profile.js';

let currentUser = null;

export function initializeApp() {
  // Check auth status
  checkAuthStatus();
  
  // Set up initial routing
  setupRouting();
}

function checkAuthStatus() {
  // TODO: Implement auth check
}

function setupRouting() {
  // Simple hash-based routing
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const route = window.location.hash.replace('#', '');
  const appElement = document.getElementById('app');
  
  switch(route) {
    case 'login':
      appElement.innerHTML = '';
      renderLoginPage(appElement);
      break;
    case 'profile':
    default:
      appElement.innerHTML = '';
      renderProfilePage(appElement);
      break;
  }
}

export function setCurrentUser(user) {
  currentUser = user;
}

export function getCurrentUser() {
  return currentUser;
}
