import { Handler, Model } from "./extension.type";

export abstract class Parser implements Handler {
  private nextHandler: Handler | null = null;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(stringModel: string, interfaceName: string): Model {
    return this.nextHandler ? this.nextHandler.handle(stringModel, interfaceName) : {};
  }
}

export class JsonHandler extends Parser {
  public handle(stringModel: string, interfaceName: string): Model {
    try {
      return { [interfaceName]: JSON.parse(stringModel) };
    } catch {
      return super.handle(stringModel, interfaceName);
    }
  }
}

export class ParserHandler extends Parser {
  public handle(stringModel: string, interfaceName: string): Model {
    return this.parse(stringModel, interfaceName);
  }

  private parse(stringModel: string, interfaceName: string): Model {
    stringModel = this.removeSpaces(stringModel);
    stringModel = this.removeSuperfluousSubstring(stringModel);
    stringModel = this.removeCommaBeforeBracket(stringModel);
    stringModel = this.addObjectKeyQuotes(stringModel);
    stringModel = this.addObjectValueQuotes(stringModel);
    stringModel = this.removeObjectValueString(stringModel);
    stringModel = this.removeArrayValueString(stringModel);

    return { [interfaceName]: JSON.parse(stringModel) };
  };

  private removeSpaces(stringModel: string): string {
    const spacePattern = /[\s | \n | \t]/g;
    stringModel = stringModel.replace(spacePattern, '');

    return stringModel;
  };

  private removeSuperfluousSubstring(stringModel: string): string {
    const preparationPattern = /^[^{:,]+:[^,]+,/g;
    const lineStartPattern = /^[^[{]*(?=[[{])/g;
    const lineEndPattern = /[^\]}]+$/g;
    stringModel = stringModel.replace(lineStartPattern, '');
    stringModel = preparationPattern.test(stringModel) ? `{${stringModel}}` : stringModel;

    return stringModel.replace(lineEndPattern, '');
  };

  private removeCommaBeforeBracket(stringModel: string): string {
    const bracketAfterCommaPattern = /,(?<bracketAfterComma>[\]}])/g;
    stringModel = stringModel.replace(bracketAfterCommaPattern, '$<bracketAfterComma>');

    return stringModel;
  };

  private addObjectKeyQuotes(stringModel: string): string {
    const quotePattern = /['`"]/g;
    const keyPattern = /(?<wrap>[{,])(?<q1>['"]?)(?<key>\w+)(?<q2>['"]?)(?<colon>:)/g;
    stringModel = stringModel.replace(quotePattern, "'");
    stringModel = stringModel.replace(keyPattern, '$<wrap>"$<key>"$<colon>');

    return stringModel;
  };

  private addObjectValueQuotes(stringModel: string) {
    const startValuePattern = /(?<start>[(":)])(?<q>')/g;
    const endValuePattern = /(?<q>')(?<end>,?["}])/g;
    stringModel = stringModel.replace(startValuePattern, '$<start>"');
    stringModel = stringModel.replace(endValuePattern, '"$<end>');

    return stringModel;
  }

  private removeObjectValueString(stringModel: string): string {
    const valuePattern = /(?<key>"\w+":)(?<value>".*?")(?<ending>[,}])/g;
    stringModel = stringModel.replace(valuePattern, '$<key>""$<ending>');

    return stringModel;
  };

  private removeArrayValueString(stringModel: string): string {
    const valuePattern = /(?<c>[,\[])?(?<v>'.*?')(?<cc>[,\]])/g;
    stringModel = stringModel.replace(valuePattern, '$<c>""$<cc>');

    return stringModel;
  }
}

const jsonHandler = new JsonHandler();
const parserHandler = new ParserHandler();
jsonHandler.setNext(parserHandler);

export function parseToObjectModel(selectedText: string, interfaceName: string) {
  return jsonHandler.handle(selectedText, interfaceName);
}
