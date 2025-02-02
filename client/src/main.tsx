import { createRoot } from 'react-dom/client';
import { ConfigProvider, App, theme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './index.module.less';
import MainRouter from './router';
import AppMenu from './components/AppMenu';

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
        <div styleName='base-app'>
          <AppMenu />
          <div styleName='right'>
            <MainRouter />
          </div>

        </div>

      </App>
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')!).render(<BaseApp />);
