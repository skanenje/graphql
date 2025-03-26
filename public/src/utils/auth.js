const SIGNIN_ENDPOINT = "https://learn.zone01kisumu.ke/api/auth/signin";

export async function loginUser(client, email, password) {
  const credentials = `${email}:${password}`;
  const encodedCreds = btoa(credentials);
  
  try {
    const response = await fetch(SIGNIN_ENDPOINT, {
      method: "POST",
      headers: { 
        Authorization: `Basic ${encodedCreds}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("jwt", data.token);
      return { 
        ...data.user,
        token: data.token
      };
    }
    throw new Error("No token received from server");
  } catch (error) {
    console.error("Login error details:", error);
    throw new Error("Login failed: " + error.message);
  }
}

export async function logoutUser(client) {
  localStorage.removeItem("jwt");
}

export function getCurrentToken() {
  return localStorage.getItem("jwt");
}
