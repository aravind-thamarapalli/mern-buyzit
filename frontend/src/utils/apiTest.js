// Test utility to check API connectivity
export const testAPIConnection = async () => {
  try {
    console.log('Testing API connection...');
    console.log('Environment:', import.meta.env.MODE);
    console.log('Is Production:', import.meta.env.PROD);
    console.log('Base URL:', import.meta.env.VITE_API_BASE_URL || 'Using proxy');
    
    const response = await fetch('/api/get-products');
    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Test Successful - Products found:', data.length || 'Unknown');
      return { success: true, data };
    } else {
      console.error('API Test Failed - Status:', response.status);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.error('API Test Error:', error);
    return { success: false, error: error.message };
  }
};

// Call this function when needed for debugging
if (import.meta.env.DEV) {
  window.testAPI = testAPIConnection;
}
