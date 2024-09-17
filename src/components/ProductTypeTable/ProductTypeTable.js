import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Input,
  Button,
  Pagination,
  Modal,
  Form,
  Input as AntInput,
} from "antd";
import {
  fetchProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
  setPage,
  setSearch,
} from "../../app/slices/productTypesSlice";

const ProductTypeTable = () => {
  const dispatch = useDispatch();
  const { items, loading, currentPage, totalPages, totalItems, search } =
    useSelector((state) => state.productTypes);

  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [searchValue, setSearchValue] = useState(search);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchProductTypes({ page: currentPage, search }));
  }, [dispatch, currentPage, search]);

  const handleSearch = () => {
    dispatch(setSearch(searchValue));
    dispatch(setPage(1)); // Reset to the first page when searching
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handleCreate = () => {
    form.validateFields().then((values) => {
      dispatch(createProductType(values.type));
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({ type: record.type });
    setIsModalVisible(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      dispatch(updateProductType({ id: editing._id, type: values.type }));
      setEditing(null);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleDelete = (id) => {
    dispatch(deleteProductType(id));
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record)} type="link">
            Edit
          </Button>
          <Button onClick={() => handleDelete(record._id)} type="link" danger>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            setIsModalVisible(true);
          }}
          style={{ marginBottom: 16 }}
        >
          Create New Product Type
        </Button>
        <Input
          placeholder="Search by type"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: 200, marginRight: 16 }}
        />
        <Button onClick={handleSearch} type="primary">
          Search
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />

      <Pagination
        current={currentPage}
        pageSize={10}
        total={totalItems}
        onChange={handlePageChange}
        style={{ marginTop: 16 }}
      />

      <Modal
        visible={isModalVisible}
        title={editing ? "Edit Product Type" : "Create Product Type"}
        onCancel={() => {
          setEditing(null);
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={editing ? handleUpdate : handleCreate}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please input the type!" }]}
          >
            <AntInput />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductTypeTable;
