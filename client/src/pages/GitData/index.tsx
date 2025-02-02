import React, { useEffect, useState } from 'react';
import { Button, Select, DatePicker, Input, App } from 'antd';
import { vscode } from '@/utils/webview';
import dayjs, { Dayjs } from 'dayjs';
import { fetchChatSSE } from '@/utils/chat';
import AppMarkdown from '@/components/AppMarkdown';

import './index.module.less';
import AppIcon from '@/components/AppIcon';

const { RangePicker } = DatePicker;

export default function GitData() {
  const [timeValue, setTimeValue] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [branchValue, setBranchValue] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [commitValue, setCommitValue] = useState('');
  const [summaryValue, setSummaryValue] = useState('');

  const { message } = App.useApp();

  const initBranchList = () => {
    vscode.postMessage({
      command: 'getGitBranchList',
    });
  };
  const getGitData = () => {
    vscode.postMessage({
      command: 'getGitData',
      startTime: timeValue[0].format('YYYY-MM-DD'),
      endTime: timeValue[1].format('YYYY-MM-DD'),
      branch: branchValue,
    });
  };

  const handleListenMessage = (event) => {
    const messageRes = event.data;
    console.log('message', message);
    if (messageRes.message === 'vscodeWebviewPostMessage') {
      const commandFuncMap = {
        getGitDataResult: () => {
          const _commitValue = messageRes.data.join('\n');
          setCommitValue(_commitValue);
        },
        getGitBranchListResult: () => {
          const branchList = messageRes.data;
          setBranchList(
            branchList.map((item) => ({ label: item, value: item }))
          );
          setBranchValue(branchList[0]);
        },
        vscodeCopyTextResult: () => {
          if (messageRes.data === '复制成功') {
            message.success(messageRes.data);
          } else {
            message.error(messageRes.data);
          }
        },
      };
      commandFuncMap[messageRes.command]?.();
    }
  };

  const handleSummary = () => {
    fetchChatSSE({
      params: {
        inputs: {
          query: commitValue
        }
      },
      callback: (data) => {
        setSummaryValue(data);
      },
      onEnd: () => { },
    });
  };

  const copyText = () => {
    vscode.postMessage({
      command: 'vscodeCopyText',
      data: summaryValue,
    });
  };

  useEffect(() => {
    initBranchList();
    window.addEventListener('message', handleListenMessage);
    return () => {
      window.removeEventListener('message', handleListenMessage);
    };
  }, []);
  return (
    <div styleName="git-data">
      GitData
      <div>
        <Select
          style={{ width: 120, marginRight: 8 }}
          options={branchList}
          value={branchValue}
          onChange={setBranchValue}
          loading={!branchList.length}
        />
        <RangePicker
          value={timeValue}
          onChange={setTimeValue}
          style={{ marginRight: 8 }}
        />
        <Button type="primary" disabled={!branchValue} onClick={getGitData}>
          获取 git 数据
        </Button>
        <Input.TextArea
          style={{ marginTop: 8 }}
          value={commitValue}
          onChange={(e) => setCommitValue(e.target.value)}
          autoSize={{ minRows: 6, maxRows: 20 }}
        />

        <Button
          type="primary"
          style={{ marginTop: 8 }}
          disabled={!commitValue}
          onClick={handleSummary}
        >
          总结
        </Button>
        {summaryValue && (
          <div styleName="summary">
            <AppIcon
              styleName="copy"
              fontSize={20}
              icon="#baize-vscode-extension-copy"
              onClick={copyText}
            />
            <AppMarkdown markdown={summaryValue} />
          </div>
        )}
      </div>
    </div>
  );
}
