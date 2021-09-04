import { FlatModel, Model } from "./interface-builder.types";
import { TypeChecker } from "./type-checker";

export class Parser {
  private flatModelList: FlatModel[] = [];

  public deconstructToFlatModel(model: Model | string): FlatModel[] {
    let deconstructModel: Model;

    if (typeof model === 'string') {
      deconstructModel = { interfaceBuilder: this.stringModelToObjectModel(model) };
    } else {
      deconstructModel = { interfaceBuilder: model };
    }

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
    const preparationPattern = /^[^{:,]+:[^,]+,/g;
    const keywordsPattern = /^[^{]*(?={)/g;
    const groupPattern = /[']?(?<key>[^-\s"'{]+)[']?:\s?(?<value>[^}\n,;]+)/gm;
    const spacePattern = /[\s | \t | \n | ;]+/gm;
    const commaPattern = /,(?<bracket>[} \]])/gm;
    const endPattern = /[' | " | ` | , | ;]$/gm;

    stringModel.match(preparationPattern)
      ? stringModel = `{${stringModel}}`
      : stringModel = stringModel.replace(keywordsPattern, '');

    stringModel = stringModel.replace(/('|`)/gm, '"');

    while (stringModel.match(groupPattern)) {
      stringModel = stringModel.replace(groupPattern, '"$<key>":$<value>');
    }
    while (stringModel.match(spacePattern)) {
      stringModel = stringModel.replace(spacePattern, '');
    }
    while (stringModel.match(commaPattern)) {
      stringModel = stringModel.replace(commaPattern, '$<bracket>');
    }
    while (stringModel.match(endPattern)) {
      stringModel = stringModel.replace(endPattern, '');
    }

    return JSON.parse(stringModel);
  }
}
