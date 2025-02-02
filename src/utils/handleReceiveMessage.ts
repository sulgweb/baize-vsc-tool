import { getGitUserName, getGitCommit, getGitBranchList } from './git';
import * as vscode from 'vscode';


export const handleReceiveMessage = async (data, panel) => {
  const { command, ...rest } = data;
  const commandFuncMap = {
    getGitData: async () => {
      const author = await getGitUserName();
      const commitData = await getGitCommit({ author, ...rest });
      panel.webview.postMessage({
        message: 'vscodeWebviewPostMessage',
        command: 'getGitDataResult',
        data: commitData,
      });
    },
    getGitBranchList: async () => {
      const branchList = await getGitBranchList();
      panel.webview.postMessage({
        message: 'vscodeWebviewPostMessage',
        command: 'getGitBranchListResult',
        data: branchList,
      });
    },
    vscodeCopyText: () => {
      try {
        vscode.env.clipboard.writeText(rest.data);
        panel.webview.postMessage({
          message: 'vscodeWebviewPostMessage',
          command: 'vscodeCopyTextResult',
          data: '复制成功',
        });
      } catch (e) {
        panel.webview.postMessage({
          message: 'vscodeWebviewPostMessage',
          command: 'vscodeCopyTextResult',
          data: '复制失败',
        });
      }
    },
  };
  if (commandFuncMap[command]) {
    commandFuncMap[command]();
  } else {
    console.error('未找到对应的命令处理函数');
  }
};
