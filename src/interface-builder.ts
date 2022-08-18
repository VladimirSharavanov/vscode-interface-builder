import { FlatModel } from "./interface-builder.types";
import { Parser } from "./parser";
import { TypeChecker } from "./type-checker";

export class InterfaceBuilder {
  public getInterface(selectedText: string): string {
    const flatModel = new Parser().getFlatModel(selectedText);
    const typeModelValue = this.checkTypeModelValue(flatModel);
    const correctModel = this.preparationCorrectModel(typeModelValue);
    const result = this.renderInterface(correctModel);

    return result;
  }

  private checkTypeModelValue(model: FlatModel[]): FlatModel[] {
    return model.map((part: FlatModel) => {
      const typeModelValue: Record<string, string> = {};

      for (const key in part.value) {
        const type = TypeChecker.checkType(part.value[key]);
        typeModelValue[key] = this.substitutionInterfaceName(key, type);
      }

      return {
        name: this.substitutionInterfaceName(part.name),
        value: typeModelValue,
      };
    });
  }

  private substitutionInterfaceName(key: string, typeValue = 'object'): string {
    const typeList = ['object', 'object[]'];
    const arraySign = typeList
      .filter(type => type === typeValue)
      .join('')
      .replace('object', '');

    return typeList.includes(typeValue)
      ? key[0].toUpperCase() + key.slice(1) + arraySign
      : typeValue;
  }

  private preparationCorrectModel(model: FlatModel[]): FlatModel[] {
    const preparationPartNameList: string[] = [];
    const correctModel = model.map(part => {
      if (!preparationPartNameList.includes(part.name)) {
        preparationPartNameList.push(part.name);
        return this.checkTheSamePart(model, part);
      }
    }).filter(part => part !== undefined);

    return correctModel as FlatModel[];
  }

  private checkTheSamePart(model: FlatModel[], part: FlatModel): FlatModel {
    const theSamePartList = model.filter(currentPart => currentPart.name === part.name);
    if (theSamePartList.length < 2) { return part; }

    return this.combineTheSameParts(theSamePartList);
  }

  private combineTheSameParts(theSamePartList: FlatModel[]): FlatModel {
    const combinePart: FlatModel = {
      name: '',
      value: {}
    };
    const keysList: string[][] = [];
    theSamePartList.forEach(part => {
      combinePart.name = part.name;
      keysList.push(Object.keys(part.value));

      for (const key in part.value) {
        if (Object.prototype.hasOwnProperty.call(part.value, key)) {
          const value = part.value[key];
          if (combinePart.value[key]) {
            combinePart.value[key] += this.defineUnionTypes(combinePart.value[key], value);
          } else {
            combinePart.value[key] = value;
          }
        }
      }
    });

    return this.checkOptionalField(keysList, combinePart);
  }

  private defineUnionTypes(existingValue: string, newValue: string): string | void {
    let typeList = existingValue.split(' | ');
    return (typeList.includes(newValue)) ? '' : ` | ${newValue}`;
  }

  private checkOptionalField(keysList: string[][], part: FlatModel): FlatModel {
    const fullPartWithOptionalFields: FlatModel = {
      name: '',
      value: {}
    };
    const keysToDelete: string[] = [];
    keysList.forEach(keys => {
      for (const key in part.value) {
        if (keys.includes(key)) {
          fullPartWithOptionalFields.value[key] = part.value[key];
        } else {
          fullPartWithOptionalFields.value[`${key}?`] = part.value[key];
          keysToDelete.push(key);
        }
      }
      fullPartWithOptionalFields.name = part.name;
    });

    for (const key in fullPartWithOptionalFields.value) {
      if (keysToDelete.includes(key)) {
        delete fullPartWithOptionalFields.value[key];
      }
    }

    return fullPartWithOptionalFields;
  }

  private renderInterface(modelList: FlatModel[]): string {
    let render = '';
    const renderHeader: string[] = [];
    const renderContent: string[] = [];
    const renderFooter: string[] = [];

    modelList.forEach((part: FlatModel) => {
      let fieldList = '';
      const { name, value } = part;
      renderHeader.push(`export interface ${part.name} {\n`);
      for (const key in value) {
        fieldList += (`\t${key}: ${value[key]};\n`);
      };
      renderContent.push(fieldList);
      renderFooter.push('}\n\n');
    });

    renderHeader.forEach((_, i) => render += renderHeader[i] + renderContent[i] + renderFooter[i]);
    return render;
  }
}
