// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FunTreeSymbols from './funTreeSymbols';
// class Symbols implements vscode.DocumentSymbolProvider

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context) {
    console.dir(context);
    console.dir('context');

    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider('yicode-funtree', new FunTreeSymbols()));
}

// this method is called when your extension is deactivated
export function deactivate() {}
