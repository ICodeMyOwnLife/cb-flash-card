interface SendDocumentMessage {
  type: "send-document";
  response: gapi.client.Response;
}

interface RequestEntryMessage {
  type: "request-entry";
}

interface SendEntryMessage {
  type: "send-entry";
  title: string;
  html: string;
}

type WorkerMessage =
  | SendDocumentMessage
  | RequestEntryMessage
  | SendEntryMessage;
