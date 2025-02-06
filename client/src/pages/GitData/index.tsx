import React, { useEffect, useState } from 'react';
import { Button, Select, DatePicker, Input, App } from 'antd';
import { asyncPostMessage } from '@/utils/webview';
import dayjs, { Dayjs } from 'dayjs';
import { fetchChatSSE } from '@/utils/chat';
import AppMarkdown from '@/components/AppMarkdown';

import './index.module.less';
import AppIcon from '@/components/AppIcon';

const { RangePicker } = DatePicker;

export default function GitData() {
  const [timeValue, setTimeValue] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [branchValue, setBranchValue] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [userNameList, setUserNameList] = useState([]);
  const [currentUserName, setCurrentUserName] = useState('');
  const [commitValue, setCommitValue] = useState('');
  const [summaryValue, setSummaryValue] = useState('');

  const { message } = App.useApp();

  // 初始化分支列表
  const initBranchList = async () => {
    const res = await asyncPostMessage({
      command: 'getGitBranchList',
    });
    const branchList = res.data;
    setBranchList(branchList.map((item) => ({ label: item, value: item })));
    setBranchValue(branchList[0]);
  };

  // 初始化用户列表
  const initUserNameList = async () => {
    const namesRes = await asyncPostMessage({
      command: 'getGitAllUserNames',
    });
    const authorRes = await asyncPostMessage({
      command: 'getGitUserName',
    });
    setUserNameList(
      namesRes.data.map((item) => ({ label: item, value: item }))
    );
    setCurrentUserName(
      namesRes.data.includes(authorRes.data) ? authorRes.data : namesRes.data[0]
    );
  };

  // 获取git commit记录
  const getGitData = async () => {
    const res = await asyncPostMessage({
      command: 'getGitData',
      startTime: timeValue[0].format('YYYY-MM-DD'),
      endTime: timeValue[1].format('YYYY-MM-DD'),
      author: currentUserName,
      branch: branchValue,
    });
    setCommitValue(res.data.join('\n'));
  };

  // AI总结
  const handleSummary = () => {
    fetchChatSSE({
      params: {
        inputs: {
          query: commitValue,
        },
      },
      callback: (data) => {
        setSummaryValue(data);
      },
      onEnd: () => {},
    });
  };

  const copyText = async () => {
    const res = await asyncPostMessage({
      command: 'vscodeCopyText',
      data: summaryValue,
    });
    if (res.data === '复制成功') {
      message.success(res.data);
    } else {
      message.error(res.data);
    }
  };

  useEffect(() => {
    initBranchList();
    initUserNameList();
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
        <Select
          style={{ width: 120, marginRight: 8 }}
          options={userNameList}
          value={currentUserName}
          onChange={setCurrentUserName}
          loading={!userNameList.length}
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
