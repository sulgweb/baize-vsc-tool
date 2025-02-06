import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '/git-data',
    label: 'git总结',
  },
  {
    key: '/setting',
    label: '设置',
  },
];

const AppMenu: React.FC = () => {
  const navigate = useNavigate();
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
    setSelectedKeys([e.key]);
  };

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
      setSelectedKeys(['/git-data']);
    } else {
      setSelectedKeys([path]);
    }
  }, [window.location.pathname]);

  return (
    <Menu
      onClick={onClick}
      style={{ width: 160 }}
      selectedKeys={selectedKeys}
      mode="inline"
      items={items}
    />
  );
};

export default AppMenu;
