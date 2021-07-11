document.addEventListener("DOMContentLoaded", () => {
    helper.checkAlert()
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
    document.getElementById("first_name_input").value = user.firstName
    document.getElementById("last_name_input").value = user.lastName
    document.getElementById("email_input").value = user.email
    document.getElementById("phone_code_input").value = user.phoneCode
    document.getElementById("phone_input").value = user.phone
    document.getElementById("user_avatar").innerHTML = `<img src="${user.image}" height="200">`
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
        // let image = document.querySelector("#image_input").value
        // if (image) submitLoginForm(image)

        let formData = new FormData();
        let files = $('#image_input')[0].files
        // Check file selected or not
        if(files.length > 0 ){
            formData.append('image',files[0]);
            submitLoginForm(formData)
        }else{
            alert("Please select a file.");
        }
    })
}

function submitLoginForm (formData) {
        $.ajax({
            url: "http://127.0.0.1:8000/api/user/profile/upload-image",
            method: "POST",
            headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
            data: formData,
            contentType: false,
            processData: false,
        }).done(response => {
            response.success ?
                handleRequestSuccess(response)
                : handleRequestError(response)
        }).fail(err => {
            console.log(err)
        })
}

function handleRequestSuccess (response) {
    location.reload()
}

function handleRequestError(response) {
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