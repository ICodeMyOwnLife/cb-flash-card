declare namespace gapi.client {
  export interface SectionBreak {
    endIndex: number;
    sectionBreak: {
      sectionStyle: {
        columnSeparatorStyle: string;
        contentDirection: string;
        sectionType: string;
      };
    };
  }

  interface Sizing {
    magnitude: number;
    unit: string;
  }

  interface FontProps {
    fontFamily?: string;
    weight?: number;
  }

  export interface TextStyle {
    bold?: boolean;
    fontSize?: Sizing;
    foregroundColor: object;
    underline?: boolean;
    weightedFontFamily?: FontProps;
  }

  export interface ParagraphStyle {
    direction?: string;
    indentFirstLine?: Sizing;
    indentStart?: Sizing;
    namedStyleType?: string;
    spaceAbove?: Sizing;
    spaceBelow?: Sizing;
  }

  interface ParagraphElement {
    endIndex: number;
    startIndex: number;
    textRun: {
      content: string;
      textStyle: TextStyle;
    };
  }

  interface Bullet {
    listId: string;
    nestingLevel?: number;
    textStyle: TextStyle;
  }

  export interface Paragraph {
    endIndex: number;
    paragraph: {
      bullet?: Bullet;
      elements: ParagraphElement[];
      paragraphStyle: ParagraphStyle;
      startIndex: number;
    };
    startIndex: number;
  }

  export type Section = SectionBreak | Paragraph;

  export interface Result {
    body: {
      content: Section[];
    };
    documentId: string;
    documentStyle: Record<string, unknown>;
    lists: Record<string, unknown>;
    nameStyles: {
      styles: unknown[];
    };
    revisionId: string;
    suggestionViewMode: string;
    title: string;
  }

  export interface Response {
    body: string;
    headers: Record<string, string>;
    result: Result;
    status: number;
    statusText: string | null;
  }

  export interface Documents {
    batchUpdate: () => void;
    create: () => void;
    get: (request: { documentId: string }) => Promise<Response>;
  }

  export interface Docs {
    documents: Documents;
  }

  export const docs: Docs;
}
