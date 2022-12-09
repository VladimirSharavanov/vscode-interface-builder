export type Model = Record<string, any>;

export interface FlatModel {
  name: string;
  value: Model;
}

export enum NotificationCode {
  interfaceNameInvalid = 'interfaceNameInvalid',
  interfaceNameContainSpaces = 'interfaceNameContainSpaces',
  notValidObject = 'notValidObject',
}

export interface Handler {
  setNext(handler: Handler): Handler;
  handle(stringModel: string, interfaceName: string): Model;
}
