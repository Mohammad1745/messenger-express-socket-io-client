let helper = {
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
    }
}