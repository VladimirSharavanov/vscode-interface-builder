import * as vscode from 'vscode';
import { Config } from './config';
import { InterfaceBuilder } from './interface-builder';

/**
 * @param {vscode.ExtensionContext} context
 */

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'interface-builder.getInterface',
		() => {
			const activeTextEditor = vscode.window.activeTextEditor;
			if (activeTextEditor) {
				const config = new Config();
				const selectedText = activeTextEditor.document.getText(activeTextEditor.selection);
				const location = activeTextEditor.document.positionAt(0);


				vscode.window.activeTextEditor?.edit((editBuilder) => {
					try {
						const ib = new InterfaceBuilder();
						const interfaceTS = ib.getInterface(selectedText);

						switch (config.getDestination()) {
							case 'addabove':
								editBuilder.insert(location, interfaceTS);
								break;
							case 'replace':
								editBuilder.replace(activeTextEditor.selection, interfaceTS);
								break;
							case 'newfile':
								break;
							default:
								break;
						}
					} catch (error) {
						vscode.window.showErrorMessage('Selected text is not a valid object');
					}
				});
			}
		});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
