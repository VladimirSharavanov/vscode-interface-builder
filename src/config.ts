import * as vscode from 'vscode';
import { NotificationCode } from './extension.type';
import { Notification } from './notification';

export class Config {
  private notification: Notification = new Notification();

  public getInterfaceName(interfaceName?: string): string {
    if (!interfaceName || interfaceName === '') {
      interfaceName = this.getConfig('defaultInterfaceName');
    }

    const defaultInterfaceName = 'InterfaceBuilder';
    const hasInvalidChar = /[^\w | -]/gi;
    const hasSpace = /\s/gi;

    if (hasInvalidChar.test(interfaceName) || interfaceName === '') {
      interfaceName = defaultInterfaceName;
      this.notification.info(NotificationCode.interfaceNameInvalid);
      this.updateConfig('defaultInterfaceName', interfaceName);
    }

    if (hasSpace.test(interfaceName)) {
      interfaceName = interfaceName.split(' ').join('');
      this.notification.info(NotificationCode.interfaceNameContainSpaces);
      this.updateConfig('defaultInterfaceName', interfaceName);
    }

    return interfaceName;
  }

  public getUriPath(uri: vscode.Uri): vscode.Uri {
    const file = uri.path.split('/').splice(-1, 1).join('');
    const pattern = new RegExp(file, 'gi');
    const fileName = file.split('.').splice(0, 1).join('');
    const postfix = this.getConfig('postfix');
    const fullPath = uri.toString().replace(pattern, `${fileName}${postfix}.ts`);

    return vscode.Uri.parse(fullPath);
  }

  private getConfig(propName: string): string {
    return vscode.workspace.getConfiguration('interface-builder').get(propName)!;
  }

  private updateConfig(propName: string, value: string): void {
    vscode.workspace.getConfiguration('interface-builder').update(propName, value, true);
  }
}
