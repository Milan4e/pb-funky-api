miro.onReady(() => {
    withValidSelection(async function (widget, title, content) {
        if(title) {
            document.getElementById("title").value = title
        }
        // extract note content
        document.getElementById("content").value = content
        // create link
        let boardId = await miro.board.info.get()
        let widgetId = widget.id
        let widgetLink = "https://miro.com/app/board/" + boardId + "/?moveToWidget=" + widgetId
        document.getElementById("link").value = widgetLink
    })
})
