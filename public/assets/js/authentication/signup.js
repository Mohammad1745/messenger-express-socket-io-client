document.addEventListener("DOMContentLoaded", () => {
    let loginSubmitButton = document.querySelector('#register_form_submit_btn')
    loginSubmitButton.addEventListener('click', () => {
        let firstName = document.querySelector("#first_name_input").value
        let lastName = document.querySelector("#last_name_input").value
        let phoneCode = document.querySelector("#phone_code_input").value
        let phone = document.querySelector("#phone_input").value
        let email = document.querySelector("#email_input").value
        let password = document.querySelector("#password_input").value
        let confirmPassword = document.querySelector("#confirm_password_input").value
        let validated = validateForm({ firstName, lastName, phoneCode, phone, email, password, confirmPassword})
        if (validated) submitLoginForm({ firstName, lastName, phoneCode, phone, email, password, confirmPassword})
    })
})

function submitLoginForm ({ firstName, lastName, phoneCode, phone, email, password, confirmPassword}) {
    $.ajax({
        url: "http://127.0.0.1:8000/api/auth/register",
        method: "POST",
        data: { firstName, lastName, phoneCode, phone, email, password, confirmPassword},
    }).done(response => {
        if (response.success) {
            console.log(response.message)
        } else {
            if (typeof response.message === "string") helper.alertMessage(response.message, "error")
            else handleRequestError(response.message)
        }
    }).fail(err => {
        console.log(err)
    })
}

function validateForm ({ firstName, lastName, phoneCode, phone, email, password, confirmPassword}) {
    let validated = true
    if (!firstName) {
        validated = false
        document.getElementById('first_name_error_message').innerHTML = "First Name Empty"
    }
    if (!lastName) {
        validated = false
        document.getElementById('last_name_error_message').innerHTML = "Last Name Empty"
    }
    if (!phoneCode) {
        validated = false
        document.getElementById('phone_code_error_message').innerHTML = "Phone Code Empty"
    }
    if (!phone) {
        validated = false
        document.getElementById('phone_error_message').innerHTML = "Phone Empty"
    }
    if (!email) {
        validated = false
        document.getElementById('email_error_message').innerHTML = "Email Empty"
    }
    if (!password) {
        validated = false
        document.getElementById('password_error_message').innerHTML = "Password Empty"
    }
    if (!confirmPassword) {
        validated = false
        document.getElementById('confirm_password_error_message').innerHTML = "Confirm Password Empty"
    }
    return validated
}

function handleRequestError(message) {
    Object.keys(message).map(key => {
        if (key === "firstName") document.getElementById('first_name_error_message').innerHTML = message[key].msg
        else if (key === "lastName") document.getElementById('last_name_error_message').innerHTML = message[key].msg
        else if (key === "phoneCode") document.getElementById('phone_code_error_message').innerHTML = message[key].msg
        else if (key === "phone") document.getElementById('phone_error_message').innerHTML = message[key].msg
        else if (key === "email") document.getElementById('email_error_message').innerHTML = message[key].msg
        else if (key === "password") document.getElementById('password_error_message').innerHTML = message[key].msg
        else if (key === "confirmPassword") document.getElementById('confirm_password_error_message').innerHTML = message[key].msg
    })
}