document.getElementById('send-button').addEventListener('click', () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    displayMessage(userInput, 'user-message');
    document.getElementById('user-input').value = '';

    fetch('/api/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        displayMessage(data.answer, 'bot-message');
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function displayMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.textContent = message;
    document.getElementById('chatlog').appendChild(messageElement);
    document.getElementById('chatlog').scrollTop = document.getElementById('chatlog').scrollHeight;

  }

