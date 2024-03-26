// This function would typically be in a separate file, like api.js

export const sendToBackend = async (message) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/ask_gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Server responded with an error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in API call:', error);
    throw error;  // Re-throw the error to be handled by the caller
  }
};