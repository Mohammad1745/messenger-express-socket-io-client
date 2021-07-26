let x=1;
let user = {}
let recipient = {}
let socket
document.addEventListener("DOMContentLoaded", () => {
    helper.userInfo(user)

    helper.checkAlert()
    helper.updateAvatar()
    helper.handleLogoutButton()

    handleSocketConnection()
    updateChatList()
})

function handleSocketConnection () {
    socket = io("http://127.0.0.1:8000")
    socket.on('connect', () => {
        console.log('connected')
    })
    socket.on('message' , message => {
        console.log(user, 'user')
        console.log(recipient, 'user')
        console.log(message, 'message')
        // if (message.sender===user.id && message.receiver===recipient.id)
        if (message.receiver===recipient.id)
            appendOutgoingMessage(message)
        // else if (message.receiver===user.id && message.sender===recipient.id)
        else
            appendIncomingMessage(message)
    })
}

function updateChatList() {
    $.ajax({
        url: helper.DOMAIN+"/api/user/chat",
        method: "GET",
        headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
    }).done(response => {
        response.success ?
            handleChatListRequestSuccess(response)
            : handleChatListRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleChatListRequestSuccess (response) {
    let chatList = document.getElementById('chat_list')
    chatList.innerHTML  = ''

    response.data.map(item => {
        let chat = item.chat.content ?
            item.chat.content.length>25 ?
                item.chat.content.substr(0, 25) + "..."
                : item.chat.content
            : "-"
        let avatar = helper.DOMAIN+"/uploads/avatar/"+item.image
        chatList.insertAdjacentHTML('beforeend', `
            <li class="chat-list-item p-2 cursor-pointer" id="chat_list_item" data-id="${item.userId}" data-name="${item.firstName} ${item.lastName}" data-avatar="${avatar}">
                <div class="user-name" id="user_name" data-id="${item.userId}"><img src="${avatar}" height="25" class="chat-user-name-avatar"> ${item.firstName} ${item.lastName}</div>
                <div class="last-message" id="last_message" data-id="${item.userId}">${chat}</div>
            </li>    
        `)
    })
    handleChatDetails()
}

function handleChatListRequestError(response) {
    if (response.message === "Unauthenticated") {
        window.location.replace('../authentication/login.html')
    }
    else {
        helper.alertMessage(response.message, "error")
    }
}

//Chat Details
function handleChatDetails() {
    let chatListItems = document.getElementById('chat_list').querySelectorAll('.chat-list-item')
    for (let item of chatListItems) {
        item.addEventListener('click', () => {
            recipient = {
                id: item.getAttribute('data-id'),
                name: item.getAttribute('data-name'),
                avatar: item.getAttribute('data-avatar')
            }
            updateChatDetails()
        })
    }
    handleSendMessageButton()
}

function updateChatDetails () {
    $.ajax({
        url: helper.DOMAIN+"/api/user/chat/details",
        method: "GET",
        headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
        data: {userId: recipient.id}
    }).done(response => {
        response.success ?
            handleChatDetailsRequestSuccess(response)
            : handleChatDetailsRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleChatDetailsRequestSuccess (response) {
    let chatUserName = document.getElementById('chat_user_name')
    let chatDetails = document.getElementById('chat_details')
    let sendMessageForm = document.getElementById('send_message_form')
    sendMessageForm.style.display = "block"
    chatUserName.style.borderBottom = "#333 2px solid"
    chatUserName.innerHTML = `<img src="${recipient.avatar}" height="35" class="chat-user-name-avatar"> ${recipient.name}`
    chatDetails.innerHTML = ''
    if (response.data.length===0) chatDetails.innerHTML = 'No message yet'

    // response.data.reverse()
    response.data.map(message => {
        if (message.senderId===recipient.id) appendIncomingMessage(message)
        else appendOutgoingMessage(message)
    })
}

function handleChatDetailsRequestError(response) {
    if (response.message === "Unauthenticated") {
        window.location.replace('../authentication/login.html')
    }
    else {
        helper.alertMessage(response.message, "error")
    }
}

//Sending Message
function handleSendMessageButton () {
    let sendMessageButton = document.getElementById('send_message_btn')
    sendMessageButton.addEventListener("click", () => {
        let message = document.getElementById('message_input').value
        if (message) handleSendingMessage(message)
    })
}

function handleSendingMessage (message) {
    $.ajax({
        url: helper.DOMAIN+"/api/user/chat/send-message",
        method: "POST",
        headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
        data: {userId:recipient.id, message}
    }).done(response => {
        response.success ?
            handleSendMessageRequestSuccess(message)
            : handleSendMessageRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleSendMessageRequestSuccess (message) {
    let messageInput = document.getElementById('message_input')
    messageInput.value = ''
    let time = helper.getTime(new Date())
    // appendOutgoingMessage({content:message, time})
    socket.emit("message", {sender:user.id, receiver: recipient.id, content:message, time})
}

function handleSendMessageRequestError(response) {
    if (response.message === "Unauthenticated") {
        window.location.replace('../authentication/login.html')
    }
    else {
        helper.alertMessage(response.message, "error")
    }
}

function appendIncomingMessage (message) {
    let time = message.time.length===5 ? helper.toAmPm(message.time) : message.time
    document.querySelector('#chat_details').insertAdjacentHTML('beforeend', `
        <li class="incoming-message-list" id="s${++x}">
            <div class="p-2 incoming-message-content">
                <img src="${recipient.avatar}" height="25" class="chat-user-name-avatar"> ${message.content}<span style="font-size: 9px;"> -${time}</span>
            </div>
        </li>
    `)
    document.querySelector('#chat_details').querySelector("#s"+x).scrollIntoView()
}

function appendOutgoingMessage (message) {
    let time = message.time.length===5 ? helper.toAmPm(message.time) : message.time
    document.querySelector('#chat_details').insertAdjacentHTML('beforeend', `
        <li class="outgoing-message-list" id="s${++x}">
            <div class="p-2 ml-auto outgoing-message-content">
                <span style="font-size: 9px;">${time} -</span> ${message.content}
            </div class="p-2" >
        </li>
    `)
    document.querySelector('#chat_details').querySelector("#s"+x).scrollIntoView({ behavior: 'smooth'})
}