const SIGNIN_ENDPOINT = "https://learn.zone01kisumu.ke/api/auth/signin";

export async function loginUser(client, email, password) {
  // Input validation
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email format');
  }
  if (!password || password.length < 1) {
    throw new Error('Password cannot be empty');
  }

  const credentials = `${email}:${password}`;
  const encodedCreds = btoa(credentials);
  
  try {
    console.log('Attempting login for:', email);
    const response = await fetch(SIGNIN_ENDPOINT, {
      method: "POST",
      headers: { 
        Authorization: `Basic ${encodedCreds}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Server error (${response.status})`);
    }

    // Get the token as plain text and remove any quotes
    let token = await response.text();
    // Remove surrounding quotes if present
    token = token.replace(/^"(.*)"$/, '$1');
    
    console.log('Token received:', token.substring(0, 20) + '...');

    if (!token) {
      throw new Error('Empty response from server');
    }

    // Store the token
    localStorage.setItem("jwt", token);

    // Return the expected format
    return { 
      token: token,
      email: email,
      id: extractUserIdFromToken(token)
    };
  } catch (error) {
    console.error("Login error details:", error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server - please check your internet connection');
    }
    throw error;
  }
}

export async function logoutUser(client) {
  localStorage.removeItem("jwt");
}

export function getCurrentToken() {
  return localStorage.getItem("jwt");
}

// Helper function to extract user ID from JWT
function extractUserIdFromToken(token) {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload['https://hasura.io/jwt/claims']['x-hasura-user-id'];
  } catch (e) {
    console.error('Failed to extract user ID from token:', e);
    return null;
  }
}
