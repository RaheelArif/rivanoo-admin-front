import React, { useState, useEffect } from "react";
import { Table, Tag, Typography, message } from "antd";
import axios from "axios";
import { BASE_URL } from "../utils/appBaseUrl";
import Highlighter from "react-highlight-words";

const { Text } = Typography;

const FyndiqOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
    total: 100 * 50,
  });

  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize);
  }, []);

  const fetchOrders = async (page, pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/fyndiq-orders`, {
        params: {
          page,
          limit: pageSize,
        },
      });
      setOrders(response.data.orders);
      setPagination({
        ...pagination,
        current: page,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders. Please try again later.");
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    fetchOrders(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Highlighter
          highlightClassName="highlight"
          searchWords={[record.modelName[0]?.model]}
          autoEscape={true}
          textToHighlight={text}
        />
      ), // Adjust if title is an array of objects
    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      key: "modelName",
      render: (modelName) => (
        <>
          {modelName.map((item, index) => (
            <div key={index}>
              {/* <Tag style={{marginBottom:"10PX"}} color="blue">{item.model}</Tag>
              <br /> */}
              
              <Tag color="black">{item.quantity}</Tag>
              <Tag color="green">{item.productType}</Tag>

              {index < modelName.length - 1 && (
                <div
                  style={{ margin: "10px 0", borderTop: "1px solid #f0f0f0" }}
                />
              )}
            </div>
          ))}
        </>
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
  ];

  return (
    <div>
      <h1>Fyndiq Orders</h1>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default FyndiqOrdersTable;
