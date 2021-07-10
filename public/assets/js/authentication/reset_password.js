document.addEventListener("DOMContentLoaded", () => {
    handleVerificationForm()
})

function handleVerificationForm() {
    let sendCodeFormSubmitButton = document.querySelector('#send_code_form_submit_btn')
    sendCodeFormSubmitButton.addEventListener('click', () => {
        let phoneCode = document.querySelector("#phone_code_input").value
        let phone = document.querySelector("#phone_input").value
        let validated = validateForm({ phoneCode, phone})
        if (validated) submitLoginForm({ phoneCode, phone})
    })
}

function submitLoginForm ({ phoneCode, phone}) {
    $.ajax({
        url: "http://127.0.0.1:8000/api/auth/reset-password",
        method: "POST",
        data: { phoneCode, phone},
    }).done(response => {
        if (response.success) {
            window.location.replace('./reset_password_code.html')
        } else {
            if (typeof response.message === "string") helper.alertMessage(response.message, "error")
            else handleRequestError(response.message)
        }
    }).fail(err => {
        console.log(err)
    })
}

function validateForm ({ phoneCode, phone}) {
    let validated = true
    if (!phoneCode) {
        validated = false
        document.getElementById('phone_code_error_message').innerHTML = "Phone Code Empty"
    }
    if (!phone) {
        validated = false
        document.getElementById('phone_error_message').innerHTML = "Phone Empty"
    }
    return validated
}

function handleRequestError(message) {
    Object.keys(message).map(key => {
        if (key === "phoneCode") document.getElementById('phone_code_error_message').innerHTML = message[key].msg
        else if (key === "phone") document.getElementById('phone_error_message').innerHTML = message[key].msg
    })
}