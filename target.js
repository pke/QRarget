(function () {
    var shareOperation = null;

    function id(elementId) {
        return document.getElementById(elementId);
    }

    function displayContent(label, content, preformatted) {
        var labelNode = document.createElement("strong");
        labelNode.innerText = label;

        id("contentValue").appendChild(labelNode);

        if (preformatted) {
            var pre = document.createElement("pre");
            pre.innerHTML = content;
            id("contentValue").appendChild(pre);
        }
        else {
            id("contentValue").appendChild(document.createTextNode(content));
        }
        id("contentValue").appendChild(document.createElement("br"));
    }

    function activatedHandler(eventArgs) {
        if (eventArgs.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.shareTarget) {
            shareOperation = eventArgs.detail.shareOperation;
            id("title").innerText = shareOperation.data.properties.title;
            id("description").innerText = shareOperation.data.properties.description;
            if (shareOperation.data.contains(Windows.ApplicationModel.DataTransfer.StandardDataFormats.text)) {
                shareOperation.data.getTextAsync().then(function (text) {
                  if (text !== null) {
                      displayContent("Uri: ", text, false);
                      var codeImage = showQRCode(text);
                      id("imageHolder").src = codeImage;
                      id("imageArea").className = "unhidden";
                      WinJS.UI.Animation.fadeOut(window.progress);
                    }
                });
            }
            if (shareOperation.data.contains(Windows.ApplicationModel.DataTransfer.StandardDataFormats.uri)) {
                shareOperation.data.getUriAsync().then(function (uri) {
                    if (uri !== null) {
                      displayContent("Uri: ", uri.absoluteUri, false);
                      var codeImage = showQRCode(uri.absoluteUri);
                      id("imageHolder").src = codeImage;
                      id("imageArea").className = "unhidden";
                      WinJS.UI.Animation.fadeOut(window.progress);
                    }
                });
            }
        }
    }

  
    function reportError() {
        var errorText = id("extendedShareErrorMessage").value;
        shareOperation.reportError(errorText);
        id("appBody").innerHTML = "<p>The sharing operation was reported with error:" + errorText + "</p><br/>";
    }

    function reportCompleted() {
        shareOperation.reportCompleted();
        id("appBody").innerHTML = "<p>The sharing operation has been reported as complete.</p>";
    }

    WinJS.Application.addEventListener("activated", activatedHandler, false);

    WinJS.Application.start();

    function initialize() {
        id("reportCompleted").addEventListener("click", /*@static_cast(EventListener)*/reportCompleted, false);
    }

    document.addEventListener("DOMContentLoaded", initialize, false);
})();
