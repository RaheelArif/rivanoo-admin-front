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
import MobileProductTable from "./upcomingMobiles/MobileProductTable";
import OnlineProductTable from "./OnlineProductTable";
import GtinTable from "./gtin/GtinTable";
import ShopifyProductTable from "./shopify/ShopifyProductTable";
import ProductTypeTable from "./ProductTypeTable/ProductTypeTable";
import CsvChanges from "./csvConverter/CsvChanges";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
        {/* <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        /> */}
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
              label: "Gitn",
            },

            {
              key: "10",
              icon: <UserOutlined />,
              label: "Shopify P  Types",
            },
            {
              key: "11",
              icon: <UserOutlined />,
              label: "CSV Convert",
            },
          ]}
          onClick={(v) => setSelected(v?.key)}
        />
        <div className="collapse-left0se-c">
          {collapsed ? (
            <FaArrowRight onClick={() => setCollapsed(!collapsed)} />
          ) : (
            <FaArrowLeft onClick={() => setCollapsed(!collapsed)} />
          )}
        </div>
      </Sider>
      <Layout style={{ height: "100vh" }}>
        {/* <Header
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
        </Header> */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            height: "100%",
            overflowY: "auto",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {selected === "1" ? <ProductsTable /> : null}
          {selected === "4" ? <Comments /> : null}
          {selected === "5" ? <OrderProductTable /> : null}
          {selected === "6" ? <MobileProductTable /> : null}
          {selected === "7" ? <OnlineProductTable /> : null}
          {selected === "8" ? <GtinTable /> : null}
          {selected === "10" ? <ProductTypeTable /> : null}
          {selected === "11" ? <CsvChanges /> : null}

          {/* {selected === "2" ? <OrdersTable />: null} */}
        </Content>
      </Layout>
    </Layout>
  );
};
export default AppLayout;
