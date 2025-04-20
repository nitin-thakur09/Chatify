let chat = document.querySelectorAll(".chat-item");
let image = document.querySelector("#image");

// Load chats from local storage (if available)
let chats = JSON.parse(localStorage.getItem("chats")) || {
    "Kashmira": [
        { type: "received", text: "Hey, how are you?", time: "12:45 PM" },
        { type: "sent", text: "I’m good, thanks! How about you?", time: "12:46 PM" },
        { type: "received", text: "Doing well, just busy with work.", time: "12:47 PM" }
    ],
    "Naman Kumar": [
        { type: "received", text: "Hi! Are you free today?", time: "10:00 AM" },
        { type: "sent", text: "Yes, I am. What’s the plan?", time: "10:05 AM" },
        { type: "received", text: "Let’s meet at 2 PM at the café.", time: "10:10 AM" }
    ],
    "Nitin Thakur": [
        { type: "sent", text: "Is the meeting still on?", time: "9:00 AM" },
        { type: "received", text: "Yes, see you at 3 PM.", time: "9:05 AM" }
    ],
    "Sparsh goyal": [
        { type: "received", text: "Can you send me the files?", time: "8:30 AM" },
        { type: "sent", text: "Sure, give me a moment.", time: "8:32 AM" }
    ],
    "Pijus Das": [
        { type: "received", text: "Good morning!", time: "8:00 AM" },
        { type: "sent", text: "Good morning, Chris!", time: "8:02 AM" },
        { type: "received", text: "Have a great day ahead!", time: "8:05 AM" }
    ]
};

// Save chats to local storage
function saveChats() {
    localStorage.setItem("chats", JSON.stringify(chats));
}

// Load last opened chat on page load
document.addEventListener("DOMContentLoaded", () => {
    const lastOpenedChat = localStorage.getItem("lastOpenedChat");
    const lastOpenedProfile = localStorage.getItem("lastOpenedProfile");

    if (lastOpenedChat && chats[lastOpenedChat]) {
        openChat(lastOpenedChat);
    }

    if (lastOpenedProfile) {
        image.src = lastOpenedProfile; // Restore last profile picture
    }
});

function openChat(name) {
    const chatInfo = document.getElementById('chatInfo');
    chatInfo.innerHTML = `<h4>${name}</h4><p>Online</p>`;

    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';

    if (chats[name]) {
        chats[name].forEach((msg, index) => {
            const message = document.createElement('div');
            message.className = `message ${msg.type}`;
            message.innerHTML = `
                <div class="message-content">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
                <button class="delete-btn" onclick="deleteMessage('${name}', ${index})">🗑️</button>
            `;
            chatMessages.appendChild(message);
        });
    }

    // Save last opened chat to localStorage
    localStorage.setItem("lastOpenedChat", name);

    // Save profile picture of the selected chat
    let profileImage = document.querySelector(`.chat-item[data-name='${name}'] img`);
    if (profileImage) {
        image.src = profileImage.src;
        localStorage.setItem("lastOpenedProfile", profileImage.src);
    }
}

function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const chatMessages = document.getElementById("chatMessages");
    const messageText = messageInput.value.trim();
    const chatInfo = document.getElementById("chatInfo");

    if (!messageText || !chatInfo || !chatInfo.querySelector("h4")) return;

    const activeChatName = chatInfo.querySelector("h4").textContent;

    if (activeChatName && chats[activeChatName]) {
        const message = {
            type: "sent",
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        chats[activeChatName].push(message);
        saveChats(); // Save chat to local storage

        // Append message only to the active chat
        const newMessage = document.createElement("div");
        newMessage.className = "message sent";
        newMessage.innerHTML = `
            <div class="message-content">${messageText}</div>
            <div class="message-time">${message.time}</div>
            <button class="delete-btn" onclick="deleteMessage('${activeChatName}', ${chats[activeChatName].length - 1})">🗑️</button>
        `;
        chatMessages.appendChild(newMessage);
        messageInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Save last opened chat after sending a message
        localStorage.setItem("lastOpenedChat", activeChatName);
    }
}

function deleteMessage(name, index) {
    if (chats[name]) {
        chats[name].splice(index, 1); // Remove message
        saveChats(); // Save updated chat to local storage
        openChat(name); // Refresh chat view
    }
}

function filterChats() {
    const filter = document.getElementById('searchBar').value.toLowerCase();
    const chatItems = document.getElementById('chatList').children;
    for (let item of chatItems) {
        const name = item.querySelector('.chat-info h4').textContent.toLowerCase();
        if (name.includes(filter)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    }
}

// Ensure image updates only for selected chat
chat.forEach(e => {
    e.addEventListener("click", function () {
        image.src = e.children[0].src;
        localStorage.setItem("lastOpenedProfile", e.children[0].src); // Save profile picture
    });
});

// Enhance message with API request
async function enhanceMessage() {
    let input = document.getElementById("messageInput");
    let load = document.querySelector(".loading");

    if (!input.value.trim()) {
        alert("Nothing to enhance");
        return;
    }

    load.classList.toggle("hide");

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1:free",
                "messages": [{ "role": "user", "content": `${input.value} write sentence in correct way and only write answer not other thing` }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        const textt = data?.choices?.[0]?.message?.content || "Error: No response";
        input.value = textt;
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("Failed to enhance message: " + error.message);
    } finally {
        load.classList.toggle("hide");
    }
}
