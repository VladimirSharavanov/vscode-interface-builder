import { InterfaceBuilder } from "../interface-builder";
import { testData } from "./test.parser";

const builder = new InterfaceBuilder('test');

console.log('START');

for (const key in testData) {
  if (Object.prototype.hasOwnProperty.call(testData, key)) {
    const value = testData[key];
    const result = builder.getInterface(value);
    if (typeof result !== 'object') {
      console.log(key);
    }
  }
}

console.log('END');
