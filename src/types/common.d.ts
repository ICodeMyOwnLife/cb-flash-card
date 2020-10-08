interface SendDocumentMessage {
  type: 'send-document';
  response: gapi.client.Response;
}

interface RequestEntryMessage {
  type: 'request-entry';
}

interface SendEntryMessage {
  type: 'send-entry';
  title: string;
  html: string;
}

interface SendTitlesMessage {
  type: 'send-titles';
  titles: string[];
}

type WorkerMessage =
  | SendDocumentMessage
  | RequestEntryMessage
  | SendEntryMessage
  | SendTitlesMessage;

namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_GAPI_CLIENT_ID: string;
    REACT_APP_PHRASAL_VERBS_DOC_ID: string;
    REACT_APP_WORDS_DOC_ID: string;
    REACT_APP_IDIOMS_DOC_ID: string;
  }
}
