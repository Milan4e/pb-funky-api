const WIDGET_TYPES = {
    "STICKER": {
        titleExtractor: function (widget) {
            return null
        },
        contentExtractor: function (widget) {
            return widget.text
        }
    },
    "CARD": {
        titleExtractor: function (widget) {
            return stripHtml(widget.title)
        },
        contentExtractor: function (widget) {
            return widget.description
        }
    },
    "TEXT": {
        titleExtractor: function (widget) {
            return null
        },
        contentExtractor: function (widget) {
            return widget.text
        }
    }
}

function stripHtml(html){
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

async function withValidSelection(action) {
    let currentSelection = await miro.board.selection.get()

    if(currentSelection.length === 0) {
        miro.showErrorNotification("Please select an object to convert to an insight");
        return;
    } else if(currentSelection.length > 1) {
        miro.showErrorNotification("Please select only one object to convert to an insight");
        return;
    }

    let widget = currentSelection[0]
    let extractors = WIDGET_TYPES[widget.type]
    if(!extractors) {
        miro.showErrorNotification("Only stickers, cards and texts can be converted to insights");
        return;
    }

    // try to extract title
    let title = extractors.titleExtractor(widget)
    // try to extract note content
    let content = extractors.contentExtractor(widget)
    if(!content) {
        miro.showErrorNotification("Cannot convert a " + widget.type.toLowerCase() + "  object with no content to insight");
        return;
    }

    action(widget, title, content)
}

async function auth() {
    // // State is an optional parameter.
    // // You can use it to pass extra parameters to the redirect URI page or for security purposes.
    // // See https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient,
    // const installState = await fetch(
    //     'https://proxy.schovi.cz/oauth/init',
    //     { credentials: 'same-origin' }
    // ).then(res => res.text())

    // Ask the user to authorize the app.
    await miro.requestAuthorization({
        // To successfully complete the miro.requestAuthorization call,
        // the redirect URI page must redirect the user back to Miro.
        // See the documentation below.
        redirect_uri: 'https://proxy.schovi.cz/oauth/install',
        // state: installState
    })
}

async function openModal() {
    console.log('open modal')
    const isAuthorized = await miro.isAuthorized()

    if (!isAuthorized) {
        await auth()

        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    withValidSelection(function () {
        miro.board.ui.openModal("public/modal.html", { width: 400, height: 450 })
    })
}
