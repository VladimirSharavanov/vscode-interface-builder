import * as vscode from 'vscode';
import { Extension } from './extension';

/**
 * @param {vscode.ExtensionContext} context
 */

export function activate(context: vscode.ExtensionContext) {
	const extension = new Extension();

	const insertInterface = vscode.commands.registerCommand(
		'interface-builder.insertInterface',
		extension.insertInterface()
	);

	const replaceInterface = vscode.commands.registerCommand(
		'interface-builder.replaceInterface',
		extension.replaceInterface()
	);

	const exportInterface = vscode.commands.registerCommand(
		'interface-builder.exportInterface',
		extension.exportInterface()
	);

	context.subscriptions.push(
		insertInterface,
		replaceInterface,
		exportInterface
	);
}

export function deactivate() { }
