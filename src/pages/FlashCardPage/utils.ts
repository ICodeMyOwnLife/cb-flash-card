import { useRef, useEffect, useCallback, useState, RefObject } from 'react';
import { useScript } from 'cb-hooks';
import { EntryInfo } from '../../components/FlashCard';
import {
  GAPI_CLIENT_ID,
  IDIOMS_DOC_ID,
  PHRASAL_VERBS_DOC_ID,
  WORDS_DOC_ID,
} from '../../constants/common';

const requestEntryMessage: RequestEntryMessage = { type: 'request-entry' };

const requestEntry = (workerRef: RefObject<SharedWorker | undefined>) => {
  workerRef.current?.port.postMessage(requestEntryMessage);
};

const useDocsWorker = () => {
  const [entryInfo, setEntryInfo] = useState<EntryInfo>();
  const [titles, setTitles] = useState<string[]>();
  const workerRef = useRef<SharedWorker>();

  useEffect(() => {
    const worker = new SharedWorker('workers/docs.js', { type: 'module' });
    worker.port.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
      switch (data.type) {
        case 'send-entry': {
          const { html, title } = data;
          setEntryInfo({ html, title });
          break;
        }

        case 'send-titles':
          setTitles(data.titles);
          break;

        default:
          break;
      }
    };
    workerRef.current = worker;
    return () => worker.port.close();
  }, []);

  return { entryInfo, titles, workerRef };
};

const useGapi = ({
  workerRef,
}: {
  workerRef: RefObject<SharedWorker | undefined>;
}) =>
  useScript({ src: 'https://apis.google.com/js/api.js' }, () => {
    const handleGapiSignIn = async (isSignedIn: boolean) => {
      if (isSignedIn) {
        [WORDS_DOC_ID, PHRASAL_VERBS_DOC_ID, IDIOMS_DOC_ID].forEach(
          async documentId => {
            const response = await gapi.client.docs.documents.get({
              documentId,
            });
            const msg: SendDocumentMessage = {
              type: 'send-document',
              response,
            };
            workerRef.current?.port.postMessage(msg);
          },
        );
      } else {
        gapi.auth2.getAuthInstance().signIn();
      }
    };

    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          clientId: GAPI_CLIENT_ID,
          discoveryDocs: [
            'https://docs.googleapis.com/$discovery/rest?version=v1',
          ],
          scope: 'https://www.googleapis.com/auth/documents.readonly',
        });

        gapi.auth2.getAuthInstance().isSignedIn.listen(handleGapiSignIn);
        handleGapiSignIn(gapi.auth2.getAuthInstance().isSignedIn.get());
      } catch (error) {
        console.error(error);
      }
    });
  });

export const useFlashCardPage = () => {
  const { entryInfo, workerRef } = useDocsWorker();
  const timerRef = useRef<NodeJS.Timeout>();
  useGapi({ workerRef });

  const handleClickAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => requestEntry(workerRef), 20000);
  }, [workerRef]);

  const handleClickNext = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    requestEntry(workerRef);
  }, [workerRef]);

  return { entryInfo, handleClickAuto, handleClickNext };
};
