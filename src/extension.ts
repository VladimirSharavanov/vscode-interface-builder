import * as vscode from 'vscode';
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
				const selectedText = activeTextEditor.document.getText(activeTextEditor.selection);
				const location = activeTextEditor.document.positionAt(0);

				vscode.window.activeTextEditor?.edit((editBuilder) => {
					try {
						editBuilder.insert(location, (new InterfaceBuilder().getInterface(selectedText) as string));
					} catch (error) {
						vscode.window.showErrorMessage('Selected text is not a valid object');
					}
				});
			}
		});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
