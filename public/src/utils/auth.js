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
    
    // Try to parse response data
    const data = await response.json().catch(e => {
      console.error('Failed to parse response:', e);
      return null;
    });
    
    console.log('Response data:', data); // Add this to see the response

    if (!response.ok) {
      throw new Error(data?.message || `Server error (${response.status})`);
    }
    
    if (!data) {
      throw new Error('Empty response from server');
    }
    
    if (!data.token) {
      throw new Error('No token received from server');
    }

    localStorage.setItem("jwt", data.token);
    return { 
      ...data.user,
      token: data.token
    };
  } catch (error) {
    console.error("Login error details:", error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server - please check your internet connection');
    }
    throw error; // Preserve the original error
  }
}

export async function logoutUser(client) {
  localStorage.removeItem("jwt");
}

export function getCurrentToken() {
  return localStorage.getItem("jwt");
}
