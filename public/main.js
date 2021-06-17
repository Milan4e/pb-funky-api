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
            return widget.title
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

function openModal() {
    withValidSelection(function () {
        miro.board.ui.openModal("modal.html", { width: 400, height: 450 })
    })
}
