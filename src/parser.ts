import { FlatModel, Model } from "./interface-builder.types";
import { TypeChecker } from "./type-checker";

export class Parser {
  private flatModelList: FlatModel[] = [];

  public deconstructToFlatModel(model: string): FlatModel[] {
    let deconstructModel: Model;
    deconstructModel = { interfaceBuilder: this.stringModelToObjectModel(model) };
    this.deconstruct(deconstructModel, 'interfaceBuilder');

    return this.flatModelList;
  }

  private deconstruct(model: Model, parentName: string) {
    for (const key in model) {
      const interfaceName = { interfaceName: !isNaN(Number(key)) ? parentName : key };
      const value = model[key];
      const typeList = ['object', 'object[]'];

      if (typeList.includes(TypeChecker.checkType(value))) {
        if (!TypeChecker.isArray(value)) {
          this.flatModelList.push({ ...interfaceName, interfaceValue: value });
        }
        this.deconstruct(value, key);
      }
    }
  }

  private stringModelToObjectModel(stringModel: string): Model {
    stringModel = this.removeSpaces(stringModel);
    stringModel = this.removeSuperfluousSubstring(stringModel);
    stringModel = this.removeCommaBeforeBracket(stringModel);
    stringModel = this.fixesQuotes(stringModel);
    stringModel = this.keyQuotes(stringModel);

    return JSON.parse(stringModel);
  };

  private removeSpaces(stringModel: string): string {
    const spacePattern = /[\s | \n | \t]/g;
    const commaPattern = /['"`]/g;
    const commaList: string[] = [];

    let result = '';
    for (let i = 0; i < stringModel.length; i++) {
      const char = stringModel[i];
      const prevChar = stringModel[i - 1];
      const lastChar = commaList.length - 1;
      const checkComma = char.match(commaPattern);
      const space = char.match(spacePattern);

      if (checkComma && prevChar !== '\\') {
        commaList[lastChar] === char ? commaList.pop() : commaList.push(char);
      };

      if (!space || commaList.length) {
        result += char;
      };
    };

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

  private fixesQuotes(stringModel: string): string {
    const singleCommaPattern = /['`]/g;
    const commaPattern = /["`]/g;
    const commaList: string[] = [];

    while (commaPattern.test(stringModel)) {
      stringModel = stringModel.replace(commaPattern, '\'');
    };

    let result = '';
    for (let i = 0; i < stringModel.length; i++) {
      let char = stringModel[i];
      const prevChar = stringModel[i - 1];
      const nextChar = stringModel[i + 1];
      const lastChar = commaList.length - 1;
      const isSingleComma = char.match(singleCommaPattern);

      if (isSingleComma && prevChar !== '\\') {
        if (!commaList.length && prevChar === ':'
          || !commaList.length && prevChar === ','
          || !commaList.length && nextChar === ':'
          || !commaList.length && nextChar === ','
          || !commaList.length && nextChar === '}'
          || !commaList.length && prevChar === '['
          || !commaList.length && nextChar === ']'
        ) {
          char = '"';
        } else {
          commaList[lastChar] === char ? commaList.pop() : commaList.push(char);
        };
      };

      result += char;
    };

    return result;
  };

  private keyQuotes(stringModel: string): string {
    const keyPattern = /(?<wrap>[{,])(?<q1>[']?)(?<key>\w+)(?<q2>[']?)(?<colon>:)/g;

    while (stringModel.match(keyPattern)) {
      stringModel = stringModel.replace(keyPattern, '$<wrap>"$<key>"$<colon>');
    };

    return stringModel;
  };
};
