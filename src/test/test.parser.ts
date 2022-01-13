export const testData: Record<string, string> = {
  t01: `const x = {interface: 'builder', version: 1},`,
  t02: `let x = {interface: 'builder', version: 1,};`,
  t03: `{interface: 'builder', version: 1,},`,
  t04: `{interface: 'builder', version: 1};`,
  t05: `interface: 'builder', version: 1`,
  t06: `interface: 'builder', version: 1,`,
  t07: `const x = {
    interface: 'builder',
    version: 1
  },`,
  t08: `let x = {
    interface: 'builder',
    version: 1,
  }`,
  t09: `{
    interface: 'builder',
    version: 1,
  },`,
  t10: `{
    interface: 'builder',
    version: 1
  }`,
  t11: `
  interface: 'builder',
  version: 1`,
  t12: `
  interface: 'builder',
  version: 1,`,
  t13: `const x = [{interface: 'builder', version: 1}]`,
  t14: `let x = [{interface: 'builder', version: 1,},];`,
  t15: `[{interface: 'builder', version: 1,},],`,
  t16: `[{interface: 'builder', version: 1}];`,
  t17: `const x = [
    {interface: 'builder', version: 1}
  ],`,
  t18: `let x = [
    {interface: 'builder', version: 1,},
  ]`,
  t19: `[
    {interface: 'builder', version: 1,},
  ],`,
  t20: `[
    {interface: 'builder', version: 1}
  ]`,
  t21: `const x = {interface: 'hh:mm dd:mm:yyyy', version: 1},`,
  t22: `const x = {interface: '!@#$\\/%^&*()_=+-:{}[]№,%;?*()./.,~', version: 1},`,
  t23: `const x = {
    'interface': 'builder',
    'version': 1
  },`,
  t24: `const x = {
    "interface": 'builder',
    "version": 1
  },`,
  t25: `const x = {
    'interface': 'builder',
    "version": 1
  },`,
  t26: `const x = {
    "interface": {
      "interface": 'builder',
      "version": 1
    },
    "adress": {
      "city": 'kaluga',
    },
  };asdfadsfadsf`,
  t27: `const x = { interface: 'b u i l d e r', version: 1 },`,
  t28: `const x = { interface: "builder'b u i'lder end", version: 1 },`,
  t29: `const x = { interface: "builder \'builder\'", version: 1 },`,
  t30: `const x = { interface: 'builderw \"buil der\"', version: 1 },`,
  t31: `const x = { interface: 'builder \\/buil der\\/', version: 1 },`,
  t32: `const x = { interface: "builder \"builder\" builder", version: 1 },`,
  t33: `const x = { interface: "builder 'builder', builder", version: 1 },`,
  t34: `{interface: 'builder', version: 'builder'};`,
  t35: `{interface: 'builder', version: 'builder',};`,
  t36: `{interface: 'builder', version: 'builder',aaa: {bbb: 'builderbuilder',}};`,
  t37: `{interface: null, version: null,aaa: {bbb: null}};`,
  t38: `const x = [{name: 'IB'}, {name: 123456}]`,
  t39: `const x = {
          interface: 'builder',
          adress: {
            city: null,
            phone: [123456, '32432'],
            aaa: [
              { interface: 'builder' },
              { interface: 'builder', age: 23 }
            ]
          }
        }`,
  t40: `const x = {
    interface: ['builder', 123456, true]
  }`,
  t41: `const x = {
    interface: ['builder', "builder"]
  }`
};
