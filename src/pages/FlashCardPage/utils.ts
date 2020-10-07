import {
  useRef,
  useEffect,
  useCallback,
  MutableRefObject,
  useState,
} from 'react';
import { EntryInfo } from '../../components/FlashCard';

const requestEntryMessage: RequestEntryMessage = { type: 'request-entry' };

const requestEntry = (
  workerRef: MutableRefObject<SharedWorker | undefined>,
) => {
  workerRef.current?.port.postMessage(requestEntryMessage);
};

export const useFlashCardPage = () => {
  const [entryInfo, setEntryInfo] = useState<EntryInfo>();
  const workerRef = useRef<SharedWorker>();
  const timerRef = useRef<NodeJS.Timeout>();

  const handleClickAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => requestEntry(workerRef), 20000);
  }, []);

  const handleClickNext = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    requestEntry(workerRef);
  }, []);

  useEffect(() => {
    const worker = new SharedWorker('workers/docs.js', { type: 'module' });
    worker.port.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
      switch (data.type) {
        case 'send-entry': {
          const { html, title } = data;
          setEntryInfo({ html, title });
          break;
        }

        default:
          break;
      }
    };
    workerRef.current = worker;
    return () => worker.port.close();
  }, []);

  return { entryInfo, handleClickAuto, handleClickNext };
};
