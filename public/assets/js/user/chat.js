document.addEventListener("DOMContentLoaded", () => {
    helper.checkAlert()
    helper.updateAvatar()
    helper.handleLogoutButton()

    updateChatList()
})

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
        let chat = item.chat.content? item.chat.content : "-"
        chatList.insertAdjacentHTML('beforeend', `
            <li class="chat-list-item p-2" id="chat_list_item" data-id="${item.userId}">
                <div class="user-name" id="user_name" data-id="${item.userId}">${item.firstName} ${item.lastName}</div>
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
    else if (typeof response.message === "string") {
        helper.alertMessage(response.message, "error")
    }
    else {
        Object.keys(response.message).map(key => {
            if (key === "email") document.getElementById('email_error_message').innerHTML = response.message[key].msg
            else if (key === "password") document.getElementById('password_error_message').innerHTML = response.message[key].msg
        })
    }
}

//Chat Details
function handleChatDetails() {
    let chatListItems = document.getElementById('chat_list').querySelectorAll('.chat-list-item')
    for (let item of chatListItems) {
        item.addEventListener('click', event => {
            let userId = event.target.getAttribute('data-id')
            updateChatDetails(userId)
        })
    }
}

function updateChatDetails (userId) {
    let chatDetails = document.getElementById('chat_details')
    chatDetails.innerHTML = userId
}