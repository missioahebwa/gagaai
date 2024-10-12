const typingForm = document.querySelector(".input-container");
const chatList = document.querySelector(".chatbox");

let userMessage = "";

// API configuration
const API_KEY = "";
const API_URL = ''; // Fill in your API URL

// Create a new message element and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement) => {
  const words = text.split(' ');
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    // Append each word to the text element with a space
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    
    // If all words are displayed
    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
    }
  }, 75);
};

// Fetch response from the API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text"); // Get text elements

  // Send a POST request to the API with the user's message
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}` // Include your API key if needed
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: userMessage }]
        }]
      })
    });

    const data = await response.json();
    const apiResponse = data?.candidates[0]?.content?.parts[0]?.text || "Sorry, I didn't understand that."; // Fallback message
    showTypingEffect(apiResponse, textElement);
  } catch (error) {
    console.error("Error fetching API response:", error);
    textElement.innerText = "Sorry, there was an error. Please try again.";
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
};

// Show a loading animation while waiting for the API response
const showLoadingAnimation = () => {
  const html = `
    <div class="message-content">
      <img src="images/gaga2.png" alt="Gemini Image" class="avatar">
      <p class="text"></p>
      <div class="loading-indicator">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
    </div>
    <span class="icon material-symbols-round">content_copy</span>
  `;

  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatList.appendChild(incomingMessageDiv);

  generateAPIResponse(incomingMessageDiv);
};

// Handle sending outgoing chat messages
const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim();
  if (!userMessage) return; // Exit if there is no message

  const html = `
    <div class="message-content">
      <img src="images/gaga2.png" alt="Gemini Image" class="avatar">
      <p class="text"></p>
    </div>
  `;
  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatList.appendChild(outgoingMessageDiv);

  typingForm.reset(); // Clear input field
  setTimeout(showLoadingAnimation, 500); // Show loading animation after a delay
};

// Prevent default form submission and handle outgoing chat
typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleOutgoingChat();
});
