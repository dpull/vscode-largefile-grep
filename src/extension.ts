'use strict';

import * as vscode from 'vscode';
import { MemFS } from './fileSystemProvider';

export function activate(context: vscode.ExtensionContext) {
    const memFs = new MemFS();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('memfs', memFs, { isCaseSensitive: true }));

    context.subscriptions.push(vscode.commands.registerCommand('memfs.WorkspaceInit', _ => {
        vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('memfs:/'), name: "MemFS - Sample" });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('memfs.OpenFile', async () => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        return vscode.window.showOpenDialog({ canSelectFiles: true, canSelectFolders: false, canSelectMany: false, openLabel: 'Select large file to open...' }).then(
            async (uris: vscode.Uri[] | undefined) => {
                if (uris) {
                    uris.forEach(async (uri) => {
                        console.log(`open large file from URI=${uri.toString()}`);
                        let memfsUri = uri.with({ scheme: 'memfs' });
                        vscode.workspace.openTextDocument(memfsUri).then((value) => { vscode.window.showTextDocument(value, { preview: false }); });
                    });
                }
            }
        );
    }));

    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument((doc) => {
        memFs._closeFile(doc.uri);
    }));
}
