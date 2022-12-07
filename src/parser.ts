import { Model } from "./extension.type";

export class Parser {

  public toJson(stringModel: string, interfaceName: string): Model {
    console.log('in: ', stringModel);
    return this.parseToObjectModel(stringModel, interfaceName);
  }

  private parseToObjectModel(stringModel: string, interfaceName: string): Model {
    stringModel = this.removeSpaces(stringModel);
    // stringModel = this.removeSuperfluousSubstring(stringModel);
    // stringModel = this.removeCommaBeforeBracket(stringModel);
    // stringModel = this.fixesQuotes(stringModel);
    // stringModel = this.keyQuotes(stringModel);

    console.log('out: ', stringModel);

    return { [interfaceName]: JSON.parse(stringModel)};
  };

  private removeSpaces(stringModel: string): string {
    const spacePattern = /[\s | \n | \t]/g;
    const result = stringModel.replace(spacePattern, '');

    return result;
  };

  private removeSuperfluousSubstring(stringModel: string): string {
    const preparationPattern = /^[^{:,]+:[^,]+,/g;
    const lineStartPattern = /^[^[{]*(?=[[{])/g;
    const lineEndPattern = /[^\]}]+$/g;

    stringModel = stringModel.replace(lineStartPattern, '');
    if (stringModel.match(preparationPattern)) {
      stringModel = `{${stringModel}}`;
    };
    stringModel = stringModel.replace(lineEndPattern, '');

    return stringModel;
  };

  private removeCommaBeforeBracket(stringModel: string): string {
    const bracketAfterCommaPattern = /,(?<bracketAfterComma>[\]}])/g;
    stringModel = stringModel.replace(bracketAfterCommaPattern, '$<bracketAfterComma>');

    return stringModel;
  };

  // private fixesQuotes(stringModel: string): string {
  //   const quotePattern = /['`"]/g;
  //   const escapePattern = /\\/;
  //   const stack: string[] = [];

  //   let result = '';
  //   for (let i = 0; i < stringModel.length; i++) {
  //     let char = stringModel[i];
  //     const prevChar = stringModel[i - 1];
  //     const nextChar = stringModel[i + 1];
  //     const lastCharInStack = stack.length - 1;
  //     const emptyStack = stack.length === 0;
  //     const isQuote = quotePattern.test(char);
  //     const isEscape = escapePattern.test(prevChar);

  //     if (isQuote && !isEscape) {
  //       if (!emptyStack &&
  //         prevChar === ':' ||
  //         prevChar === ',' ||
  //         nextChar === ':' ||
  //         nextChar === ',' ||
  //         nextChar === '}' ||
  //         prevChar === '[' ||
  //         nextChar === ']'
  //       ) {
  //         char = '"';
  //       } else {
  //         stack[lastCharInStack] === char ? stack.pop() : stack.push(char);
  //         char = '\"';
  //       };
  //     }
      
  //     result += char;
  //   };

  //   return stringModel;
  // };

  // private keyQuotes(stringModel: string): string {
  //   const keyPattern = /(?<wrap>[{,])(?<q1>['"]?)(?<key>\w+)(?<q2>['"]?)(?<colon>:)/g;
  //   stringModel = stringModel.replace(keyPattern, '$<wrap>"$<key>"$<colon>');

  //   return stringModel;
  // };
};
