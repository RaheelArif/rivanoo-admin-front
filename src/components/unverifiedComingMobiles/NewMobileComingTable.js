import React, { useEffect, useState } from "react";
import { Table, Spin, Pagination, Tag, Button, Input, Select, Space, Popconfirm, Modal, Form, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMobileProducts,
  addMobileProduct,
  updateMobileProduct,
  deleteMobileProduct,
  setSearch,
  setBrand,
  setPage,
  setPageSize,
} from "../../app/slices/newMobileComingSlice";
import Papa from "papaparse";
import moment from "moment";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

// Modal form for Create/Edit
const MobileProductForm = ({ visible, onCreate, onCancel, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          release_date: moment(initialValues.release_date),
        });
      }
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      visible={visible}
      title={initialValues ? "Edit Mobile Product" : "Add New Mobile Product"}
      okText={initialValues ? "Update" : "Create"}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate({
              ...values,
              release_date: values.release_date.toISOString(),
            });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="mobile_product_form">
        <Form.Item
          name="release_date"
          label="Release Date"
          rules={[{ required: true, message: "Please select the release date!" }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select the status!" }]}
        >
          <Select placeholder="Select status">
            <Option value="coming_soon">Coming Soon</Option>
            <Option value="ordered">Ordered</Option>
            <Option value="complete">Complete</Option>
            <Option value="canceled">Canceled</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="brand"
          label="Brand"
          rules={[{ required: true, message: "Please input the brand!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const NewMobileComingTable = () => {
  const dispatch = useDispatch();
  const {
    items,
    status,
    error,
    total,
    currentPage,
    pageSize,
    search,
    brand,
  } = useSelector((state) => state.newMobileComing);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchMobileProducts({ page: currentPage, size: pageSize, search, brand }));
  }, [dispatch, currentPage, pageSize, search, brand]);

  // Columns definition
  const columns = [
    {
      title: "Release Date",
      dataIndex: "release_date",
      key: "release_date",
      render: (date) => moment(date).format("YYYY-MM-DD"),
      sorter: (a, b) => new Date(a.release_date) - new Date(b.release_date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Coming Soon", value: "coming_soon" },
        { text: "Ordered", value: "ordered" },
        { text: "Complete", value: "complete" },
        { text: "Canceled", value: "canceled" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color;
        switch (status) {
          case "coming_soon":
            color = "blue";
            break;
          case "ordered":
            color = "orange";
            break;
          case "complete":
            color = "green";
            break;
          case "canceled":
            color = "red";
            break;
          default:
            color = "gray";
        }
        return <Tag color={color}>{status.toUpperCase().replace("_", " ")}</Tag>;
      },
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      filters: Array.from(new Set(items.map((item) => item.brand))).map((brand) => ({
        text: brand,
        value: brand,
      })),
      onFilter: (value, record) => record.brand === value,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this mobile product?"
            onConfirm={() => dispatch(deleteMobileProduct(record._id))}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handle Create/Edit form submission
  const handleCreate = (values) => {
    if (editingProduct) {
      // Update existing product
      dispatch(updateMobileProduct({ id: editingProduct._id, mobileProduct: values }));
    } else {
      // Add new product
      dispatch(addMobileProduct(values));
    }
    setIsModalVisible(false);
    setEditingProduct(null);
  };



  // Handle Search
  const handleSearch = (value) => {
    dispatch(setSearch(value));
    dispatch(setPage(1)); // Reset to first page on search
  };

  // Handle Brand Filter
  const handleBrandFilter = (value) => {
    dispatch(setBrand(value));
    dispatch(setPage(1)); // Reset to first page on filter
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search by Title"
          onSearch={handleSearch}
          allowClear
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by Brand"
          onChange={handleBrandFilter}
          allowClear
          style={{ width: 200 }}
        >
          {Array.from(new Set(items.map((item) => item.brand))).map((brand) => (
            <Option key={brand} value={brand}>
              {brand}
            </Option>
          ))}
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Add Mobile Product
        </Button>
      </Space>
      {status === "loading" ? (
        <Spin tip="Loading..." />
      ) : status === "failed" ? (
        <p>Error: {error}</p>
      ) : (
        <Table
          columns={columns}
          dataSource={items}
          rowKey="_id"
          pagination={false} // We'll use Antd's Pagination component separately
        />
      )}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={(page, size) => {
          dispatch(setPage(page));
          dispatch(setPageSize(size));
        }}
        showSizeChanger
        pageSizeOptions={["10", "20", "50", "100"]}
        style={{ marginTop: 16, textAlign: "right" }}
      />
      <MobileProductForm
        visible={isModalVisible}
        onCreate={handleCreate}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProduct(null);
        }}
        initialValues={editingProduct}
      />
    </div>
  );
};

export default NewMobileComingTable;
