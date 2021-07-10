document.addEventListener("DOMContentLoaded", () => {
    let loginSubmitButton = document.querySelector('#login_submit_btn')
    loginSubmitButton.addEventListener('click', () => {
        let email = document.querySelector("#email_input").value
        let password = document.querySelector("#password_input").value
        submitLoginForm({email, password})
    })
})

function submitLoginForm ({email, password}) {
    $.ajax({
        url: "http://127.0.0.1:8000/api/auth/login",
        method: "POST",
        data: {
            email, password
        },
    }).done(response => {
        if (response.success) {
            console.log(response.message)
        } else {
            helper.alertMessage(response.message, "error")
        }
    }).fail(err => {
        console.log(err)
    })
}