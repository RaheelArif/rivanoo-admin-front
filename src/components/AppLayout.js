import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import ProductsTable from "./ProductsTable";
import UploadComments from "./UploadComments";
import Comments from "../features/comments/Comments";
import OrderProductTable from "./OrderProductTable";
import MobileProductTable from "./MobileProductTable";
import OnlineProductTable from "./OnlineProductTable";
import LegacyProductTable from "./LegacyProductTable";

const { Header, Sider, Content } = Layout;
const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState("1");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <h1 style={{ color: "white" }}>Rivanoo</h1>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={selected}
          selectedKeys={selected}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "Products",
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "Orders",
            },
            {
              key: "3",
              icon: <UserOutlined />,
              label: "Profit",
            },
            {
              key: "4",
              icon: <UserOutlined />,
              label: "Comments",
            },
            {
              key: "5",
              icon: <UserOutlined />,
              label: "order Products",
            },
            {
              key: "6",
              icon: <UserOutlined />,
              label: "Upcoming Mobiles",
            },
            {
              key: "7",
              icon: <UserOutlined />,
              label: "Online(F , A ...)",
            },
            {
              key: "8",
              icon: <UserOutlined />,
              label: "Legacy Product Id",
            },
          ]}
          onClick={(v) => setSelected(v?.key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            height: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {selected === "1" ? <ProductsTable /> : null}
          {selected === "4" ? <Comments /> : null}
          {selected === "5" ? <OrderProductTable /> : null}
          {selected === "6" ? <MobileProductTable /> : null}
          {selected === "7" ? <OnlineProductTable /> : null}
          {selected === "8" ? <LegacyProductTable /> : null}

          {/* {selected === "2" ? <OrdersTable />: null} */}
        </Content>
      </Layout>
    </Layout>
  );
};
export default AppLayout;
