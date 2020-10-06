"use strict";
const flashCard = document.getElementById("flashCard");
const worker = new Worker("./build/workers/docs.js", { type: "module" });
worker.onmessage = ({ data }) => (flashCard.innerHTML = data.html);
const handleClientLoad = () => {
    const handleSignInStatus = async (isSignedIn) => {
        if (isSignedIn) {
            const document = await gapi.client.docs.documents.get({
                documentId: "1VU4v9j6DpD05SKaLv1vOxaD0rFfZU75k6MWfTvGy_pA",
            });
            worker.postMessage(document);
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
//# sourceMappingURL=index.js.map