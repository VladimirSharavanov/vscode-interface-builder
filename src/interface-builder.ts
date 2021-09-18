import { FlatModel } from "./interface-builder.types";
import { Parser } from "./parser";
import { TypeChecker } from "./type-checker";

export class InterfaceBuilder {
  public getInterface(model: string): string {
    const flatModel = new Parser().deconstructToFlatModel(model);
    const typeModelValue = this.checkTypeModelValue(flatModel);
    const correctModel = this.preparationCorrectModel(typeModelValue);
    const render = this.renderInterface(correctModel);

    return render;
  }

  private checkTypeModelValue(model: FlatModel[]): FlatModel[] {
    return model.map((part: FlatModel) => {
      const typeModelValue: Record<string, string> = {};

      for (const key in part.interfaceValue) {
        const type = TypeChecker.checkType(part.interfaceValue[key]);
        typeModelValue[key] = this.substitutionInterfaceName(key, type);
      }

      return {
        interfaceName: this.substitutionInterfaceName(part.interfaceName),
        interfaceValue: typeModelValue,
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
      if (!preparationPartNameList.includes(part.interfaceName)) {
        preparationPartNameList.push(part.interfaceName);
        return this.checkTheSamePart(model, part);
      }
    }).filter(part => part !== undefined);

    return correctModel as FlatModel[];
  }

  private checkTheSamePart(model: FlatModel[], part: FlatModel): FlatModel {
    const theSamePartList = model.filter(currentPart => currentPart.interfaceName === part.interfaceName);
    if (theSamePartList.length < 2) { return part; }

    return this.combineTheSameParts(theSamePartList);
  }

  private combineTheSameParts(theSamePartList: FlatModel[]): FlatModel {
    const combinePart: FlatModel = {
      interfaceName: '',
      interfaceValue: {}
    };
    const keysList: string[][] = [];
    theSamePartList.forEach(part => {
      keysList.push(Object.keys(part.interfaceValue));
      Object.assign(combinePart, { interfaceName: part.interfaceName, interfaceValue: Object.assign(combinePart.interfaceValue, part.interfaceValue) });
    });

    return this.checkOptionalField(keysList, combinePart);
  }

  private checkOptionalField(keysList: string[][], part: FlatModel): FlatModel {
    const fullPartWithOptionalFields: FlatModel = {
      interfaceName: '',
      interfaceValue: {}
    };
    const keysToDelete: string[] = [];
    keysList.forEach(keys => {
      for (const key in part.interfaceValue) {
        if (keys.includes(key)) {
          fullPartWithOptionalFields.interfaceValue[key] = part.interfaceValue[key];
        } else {
          fullPartWithOptionalFields.interfaceValue[`${key}?`] = part.interfaceValue[key];
          keysToDelete.push(key);
        }
      }
      fullPartWithOptionalFields.interfaceName = part.interfaceName;
    });

    for (const key in fullPartWithOptionalFields.interfaceValue) {
      if (keysToDelete.includes(key)) {
        delete fullPartWithOptionalFields.interfaceValue[key];
      }
    }

    return fullPartWithOptionalFields;
  }

  private renderInterface(modelList: FlatModel[]): string {
    let render = '';
    const renderHeader: string[] = [];
    const renderContent: string[] = [];
    const renderFooter: string[] = [];

    modelList.forEach((part: any) => {
      let fieldList = '';
      const { interfaceName, interfaceValue } = part;
      renderHeader.push(`export interface ${part.interfaceName} {\n`);
      for (const key in interfaceValue) {
        fieldList += (`\t${key}: ${interfaceValue[key]};\n`);
      };
      renderContent.push(fieldList);
      renderFooter.push('}\n\n');
    });

    renderHeader.forEach((_, i) => render += renderHeader[i] + renderContent[i] + renderFooter[i]);
    return render;
  }
}
