import { exec } from 'child_process';
import * as vscode from 'vscode';

const workspacePath = vscode.workspace.rootPath;

export const getGitUserName = async () => {
  return new Promise((resolve, reject) => {
    exec('git config user.name', (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

export const getGitBranchList = async () => {
  return new Promise((resolve, reject) => {
    exec(
      'git branch --list',
      { cwd: workspacePath },
      (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        }

        const branches = stdout
          .split('\n') // 将输出按行拆分
          .map((branch) => branch.trim()) // 去除每行的前后空白字符
          .filter((branch) => branch); // 过滤掉空行

        // 提取当前分支并去除 '*' 符号
        const currentBranch = branches.find((branch) => branch.startsWith('*'));
        const remainingBranches = branches.filter(
          (branch) => !branch.startsWith('*')
        );

        // 如果找到当前分支，将其放到最前面
        if (currentBranch) {
          const cleanCurrentBranch = currentBranch.replace(/^\*/, '').trim(); // 去除 '*' 符号
          resolve([cleanCurrentBranch, ...remainingBranches]);
        } else {
          resolve(remainingBranches); // 如果没有当前分支，直接返回所有分支
        }
      }
    );
  });
};

export const getGitCommit = async ({ author, branch, startTime, endTime }) => {
  return new Promise((resolve, reject) => {
    const command = `git log ${branch} --author="${author}" --since="${startTime}" --until="${endTime}" --pretty=format:"%s" -n 10000`;
    console.log('command', command);
    exec(command, { cwd: workspacePath }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      }

      // 显示提交信息
      if (stdout) {
        const commitMessages = stdout
          .trim()
          .split('\n')
          .filter((item) => item.indexOf('Merge branch') < 0);
        resolve(commitMessages);
      } else {
        resolve(['No commits found.']);
      }
    });
  });
};
