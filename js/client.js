const socket = io('http://localhost:8000');
// get DOM elements in respective Js variable
const form = document.getElementById('sendMessage');
const messageInput = document.getElementById('inputMessage');
const messageContainer = document.querySelector(".chat-container");

// Audio then will play on recieving messages
var audio = new Audio('./sms.mp3');

//function which whill joined or leaves event info to the cantainer
const appendAddUser = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerHTML = '<span class="add">'+message+'</span>';
    messageElement.classList.add('add-friend')
    messageContainer.append(messageElement)
    //check the position 
    if (position == 'left') {
        audio.play()
    }
}

//Function which will send the message to the container
const appendMessage = (message, position)=>{
    const messageElement = document.createElement('div'); // Create the dive
    messageElement.innerHTML = message;
    messageElement.classList.add('message-box');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    //check the position
    if (position == 'friends') {
        audio.play()
    }
}

//where the message is submit then pass then node server
form.addEventListener('submit',(e)=>{
    e.preventDefault(); //Don't reload the window
    const message= messageInput.value;
    appendMessage(`you: ${message}`,'you'); // call the funxtion
    socket.emit('send', message); // send the node server
    messageInput.value= ''; // reset the value of input
});

//new users his/her name 
const username = prompt("Enter Your name to join");
socket.emit('new-user-joined', username);

//if the new user joins, let the server know
socket.on('user-joined', username =>{
    appendAddUser(`${username} add recently`,'left');
})


//where the messages recive the user ,let the server know
socket.on('receive', data =>{
    appendMessage(`${data.name}: ${data.message}`, 'friends');
});

//if the any user leaves ,let the server know
socket.on('left', name =>{
    appendAddUser(`${name} left the chat`,'left');
});