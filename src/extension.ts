import * as vscode from "vscode";
import * as path from "path";
import { loadWebViewHtml } from "./utils/webview";
import { handleReceiveMessage } from "./utils/handleReceiveMessage";

export function activate(context: vscode.ExtensionContext) {
  let openWebviewDisposable = vscode.commands.registerCommand(
    "extension.openWebview",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "reactWebview", // Webview 类型
        "React in VSCode", // Webview 标题
        vscode.ViewColumn.One, // 显示位置
        {
          enableScripts: true, // 允许脚本
          retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "out")),
            vscode.Uri.file(path.join(context.extensionPath, "out", "assets")),
          ],
        }
      );

      // 加载 webview 内容
      loadWebViewHtml(panel);
      panel.webview.onDidReceiveMessage((data) => {
        handleReceiveMessage(data, panel);
      });
    }
  );

  context.subscriptions.push(openWebviewDisposable);
}

export function deactivate() { }


