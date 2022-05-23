import { PieChartOutlined, DesktopOutlined, UserOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Layout, Menu } from 'antd';
import { useState } from 'react';
const { Content, Sider } = Layout;

export function SideMenu() {
  const [collapsed, setCollapsed] = useState(false);
  return <SideMenuStyled></SideMenuStyled>;
}

const SideMenuStyled = styled.div``;
