import {
  getGitUserName,
  getGitCommit,
  getGitBranchList,
  getGitAllUserNames,
} from './git';
import * as vscode from 'vscode';

export const handleReceiveMessage = async (data, panel) => {
  const vscConfig = vscode.workspace.getConfiguration('baize');
  const { command, ...rest } = data;
  const commandFuncMap = {
    getGitData: async () => {
      const commitData = await getGitCommit({ ...rest });
      panel.webview.postMessage({
        message: 'vscodeWebviewPostMessage',
        command,
        data: commitData,
      });
    },
    getGitUserName: async () => {
      const author = await getGitUserName();
      panel.webview.postMessage({
        message: 'vscodeWebviewPostMessage',
        command,
        data: author,
      });
    },
    getGitAllUserNames: async () => {
      const userNameList = await getGitAllUserNames();
      panel.webview.postMessage({
        message: 'vscodeWebviewPostMessage',
        command,
        data: userNameList,
      });
    },
    getGitBranchList: async () => {
      const branchList = await getGitBranchList();
      panel.webview.postMessage({
        message: 'vscodeWebviewPostMessage',
        command,
        data: branchList,
      });
    },
    vscodeCopyText: () => {
      try {
        vscode.env.clipboard.writeText(rest.data);
        panel.webview.postMessage({
          message: 'vscodeWebviewPostMessage',
          command,
          data: '复制成功',
        });
      } catch (e) {
        panel.webview.postMessage({
          message: 'vscodeWebviewPostMessage',
          command,
          data: '复制失败',
        });
      }
    },
    vscSaveSetting: () => {
      console.log('vscSaveSetting', rest.data);
      vscConfig.update(
        'apiKey',
        rest.data.apiKey,
        vscode.ConfigurationTarget.Global
      );
      vscConfig.update(
        'difyUrl',
        rest.data.difyUrl,
        vscode.ConfigurationTarget.Global
      );
      vscode.window.showInformationMessage('Baize settings updated!');
    },
    vscGetSetting: () => {
      const apiKey = vscConfig.get('apiKey');
      const difyUrl = vscConfig.get('difyUrl');
      console.log('apiKey', apiKey);
      console.log('difyUrl', difyUrl);
      panel.webview.postMessage({
        message: 'vscodeWebviewPostMessage',
        command,
        data: {
          apiKey,
          difyUrl,
        },
      });
    },
  };
  if (commandFuncMap[command]) {
    commandFuncMap[command]();
  } else {
    console.error('未找到对应的命令处理函数');
  }
};
