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
