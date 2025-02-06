import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { asyncPostMessage } from '@/utils/webview';
import './index.module.less';

export default function Setting() {
  const [apiKey, setApiKey] = useState('');
  const [difyUrl, setDifyUrl] = useState('');
  const handleSave = async () => {
    asyncPostMessage({
      command: 'vscSaveSetting',
      data: {
        apiKey,
        difyUrl,
      },
    });
  };

  const handleGetSetting = async () => {
    const res = await asyncPostMessage({
      command: 'vscGetSetting',
    });
    setApiKey(res.data.apiKey);
    setDifyUrl(res.data.difyUrl);
  };

  useEffect(() => {
    handleGetSetting();
  }, []);
  return (
    <div styleName="setting">
      <div styleName="label">
        <div>API 密钥</div>
        <Input
          placeholder="请输入 API 密钥"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      <div styleName="label">
        <div>dify 服务地址</div>
        <Input
          placeholder="请输入dify服务地址"
          value={difyUrl}
          onChange={(e) => setDifyUrl(e.target.value)}
        />
      </div>

      <Button type="primary" size="small" onClick={handleSave}>
        保存
      </Button>
    </div>
  );
}
