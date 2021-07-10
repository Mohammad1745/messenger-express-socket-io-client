document.addEventListener("DOMContentLoaded", () => {
    handleLoginForm()
})

function handleLoginForm() {
    let loginSubmitButton = document.querySelector('#login_form_submit_btn')
    loginSubmitButton.addEventListener('click', () => {
        let email = document.querySelector("#email_input").value
        let password = document.querySelector("#password_input").value
        let validated = validateForm({email, password})
        if (validated) submitLoginForm({email, password})
    })
}

function submitLoginForm ({email, password}) {
    $.ajax({
        url: "http://127.0.0.1:8000/api/auth/login",
        method: "POST",
        data: {
            email, password
        },
    }).done(response => {
        if (response.success) {
            localStorage.setItem('tokenType', response.data.authorization.tokenType)
            localStorage.setItem('token', response.data.authorization.token)
            if (response.data.isPhoneVerified) console.log('redirect to dashboard')
            else window.location.replace("./phone_verification.html")
        } else {
            if (typeof response.message === "string") helper.alertMessage(response.message, "error")
            else handleRequestError(response.message)
        }
    }).fail(err => {
        console.log(err)
    })
}

function validateForm ({ email, password}) {
    let validated = true
    if (!email) {
        validated = false
        document.getElementById('email_error_message').innerHTML = "Email Empty"
    }
    if (!password) {
        validated = false
        document.getElementById('password_error_message').innerHTML = "Password Empty"
    }
    return validated
}

function handleRequestError(message) {
    Object.keys(message).map(key => {
        if (key === "email") document.getElementById('email_error_message').innerHTML = message[key].msg
        else if (key === "password") document.getElementById('password_error_message').innerHTML = message[key].msg
    })
}