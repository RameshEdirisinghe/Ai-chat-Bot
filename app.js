let chatsArray = [];
let messageDiv = document.getElementById("textbody");
const sendButton = document.getElementById("sendButton");
const textInput = document.getElementById("textInput");

sendButton.addEventListener("click", send);
textInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") send();
});

async function send() {
    const userMessage = textInput.value.trim();
    if (!userMessage) return;

    const timestamp = getTime();
    textInput.value = "";

    addMessage("Me", userMessage, timestamp);
    try {
        const aiResponse = await getAIResponse(userMessage);
        addMessage("AI", aiResponse, getTime());
    } catch (error) {
        addMessage("AI", "Sorry, something went wrong!", getTime());
    }
}

function getTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

async function getAIResponse(userMessage) {
    console.log("Sending request to AI API...");
    const headers = { "Content-Type": "application/json" };

    const body = JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }],
    });

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=",
            { method: "POST", headers, body }
        );

        console.log("API Response:", response);

        if (!response.ok) {
            console.error("API Error:", response.status, response.statusText);
            throw new Error("API returned an error");
        }

        const result = await response.json();
        console.log("Result:", result);

        const aiMessage = result.candidates[0]?.content?.parts[0]?.text;
        return aiMessage || "No response from AI";
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}


function addMessage(sender, message, time) {
    const bubbleClass = sender === "Me" ? "me" : "ai";
    const messageHTML = `
        <div class="message ${bubbleClass}">
            <div class="bubble">${message}</div>
            <div class="time">${time}</div>
        </div>
    `;
    messageDiv.insertAdjacentHTML("beforeend", messageHTML);
    messageDiv.scrollTop = messageDiv.scrollHeight;
}




