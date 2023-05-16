import * as vscode from 'vscode';
class FunTreeSymbols {
    provideDocumentSymbols(textDocument) {
        // return new Promise((resolve, reject) => {
        //     let symbols: vscode.DocumentSymbol[] = [];
        //     for (var i = 0; i < document.lineCount; i++) {
        //         var line = document.lineAt(i);
        //         if (line.text.startsWith("#")) {
        //             let symbol = new vscode.DocumentSymbol(
        //                 line.text, 'Component',
        //                 vscode.SymbolKind.Function,
        //                 line.range, line.range)
        //             symbols.push(symbol)
        //         }
        //     }
        //     resolve(symbols);
        // });
        return [1];
    }
}
export default FunTreeSymbols;
