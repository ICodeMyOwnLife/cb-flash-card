"use strict";
const flashCardDiv = document.getElementById("flashCard");
const titleDiv = document.getElementById("title");
const nextButton = document.getElementById("nextButton");
const autoButton = document.getElementById("autoButton");
const worker = new Worker("./build/workers/docs.js", { type: "module" });
let timer;
const handleClientLoad = () => {
    const handleSignInStatus = async (isSignedIn) => {
        if (isSignedIn) {
            const response = await gapi.client.docs.documents.get({
                documentId: "1VU4v9j6DpD05SKaLv1vOxaD0rFfZU75k6MWfTvGy_pA",
            });
            const message = { type: "send-document", response };
            worker.postMessage(message);
        }
        else {
            gapi.auth2.getAuthInstance().signIn();
        }
    };
    gapi.load("client:auth2", async () => {
        try {
            await gapi.client.init({
                apiKey: "AIzaSyBklQPrj2iywyyeX-fNRTBwu8KsUvwz8EA",
                clientId: "41838176361-cdrdarlu5qihp51pruatn8d1cvcbf8ab.apps.googleusercontent.com",
                discoveryDocs: [
                    "https://docs.googleapis.com/$discovery/rest?version=v1",
                ],
                scope: "https://www.googleapis.com/auth/documents.readonly",
            });
            gapi.auth2.getAuthInstance().isSignedIn.listen(handleSignInStatus);
            handleSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        }
        catch (error) {
            console.error(error);
        }
    });
};
const requestEntry = () => {
    const message = { type: "request-entry" };
    worker.postMessage(message);
};
worker.onmessage = ({ data }) => {
    switch (data.type) {
        case "send-entry":
            const { html, title } = data;
            flashCardDiv.innerHTML = html;
            titleDiv.textContent = title;
            break;
        default:
            break;
    }
};
nextButton.onclick = () => {
    if (timer)
        clearInterval(timer);
    requestEntry();
};
autoButton.onclick = () => {
    if (timer)
        clearInterval(timer);
    timer = setInterval(requestEntry, 20000);
};
//# sourceMappingURL=index.js.map