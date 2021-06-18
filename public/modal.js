miro.onReady(() => {
    withValidSelection(async function (widget, title, content) {
        if(title) {
            document.getElementById("title").value = title
        }
        // extract note content
        document.getElementById("content").value = content
        // create link
        let boardInfo = await miro.board.info.get()
        let widgetId = widget.id
        let widgetLink = "https://miro.com/app/board/" + boardInfo.id + "/?moveToWidget=" + widgetId
        document.getElementById("link").value = widgetLink
        // set user ID
        document.getElementById("userId").value = await miro.currentUser.getId()
    })
})

async function submitForm() {
    const data = {}
    document.getElementById("submit-form").querySelectorAll(".form-input").forEach(function (node) {
        data[node.id] = node.value
    })

    if(!data.title) {
        miro.showErrorNotification("Title must not be empty!")
        return
    }

    const response = await sendFormData(data)
    if(response.ok) {
        miro.showNotification("Note created")
    } else {
        console.log(response)
        miro.showErrorNotification("Note creation failed, please try again")
    }
    miro.board.ui.closeModal()
}

async function sendFormData(data) {
    return fetch("/api/miro/note", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data)
    })
}
