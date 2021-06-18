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
        document.getElementById("widgetId").value = widgetId
    })
})

const pbTagName = "PB"

async function submitForm() {
    const data = {}
    document.getElementById("submit-form").querySelectorAll(".form-input").forEach(function (node) {
        data[node.id] = node.value
    })

    if(!data.title) {
        miro.showErrorNotification("Title must not be empty!")
        return
    }

    // set user ID
    data.userId = await miro.currentUser.getId()
    data.teamId = (await miro.account.get()).id

    const response = await sendFormData(data)
    if(response.ok) {
        miro.showNotification("Note created")
        const widgetId = document.getElementById("widgetId").value
        tagWidget(widgetId)
    } else {
        console.log(response)
        miro.showErrorNotification("Note creation failed, please try again")
    }
    miro.board.ui.closeModal()
}

async function tagWidget(widgetId) {
    // try to tag the object using a PB tag
    try {
        let pbTag = (await miro.board.tags.get()).filter(function(tag) {return tag.title === pbTagName})
        if (!pbTag.length) {
            pbTag = await miro.board.tags.create({ title: pbTagName, color: "#2d9bf0" })
        }
        pbTag = pbTag[0]
        const widgetIds = pbTag.widgetIds
        widgetIds.push(widgetId)
        await miro.board.tags.update({ id: pbTag.id, widgetIds: widgetIds })
    } catch (e) {
        // ignore
    }
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
