/* eslint-disable @typescript-eslint/naming-convention */
export type Model = Record<string, any>;

export interface FlatModel {
  name: string;
  value: Model;
}
