import * as vscode from 'vscode';

export class Config {
  private config = vscode.workspace.getConfiguration("interface-builder");

  public getInterfaceName(): string {
    return (this.config.interfaceName as string).trim() === ''
      ? 'interfaceBuilder'
      : (this.config.interfaceName as string)
        .split(' ')
        .map(string => string.charAt(0).toUpperCase() + string.slice(1))
        .join('');
  }

  public getDestination(): string {
    return this.config.destination.split('-').join('');
  }
}
