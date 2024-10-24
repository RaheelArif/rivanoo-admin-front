// components/OrdersTable.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Space,
  Select,
  DatePicker,
  Input,
  Button,
  Tag,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../../utils/appBaseUrl";
import { PDFDownloadLink } from '@react-pdf/renderer';
import DeliveryNotePDF from './DeliveryNotePDF';
import { DownloadOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const { Option } = Select;

const CdonOrders = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const [filters, setFilters] = useState({
    customerType: "",
    countryCode: "",
    state: "",
    paymentStatus: "",
    dateRange: "",
  });

  // Filter options (these could be fetched from the backend)
  const customerTypes = ["B2C", "B2B"];
  const countries = ["Sweden", "Norway", "Denmark", "Finland"];
  const states = ["Pending", "Delivered", "Cancelled", "Returned", "Invoiced"];
  const paymentStates = [
    "NotApplicable",
    "AwaitingPayment",
    "Paid",
    "AwaitingRefund",
    "Refunded",
  ];

  // Status color mapping
  const stateColors = {
    Pending: "gold",
    Delivered: "green",
    Cancelled: "red",
    Returned: "orange",
    Invoiced: "blue",
  };

  const paymentStateColors = {
    NotApplicable: "default",
    AwaitingPayment: "warning",
    Paid: "success",
    AwaitingRefund: "processing",
    Refunded: "error",
  };

  // Table columns definition
  const columns = [
    {
      title: "Order ID",
      dataIndex: ["OrderDetails", "OrderId"],
      key: "orderId",
      render: (text) => text,
    },

    {
      title: "Products",
      dataIndex: ["OrderDetails", "OrderRows"],
      key: "products",
      render: (orderRows) => (
        <Space direction="vertical">
          {orderRows.map((row, index) => (
            <div key={row.OrderRowId}>
              <p>{row.ProductName}</p>
            </div>
          ))}
        </Space>
      ),
      width: 400,
    },
    {
      title: "Status",
      dataIndex: ["OrderDetails", "State"],
      key: "state",
      render: (state) => (
        <Tag color={stateColors[state] || "default"}>{state}</Tag>
      ),
      filters: states.map((state) => ({ text: state, value: state })),
    },
    {
      title: "Payment Status",
      dataIndex: ["OrderDetails", "PaymentStatus"],
      key: "paymentStatus",
      render: (status) => (
        <Tag color={paymentStateColors[status] || "default"}>{status}</Tag>
      ),
      filters: paymentStates.map((status) => ({ text: status, value: status })),
    },
    {
      title: "Total Amount",
      dataIndex: ["OrderDetails", "TotalAmount"],
      key: "totalAmount",
      render: (amount, record) =>
        `${amount} ${record.OrderDetails.CurrencyCode}`,
      sorter: true,
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <Space>
                <PDFDownloadLink
                    document={<DeliveryNotePDF order={record} />}
                    fileName={`CDON-${record.OrderDetails.OrderId}.pdf`}
                >
                    {({ loading }) => (
                        <Button 
                            type="primary"
                            icon={<DownloadOutlined />}
                            loading={loading}
                        >
                            Delivery note
                        </Button>
                    )}
                </PDFDownloadLink>
            </Space>
        )
    }
    
  ];

  // Fetch orders from the backend
  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      const { page, pageSize, ...restParams } = params;
      const queryParams = new URLSearchParams({
        page: page || pagination.current,
        pageSize: pageSize || pagination.pageSize,
        ...filters,
        ...restParams,
      });

      const response = await axios.get(
        `${BASE_URL}/cdon/orders?${queryParams.toString()}`
      );

      setOrders(response.data.orders);
      setPagination({
        ...pagination,
        total: response.data.pagination.totalItems,
        current: response.data.pagination.currentPage,
        pageSize: response.data.pagination.pageSize,
      });
    } catch (error) {
      message.error("Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle table change (pagination, filters, sorting)
  const handleTableChange = (pagination, filters, sorter) => {
    fetchOrders({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    if (dates) {
      setFilters((prev) => ({
        ...prev,
        dateTimeRangeMin: dates[0].format("YYYY-MM-DD"),
        dateTimeRangeMax: dates[1].format("YYYY-MM-DD"),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        dateTimeRangeMin: undefined,
        dateTimeRangeMax: undefined,
      }));
    }
  };

  // Reset all filters
  const handleReset = () => {
    setFilters({
      customerType: "",
      countryCode: "",
      state: "",
      paymentStatus: "",
      dateRange: "",
    });
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // View order details
  const viewOrderDetails = (orderId) => {
    // Implement navigation to order details page
    console.log(`Viewing order ${orderId}`);
  };

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, [filters]);

  return (
    <Card title="CDON Orders">
      {/* Filters */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          style={{ width: 120 }}
          placeholder="Customer Type"
          allowClear
          value={filters.customerType}
          onChange={(value) => handleFilterChange("customerType", value)}
        >
          {customerTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: 120 }}
          placeholder="Country"
          allowClear
          value={filters.countryCode}
          onChange={(value) => handleFilterChange("countryCode", value)}
        >
          {countries.map((country) => (
            <Option key={country} value={country}>
              {country}
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: 120 }}
          placeholder="Status"
          allowClear
          value={filters.state}
          onChange={(value) => handleFilterChange("state", value)}
        >
          {states.map((state) => (
            <Option key={state} value={state}>
              {state}
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: 150 }}
          placeholder="Payment Status"
          allowClear
          value={filters.paymentStatus}
          onChange={(value) => handleFilterChange("paymentStatus", value)}
        >
          {paymentStates.map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>

        <RangePicker
          onChange={handleDateRangeChange}
          value={filters.dateRange}
        />

        <Button type="primary" onClick={() => fetchOrders()}>
          Search
        </Button>

        <Button onClick={handleReset}>Reset</Button>
      </Space>

      {/* Orders Table */}
      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(record) => record.OrderDetails.OrderId}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default CdonOrders;
