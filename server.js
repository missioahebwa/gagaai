// api.js (for Gemini API calls)
const API_KEY = ''; // Replace with your actual Gemini API key

async function getGeminiResponse(query) {
  const response = await fetch('https://api.gemini.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-davinci-003', // Choose your desired Gemini model
      prompt: query,
      max_tokens: 1000, // Adjust maximum response length as needed
      temperature: 0.7, // Adjust creativity level (0 to 1)
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].text.trim();
}

// script.js (for chat functionality)
const chatlog = document.getElementById('chatlog');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage !== '') {
    displayMessage('user', userMessage);
    userInput.value = '';

    // Show loading indicator
    displayMessage('incoming', 'Loading...');

    try {
      const response = await getGeminiResponse(userMessage);
      displayMessage('bot', response);
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      displayMessage('bot', 'Oops, something went wrong. Please try again later.');
    }
  }
}

function displayMessage(type, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', type);
  messageElement.textContent = message;
  chatlog.appendChild(messageElement);

  // Scroll to the bottom of the chatlog
  chatlog.scrollTop = chatlog.scrollHeight;
}
