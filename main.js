import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import { maybeShowApiKeyBanner } from './gemini-api-banner';
import './style.css';

let API_KEY = 'AIzaSyAniUBMi3Mgos4XhB1yZ60w39hqHvJ81DQ'; // Replace with your actual API key

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');
let imagePreview = document.querySelector('.image-preview');
let chatHistory = [];

document.getElementById('fileInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Hold tight, let me think...';

  try {
    // Load the image as a base64 string
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    let imageBase64 = '';
    if (file) {
      imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    }

    // Assemble the prompt by combining the text with the chosen image
    let contents = [
      {
        role: 'user',
        parts: []
      }
    ];

    if (imageBase64) {
      contents[0].parts.push({ inline_data: { mime_type: 'image/jpeg', data: imageBase64 } });
    }
    contents[0].parts.push({
      text: `Talk like you're a human ${promptInput.value} but limit it to 500 characters. Add an invisible space between paragraphs.`
    });

    // Save the prompt to the chat history
    // chatHistory.push({ role: 'user', content: promptInput.value });

    // Call the multimodal model, and get a stream of results
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // or gemini-1.5-pro
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });


    const result = await model.generateContentStream({ contents });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      output.innerHTML = md.render(buffer.join(''));
    }

    // Save the response to the chat history
    chatHistory.push({ role: 'assistant', content: buffer.join('') });

  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};

// Function to display chat history
// const displayChatHistory = () => {
//   let historyContainer = document.querySelector('.chat-history');
//   historyContainer.innerHTML = '';
//   chatHistory.forEach(entry => {
//     let role = entry.role === 'user' ? 'User' : 'Assistant';
//     let div = document.createElement('div');
//     div.className = entry.role;
//     div.textContent = ${role} ${entry.content};
//     historyContainer.appendChild(div);
//   });
// };

// You can delete this once you've filled out an API key
maybeShowApiKeyBanner(API_KEY);

// Periodically update chat history
setInterval(displayChatHistory, 1000);