declare const self: SharedWorkerGlobalScope;
let i = 0;
console.log('worker', ++i);
const docMap: Record<string, Document> = {};

const getRandom = <TData>(list: TData[]) => {
  const index = Math.trunc(Math.random() / (1 / list.length));
  return list[index];
};

const splitDoc = (sections: gapi.client.Section[]) => {
  const entryList: gapi.client.Paragraph[][] = [];
  let entry: gapi.client.Paragraph[] = [];

  const checkAndAddEntry = () => {
    if (entry.length) {
      entryList.push(entry);
      entry = [];
    }
  };

  for (const section of sections) {
    if (
      'sectionBreak' in section ||
      section.paragraph.elements[0].textRun.content === '\n'
    ) {
      checkAndAddEntry();
      continue;
    }
    entry.push(section);
  }

  return entryList;
};

const generateHtml = (entry: gapi.client.Paragraph[]) => {
  let indentLevel: number = -1;
  let html = '<div>';

  console.log(entry);

  for (const {
    paragraph: { bullet, elements },
  } of entry) {
    const nextIndentLevel = bullet ? bullet.nestingLevel ?? 0 : -1;

    for (let i = 0; i < nextIndentLevel - indentLevel; ++i) {
      html += '\n<ul>';
    }

    for (let i = 0; i < indentLevel - nextIndentLevel; ++i) {
      html += '\n</ul>';
    }

    const content = elements
      .map(({ textRun: { content, textStyle } }) =>
        textStyle.bold ? `<b>${content}</b>` : `<span>${content}</span>`,
      )
      .join(' ');
    const wrappedContent = bullet ? `<li>${content}</li>` : `<p>${content}</p>`;
    html += '\n' + wrappedContent;
    indentLevel = nextIndentLevel;
  }

  for (let i = 0; i < indentLevel; ++i) {
    html += '\n</ul>';
  }

  html += '\n</div>';
  console.log(html);
  return html;
};

self.onconnect = ({ ports: [port] }) => {
  port.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
    switch (data.type) {
      case 'send-document':
        const {
          response: {
            result: {
              body: { content },
              documentId,
              title,
            },
          },
        } = data;
        docMap[documentId] = { entries: splitDoc(content), title };
        break;

      case 'request-entry': {
        const docIds = Object.keys(docMap);
        if (!docIds.length) break;
        const docId = getRandom(docIds);
        const { entries, title } = docMap[docId];
        const entry = getRandom(entries);
        const message: SendEntryMessage = {
          type: 'send-entry',
          title,
          html: generateHtml(entry),
        };
        port.postMessage(message);
        break;
      }

      default:
        break;
    }
  };
};

interface Document {
  title: string;
  entries: gapi.client.Paragraph[][];
}

export {};
