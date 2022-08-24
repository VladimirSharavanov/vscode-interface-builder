import * as vscode from 'vscode';
import { InterfaceBuilder } from './interface-builder';
import { TextEncoder } from 'util';
import { Config } from './config';
import { Notification } from './notification';
import { NotificationCode } from './extension.type';

export class Extension {
  private config: Config = new Config();
  private notification: Notification = new Notification();
  
  public insertInterface() {
    return () => {
      const activeTextEditor = vscode.window.activeTextEditor;

      if (activeTextEditor) {
        const selection = activeTextEditor.selection;
        const selectedText = activeTextEditor.document.getText(selection);
        const location = activeTextEditor.document.positionAt(0);

        vscode.window.activeTextEditor?.edit((editBuilder) => {
          try {
            const interfaceName = this.config.getInterfaceName();
            const ib = new InterfaceBuilder();
            const interfaceTS = ib.getInterface(selectedText, interfaceName);

            editBuilder.insert(location, interfaceTS);
          } catch (error) {
            this.notification.error(NotificationCode.notValidObject);
          }
        });
      }
    };
  }

  public replaceInterface() {
    return () => {
      const activeTextEditor = vscode.window.activeTextEditor;

      if (activeTextEditor) {
        const selection = activeTextEditor.selection;
        const selectedText = activeTextEditor.document.getText(selection);

        vscode.window.activeTextEditor?.edit((editBuilder) => {
          try {
            const interfaceName = this.config.getInterfaceName();
            const ib = new InterfaceBuilder();
            const interfaceTS = ib.getInterface(selectedText, interfaceName);

            editBuilder.replace(selection, interfaceTS);
          } catch (error) {
            this.notification.error(NotificationCode.notValidObject);
          }
        });
      }
    };
  }

  public exportInterface() {
    return () => {
      const activeTextEditor = vscode.window.activeTextEditor;

      if (activeTextEditor) {
        const selectedText = activeTextEditor.document.getText(activeTextEditor.selection);

        try {
          vscode.window.showInputBox({ title: 'Enter valid interface name.', placeHolder: 'Default: InterfaceBuilder' }).then(value => {
            const interfaceName = this.config.getInterfaceName(value);
            const ib = new InterfaceBuilder();
            const interfaceTS = ib.getInterface(selectedText, interfaceName);
          
            const uri = activeTextEditor.document.uri;
            const content = new TextEncoder().encode(interfaceTS);
            const path = this.config.getUriPath(uri);
          
            if (uri.scheme === 'file') {
              vscode.workspace.fs.writeFile(path, content);
            } else {
              vscode.window.showSaveDialog({ defaultUri: uri, title: 'Export interface file name' })
                .then(uri => {
                  if (uri) {
                    const path = this.config.getUriPath(uri);
                    vscode.workspace.fs.writeFile(path, content);
                  }
                });
            }
          });
        } catch (error) {
          this.notification.error(NotificationCode.notValidObject);
        }
      }
    };
  }
}
