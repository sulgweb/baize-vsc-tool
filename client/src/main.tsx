import { createRoot } from 'react-dom/client';
import { ConfigProvider, App, theme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './index.module.less';
import MainRouter from './router';

const BaseApp = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {},
      }}
      locale={zhCN}
    >
      <App>
        <MainRouter />
      </App>
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')!).render(<BaseApp />);
