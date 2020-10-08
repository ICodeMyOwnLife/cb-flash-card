let i = 0;
console.log('worker', ++i);
const docMap = {};
const getRandom = (list) => {
    const index = Math.trunc(Math.random() / (1 / list.length));
    return list[index];
};
const splitDoc = (sections) => {
    const entryList = [];
    let entry = [];
    const checkAndAddEntry = () => {
        if (entry.length) {
            entryList.push(entry);
            entry = [];
        }
    };
    for (const section of sections) {
        if ('sectionBreak' in section ||
            section.paragraph.elements[0].textRun.content === '\n') {
            checkAndAddEntry();
            continue;
        }
        entry.push(section);
    }
    return entryList;
};
const generateHtml = (entry) => {
    let indentLevel = -1;
    let html = '<div>';
    console.log(entry);
    for (const { paragraph: { bullet, elements }, } of entry) {
        const nextIndentLevel = bullet ? bullet.nestingLevel ?? 0 : -1;
        for (let i = 0; i < nextIndentLevel - indentLevel; ++i) {
            html += '\n<ul>';
        }
        for (let i = 0; i < indentLevel - nextIndentLevel; ++i) {
            html += '\n</ul>';
        }
        const content = elements
            .map(({ textRun: { content, textStyle } }) => textStyle.bold ? `<b>${content}</b>` : `<span>${content}</span>`)
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
    port.onmessage = ({ data }) => {
        console.log(data);
        switch (data.type) {
            case 'send-document': {
                const { response: { result: { body: { content }, documentId, title, }, }, } = data;
                docMap[documentId] = { entries: splitDoc(content), title };
                const msg = {
                    type: 'send-titles',
                    titles: Object.values(docMap).map(({ title }) => title),
                };
                port.postMessage(msg);
                break;
            }
            case 'request-entry': {
                const docIds = Object.keys(docMap);
                if (!docIds.length)
                    break;
                const docId = getRandom(docIds);
                const { entries, title } = docMap[docId];
                const entry = getRandom(entries);
                const msg = {
                    type: 'send-entry',
                    title,
                    html: generateHtml(entry),
                };
                port.postMessage(msg);
                break;
            }
            default:
                break;
        }
    };
};
export {};
