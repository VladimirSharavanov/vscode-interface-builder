export class TypeChecker {
  static isObject(model: any): boolean {
    return typeof model === 'object';
  }

  static isArray(model: any): boolean {
    return model instanceof Array;
  }

  static isPrimitive(value: any): boolean {
    return value && typeof value !== 'object';
  }

  static isNull(value: any | null): boolean {
    return value === null;
  }

  static isTheSameType(valueA: any, valueB: any): boolean {
    return typeof valueA === typeof valueB;
  }

  static checkType(value: any): string {
    let outputModel: string = TypeChecker.isNull(value) ? 'null' : typeof value;

    if (TypeChecker.isArray(value)) {
      outputModel = TypeChecker.checkArrayStructureType(value);
    }

    return outputModel;
  }

  private static checkArrayStructureType(model: any[]): string {
    let isPrimitiveStructure = true;
    let outputModel = '';
    for (const i of model) {
      if (TypeChecker.isObject(i)) {
        isPrimitiveStructure = false;
      }
    }
    outputModel = isPrimitiveStructure ? TypeChecker.primitiveStructure(model) : TypeChecker.anyStructure(model);

    return outputModel + '[]';
  }

  private static primitiveStructure(model: any[]): string {
    let outputModel = (typeof model[0]).toString();
    for (const i of model) {
      if (!TypeChecker.isTheSameType(model[0], i)) {
        outputModel = 'any';
      }
    }

    return outputModel;
  }

  private static anyStructure(model: any[]): string {
    let outputModel = TypeChecker.isArray(model[0]) ? 'array' : typeof model[0];
    const referenceValue = outputModel;
    for (const i of model) {
      let currentValue = TypeChecker.isArray(i) ? 'array' : typeof i;
      if (referenceValue !== currentValue) {
        outputModel = 'any';
      }
    }

    if (outputModel === 'array') {
      outputModel = TypeChecker.arrayStructure(model);
    }

    return outputModel;
  }

  private static arrayStructure(model: any[]): string {
    const referenceValueList = model.reduce<string[]>((acc, value) => {
      acc.push(TypeChecker.checkArrayStructureType(value));

      return acc;
    }, []);

    let outputModel = (referenceValueList[0]).toString();
    for (const i of referenceValueList) {
      if (referenceValueList[0] !== i) {
        outputModel = 'any[]';
      }
    }

    return outputModel;
  }
}
