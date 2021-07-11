let helper = {
    DOMAIN: "http://127.0.0.1:8000",

    alertMessage : (message, type="success") => {
        let content = `<div style="position: absolute; left: 0; top: 0; width: 100%; z-index: 100">`
        if(type==="success") {
            content += `
                <div class="alert-float alert alert-success alert-dismissable">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>
                    ${message}
                </div>`
        }
        else {
            content += `
                <div class="alert-float alert alert-danger alert-dismissable">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">x</button>
                    ${message}
                </div>`
        }
        content+= `</div>`
        document.body.insertAdjacentHTML('beforeend', content)
        setTimeout(() => {
            document.querySelector('.close').click()
        }, 2000)
    },

    checkAlert: () => {
        let success = localStorage.getItem('success')
        let error = localStorage.getItem('error')
        if (success) {
            localStorage.removeItem("success")
            helper.alertMessage(success, "success")
        }
        else if (error) {
            localStorage.removeItem("error")
            helper.alertMessage(error, "error")
        }
    },

    handleLogoutButton:() => {
        let logoutButton = document.querySelector('#logout_btn')
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem("tokenType")
            localStorage.removeItem("token")
            localStorage.setItem('success', "Logged Out Successfully.")
            window.location.replace('../authentication/login.html')
        })
    },
    updateAvatar:() => {
        $.ajax({
            url: "http://127.0.0.1:8000/api/user/profile",
            method: "GET",
            headers: { authorization: localStorage.getItem("tokenType") + " " + localStorage.getItem("token")},
        }).done(response => {
            if (response.success) {
                let image = helper.DOMAIN+"/uploads/avatar/"+response.data.image
                $("#avatar").attr("src", image)
            } else {
                window.location.replace("../authentication/login.html")
            }
        }).fail(err => {
            console.log(err)
        })
    }
}
