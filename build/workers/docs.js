console.log("Worker");
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
    const { result: { body: { content }, documentId, title, }, } = data;
    docMap[documentId] = { entries: splitDoc(content), title };
    console.log(data);
};
setInterval(() => {
    const docIds = Object.keys(docMap);
    if (!docIds.length)
        return;
    const docId = getRandom(docIds);
    const { entries, title } = docMap[docId];
    const entry = getRandom(entries);
    self.postMessage({ title, html: generateHtml(entry) });
}, 1000);
export {};
//# sourceMappingURL=docs.js.map