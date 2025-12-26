async function login(email, password) {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
   
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      return true;
    }
    return false;
  }
  
  // Add similar functions for signup and token verification