import { FlatModel, Model } from "./extension.type";
import { TypeChecker } from "./type-checker";

export class Transformer {
  private flatModels: FlatModel[] = [];

  public toFlatModel(model: Model, parentName: string) {
    this.transform(model, parentName);
    
    return this.flatModels;
  }

  private transform(model: Model, parentName: string) {
    for (const key in model) {
      const interfaceName = { name: !isNaN(Number(key)) ? parentName : key };
      const value = model[key];
      const typeList = ['object', 'object[]'];

      if (typeList.includes(TypeChecker.checkType(value))) {
        if (!TypeChecker.isArray(value)) {
          this.flatModels.push({ ...interfaceName, value });
        }
        this.transform(value, key);
      }
    }
  }
}
