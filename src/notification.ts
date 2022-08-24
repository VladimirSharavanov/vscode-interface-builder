import * as vscode from 'vscode';

export class Notification {
  private messageList: Record<string, string> = {
    interfaceNameInvalid: '[Interface Builder] Interface name is invalid. Replacing by default name',
    interfaceNameContainSpaces: '[Interface Builder] Interface name cannot contain spaces',
    notValidObject:'[Interface Builder] Selected text is not a valid object',
  };

  public info(code: string,) {
    vscode.window.showInformationMessage(this.messageList[code]);
  }

  public error(code: string,) {
    vscode.window.showErrorMessage(this.messageList[code]);
  }
}
