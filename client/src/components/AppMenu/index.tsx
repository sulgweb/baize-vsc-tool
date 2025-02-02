import React from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'git',
    label: 'git总结',
  },
  {
    key: 'setting',
    label: '设置',
  },
];

const AppMenu: React.FC = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 160 }}
      defaultSelectedKeys={['git']}
      mode="inline"
      items={items}
    />
  );
};

export default AppMenu;