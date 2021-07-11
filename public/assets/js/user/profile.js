document.addEventListener("DOMContentLoaded", () => {
    helper.checkAlert()
    helper.updateAvatar()
    helper.handleLogoutButton()

    addProfileInfo()
    handleUpdateImageForm()
})

function addProfileInfo() {
    $.ajax({
        url: "http://127.0.0.1:8000/api/user/profile",
        method: "GET",
        headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
    }).done(response => {
        response.success ?
            handleProfileInfoRequestSuccess(response)
            : handleProfileInfoRequestError(response)
    }).fail(err => {
        console.log(err)
    })
}

function handleProfileInfoRequestSuccess (response) {
    let user = response.data
    let image = helper.DOMAIN+"/uploads/avatar/"+user.image
    document.getElementById("first_name_input").value = user.firstName
    document.getElementById("last_name_input").value = user.lastName
    document.getElementById("email_input").value = user.email
    document.getElementById("phone_code_input").value = user.phoneCode
    document.getElementById("phone_input").value = user.phone
    document.getElementById("user_avatar").innerHTML = `<img src="${image}" height="200">`
}

function handleProfileInfoRequestError(response) {
    if (typeof response.message === "string") {
        helper.alertMessage(response.message, "error")
    }
    else {
        Object.keys(response.message).map(key => {
            if (key === "email") document.getElementById('email_error_message').innerHTML = response.message[key].msg
            else if (key === "password") document.getElementById('password_error_message').innerHTML = response.message[key].msg
        })
    }
}

function handleUpdateImageForm() {
    let updateImageFormSubmitButton = document.querySelector('#upload_image_form_submit_btn')
    updateImageFormSubmitButton.addEventListener('click', () => {
        let formData = new FormData();
        let files = $('#image_input')[0].files

        if(files.length > 0 ){
            formData.append('image',files[0]);
            submitUserAvatarForm(formData)
        }else{
            helper.alertMessage("Please select a file.", "error");
        }
    })
}

function submitUserAvatarForm (formData) {
        $.ajax({
            url: "http://127.0.0.1:8000/api/user/profile/upload-image",
            method: "POST",
            headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
            data: formData,
            contentType: false,
            processData: false,
        }).done(response => {
            response.success ?
                handleAvatarFormRequestSuccess(response)
                : handleAvatarFormRequestError(response)
        }).fail(err => {
            console.log(err)
        })
}

function handleAvatarFormRequestSuccess (response) {
    let image = helper.DOMAIN+"/uploads/avatar/"+response.data.image
    document.getElementById("user_avatar").innerHTML = `<img src="${image}" height="200">`
    helper.updateAvatar()
    helper.alertMessage(response.message, "success");
    document.getElementById("image_input").value = ''
}

function handleAvatarFormRequestError(response) {
    helper.alertMessage(response.message, "error")
}