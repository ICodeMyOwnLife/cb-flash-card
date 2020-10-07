const worker = new SharedWorker('workers/docs.js', { type: 'module' });

(window as any).handleClientLoad = () => {
  const handleSignInStatus = async (isSignedIn: boolean) => {
    if (isSignedIn) {
      const response = await gapi.client.docs.documents.get({
        documentId: '1VU4v9j6DpD05SKaLv1vOxaD0rFfZU75k6MWfTvGy_pA',
      });
      const message: SendDocumentMessage = { type: 'send-document', response };
      worker.port.postMessage(message);
    } else {
      gapi.auth2.getAuthInstance().signIn();
    }
  };

  gapi.load('client:auth2', async () => {
    try {
      await gapi.client.init({
        apiKey: 'AIzaSyBklQPrj2iywyyeX-fNRTBwu8KsUvwz8EA',
        clientId:
          '41838176361-cdrdarlu5qihp51pruatn8d1cvcbf8ab.apps.googleusercontent.com',
        discoveryDocs: [
          'https://docs.googleapis.com/$discovery/rest?version=v1',
        ],
        scope: 'https://www.googleapis.com/auth/documents.readonly',
      });

      gapi.auth2.getAuthInstance().isSignedIn.listen(handleSignInStatus);
      handleSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    } catch (error) {
      console.error(error);
    }
  });
};

export {};
