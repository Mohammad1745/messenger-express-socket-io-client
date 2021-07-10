document.addEventListener("DOMContentLoaded", () => {
    countdown()
    handleVerificationForm()
})

function countdown() {
    let form = '<a class="btn p-0 fw-bold text-secondary" id="resend_phone_verification_code_btn">Resend Verification Code</a>\n' +
        '       <span>, if you haven\'t got yet.</span>'
    let sec=20
    setTimeout(count, 1000)
    function count(){
        sec--
        if(sec>0){
            document.querySelector('#resend-code-content').innerHTML = `You should get code within ${sec}s`
            setTimeout(count, 1000);
        }else{
            document.querySelector('#resend-code-content').innerHTML = form
            handleResendCodeButton()
        }
    }
}

function handleResendCodeButton() {
    let resendCodeButton = document.querySelector('#resend_phone_verification_code_btn')
    resendCodeButton.addEventListener('click', () => {
        $.ajax({
            url: "http://127.0.0.1:8000/api/auth/resend-phone-verification-code",
            method: "GET",
            headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
        }).done(response => {
            if (response.success) {
                helper.alertMessage(response.message, "success")
            } else {
                helper.alertMessage(response.message, "error")
            }
        }).fail(err => {
            console.log(err)
        })
    })
}

function handleVerificationForm() {
    let phoneVerificationSubmitButton = document.querySelector('#verification_form_submit_btn')
    phoneVerificationSubmitButton.addEventListener('click', () => {
        let phoneCode = document.querySelector("#phone_code_input").value
        let phone = document.querySelector("#phone_input").value
        let code = document.querySelector("#verification_code_input").value
        let validated = validateForm({ phoneCode, phone, code})
        if (validated) submitLoginForm({ phoneCode, phone, code})
    })
}

function submitLoginForm ({ phoneCode, phone, code}) {
    $.ajax({
        url: "http://127.0.0.1:8000/api/auth/phone-verification",
        method: "PUT",
        headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
        data: { phoneCode, phone, code},
    }).done(response => {
        if (response.success) {
            window.location.replace('./login.html')
        } else {
            if (typeof response.message === "string") helper.alertMessage(response.message, "error")
            else handleRequestError(response.message)
        }
    }).fail(err => {
        console.log(err)
    })
}

function validateForm ({ phoneCode, phone, code}) {
    let validated = true
    if (!phoneCode) {
        validated = false
        document.getElementById('phone_code_error_message').innerHTML = "Phone Code Empty"
    }
    if (!phone) {
        validated = false
        document.getElementById('phone_error_message').innerHTML = "Phone Empty"
    }
    if (!code) {
        validated = false
        document.getElementById('phone_code_error_message').innerHTML = "Code Empty"
    }
    return validated
}

function handleRequestError(message) {
    Object.keys(message).map(key => {
        if (key === "phoneCode") document.getElementById('phone_code_error_message').innerHTML = message[key].msg
        else if (key === "phone") document.getElementById('phone_error_message').innerHTML = message[key].msg
        else if (key === "code") document.getElementById('phone_code_error_message').innerHTML = message[key].msg
    })
}