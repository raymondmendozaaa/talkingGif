/* GIPHY */
const apiKEY = "dSF66nJh5E3O4LAuFTODSep2kA6eyPz3";
const page_SIZE = 10;
let offset = 0;
let total_count = 0;
let last_search = "";

function handlePrev() {
    if (offset >= page_SIZE) {
        offset -= page_SIZE;
        handleSearch();
    }
}
function handleNext() {
    if (offset <= (total_count+page_SIZE)) {
        offset += page_SIZE;
        handleSearch();
    }
}
function handleRandom() {
    console.log("handleRandom called");
    offset = 0;
    total_count = 0;
    navButtons();
    const search = document.getElementById("q").value;
    const elementOutputArea = document.getElementById("outputArea");
    let url = `http://api.giphy.com/v1/gifs/translate?api_key=${apiKEY}&s=${search}`;
    console.log('url=' + url);

    fetch(url, {method: "GET"})
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        const mp4 = json.data.images.fixed_height.url;
        const title = json.data.title;
        const img = `<img src="${mp4}" alt="${title}" />`;
        console.log('mp4=' + mp4);
        console.log('title=' + title);
        console.log('img);=' + img);

        elementOutputArea.innerHTML = img;
    });
}
function handleSearch() {
    console.log("handleSearch called");
    const search = document.getElementById("q").value;
    if (search != last_search)
        offset = 0;
    last_search = search;
    const elementOutputArea = document.getElementById("outputArea");
    let url = `http://api.giphy.com/v1/gifs/search?q=${search}&api_key=${apiKEY}&limit=${page_SIZE}&offset=${offset}`;
    console.log('url=' + url);

    fetch(url, {method: "GET"})
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            console.log(json.pagination);
            total_count = json.pagination.total_count;
            offset = json.pagination.offset;
            navButtons();

            elementOutputArea.innerHTML = "";
            for (let data of json.data) {
                const mp4 = data.images.fixed_height.url; 
                const title = data.title;
                const img =`<img src="${mp4}" alt="${title}" />`; 

                elementOutputArea.innerHTML += img;
            }
        })
}
function navButtons() {
    if (offset > 0)
        document.getElementById("prev").disabled = false;
    else
        document.getElementById("prev").disabled = true;
    if (total_count > 0 && offset <= (total_count+page_SIZE))
        document.getElementById("next").disabled = false;
    else
        document.getElementById("next").disabled = true;
}
/* Messaging */
const carlosSelectorBtn = document.querySelector('#carlos-selector');
const gioSelectorBtn = document.querySelector('#gio-selector');
const chatHeader = document.querySelector('.chat-header');
const chatMessages = document.querySelector('.chat-messages');
const chatInputForm = document.querySelector('.chat-input-form');
const chatInput = document.querySelector('.chat-input');
const clearChatBtn = document.querySelector('.clear-chat-button');

const messages = JSON.parse(localStorage.getItem('messages')) || []

const createChatMessageElement = (message) => `
    <div class="message ${message.sender === 'Carlos' ? 'blue-bg' : 'gray-bg'}">
    <div class="message-sender">${message.sender}</div>
    <div class="message-text">${message.text}</div>
    <div class="message-timestamp">${message.timestamp}</div>
    </div>
`

window.onload = () => {
    messages.forEach((message) => {
        chatMessages.innerHTML += createChatMessageElement(message)
    })
}

let messageSender = 'Carlos'

const updateMessageSender = (name) => {
    messageSender = name
    chatHeader.innerText = `${messageSender} is chatting...`
    chatInput.placeholder = `Type here, ${messageSender}...`

    if (name === 'Carlos') {
        carlosSelectorBtn.classList.add('active-person');
        gioSelectorBtn.classList.remove('active-person');
    }
    if (name === 'Giovanna') {
        gioSelectorBtn.classList.add('active-person');
        carlosSelectorBtn.classList.remove('active-person');
    }

    chatInput.focus();
}

carlosSelectorBtn.onclick = () => updateMessageSender('Carlos');
gioSelectorBtn.onclick = () => updateMessageSender('Giovanna');

const sendMessage = (e) => {
    e.preventDefault();

    const timestamp = new Date().toLocaleString(
        'en-Us', { hour: 'numeric', minute: 'numeric', hour12: true 

        })
    const message = {
        sender: messageSender,
        text: chatInput.value,
        timestamp,
    };

    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
    chatMessages.innerHTML += createChatMessageElement(message);

    chatInputForm.reset();
    chatMessages.scrollTop = chatMessages.scrollHeight
}

chatInputForm.addEventListener('submit', sendMessage);

clearChatBtn.addEventListener('click', () => {
    localStorage.clear()
    chatMessages.innerHTML = ''
})