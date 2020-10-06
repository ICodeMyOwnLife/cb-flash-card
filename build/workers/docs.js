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
        if ("sectionBreak" in section ||
            section.paragraph.elements[0].textRun.content === "\n") {
            checkAndAddEntry();
            continue;
        }
        entry.push(section);
    }
    return entryList;
};
const generateHtml = (entry) => {
    let indentLevel = 0;
    let html = "<div>";
    for (const { paragraph: { bullet, elements }, } of entry) {
        const nextIndentLevel = bullet ? bullet.nestingLevel ?? 0 : -1;
        if (nextIndentLevel > indentLevel) {
            html += "\n<ul>";
        }
        else if (nextIndentLevel < indentLevel) {
            html += "\n</ul>";
        }
        const content = elements
            .map(({ textRun: { content, textStyle } }) => textStyle.bold ? `<b>${content}</b>` : `<span>${content}</span>`)
            .join(" ");
        const wrappedContent = bullet ? `<li>${content}</li>` : `<p>${content}</p`;
        html += "\n" + wrappedContent;
        indentLevel = nextIndentLevel;
    }
    html += "\n</div>";
    return html;
};
self.onmessage = ({ data }) => {
    switch (data.type) {
        case "send-document":
            const { response: { result: { body: { content }, documentId, title, }, }, } = data;
            docMap[documentId] = { entries: splitDoc(content), title };
            break;
        case "request-entry": {
            const docIds = Object.keys(docMap);
            if (!docIds.length)
                break;
            const docId = getRandom(docIds);
            const { entries, title } = docMap[docId];
            const entry = getRandom(entries);
            const message = {
                type: "send-entry",
                title,
                html: generateHtml(entry),
            };
            self.postMessage(message);
            break;
        }
        default:
            break;
    }
};
export {};
//# sourceMappingURL=docs.js.map