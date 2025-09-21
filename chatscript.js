const prompt = document.querySelector("#prompt");
const chatContainer = document.querySelector(".chat-container");
const submitBtn = document.querySelector("#submit");
const typingIndicator = document.querySelector("#typingIndicator");

const GEMINI_API_KEY = "AIzaSyDGrwAmW3ExCh452_SqojpvTp-jKw8J_J8";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function generateResponse(message) {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `You are a helpful tourism assistant for Jharkhand, India. Provide information about destinations, festivals, culture, and travel tips in Jharkhand. Give response in a concise and organized manner. User question: ${message}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7
            }
        })
    };

    try {
        showTypingIndicator();
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, requestOptions);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        const aiResponse = data.candidates[0].content.parts[0].text.trim();
        hideTypingIndicator();
        createAiMessage(aiResponse);
        
    } catch (error) {
        hideTypingIndicator();
        createAiMessage("Sorry, I'm having trouble connecting right now. Please try again later.");
        console.error("Error:", error);
    }
}

function createUserMessage(message) {
    const messageHtml = `
        <div class="message-wrapper">
            <img src="USERIMAGE.jpg" alt="User" class="avatar">
            <div class="user-chat-area">
                <div class="message-content">
                    <i class="fas fa-user"></i>
                    ${message}
                </div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        </div>
    `;
    
    const userChatBox = document.createElement("div");
    userChatBox.classList.add("user-chat-box");
    userChatBox.innerHTML = messageHtml;
    chatContainer.appendChild(userChatBox);
    scrollToBottom();
}

function createAiMessage(message) {
    const messageHtml = `
        <div class="message-wrapper">
            <img src="AI BOT.jpg" alt="AI Assistant" class="avatar">
            <div class="ai-chat-area">
                <div class="message-content">
                    <i class="fas fa-robot"></i>
                    ${message}
                </div>
                <div class="message-time">${getCurrentTime()}</div>
            </div>
        </div>
    `;
    
    const aiChatBox = document.createElement("div");
    aiChatBox.classList.add("ai-chat-box");
    aiChatBox.innerHTML = messageHtml;
    chatContainer.appendChild(aiChatBox);
    scrollToBottom();
}

let currentTypingIndicator = null;

function showTypingIndicator() {
    const typingHtml = `
        <div class="message-wrapper">
            <img src="AI BOT.jpg" alt="AI Assistant" class="avatar">
            <div class="typing-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    
    currentTypingIndicator = document.createElement("div");
    currentTypingIndicator.classList.add("typing-indicator");
    currentTypingIndicator.innerHTML = typingHtml;
    chatContainer.appendChild(currentTypingIndicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    if (currentTypingIndicator) {
        currentTypingIndicator.remove();
        currentTypingIndicator = null;
    }
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
    setTimeout(() => {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    }, 100);
}

function handleChatResponse(message) {
    if (!message.trim()) return;
    
    createUserMessage(message);
    prompt.value = "";
    
    setTimeout(() => {
        generateResponse(message);
    }, 500);
}

// Event listeners
prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChatResponse(prompt.value);
    }
});

submitBtn.addEventListener("click", () => {
    handleChatResponse(prompt.value);
});

// Auto-resize textarea
prompt.addEventListener("input", function() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});
