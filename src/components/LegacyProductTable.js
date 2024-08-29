// src/components/LegacyProductTable.js
import React, { useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchLegacyProducts,
  addLegacyProduct,
  updateLegacyProduct,
  deleteLegacyProduct,
  setPage,
} from '../app/slices/legacyProductSlice';

const LegacyProductTable = () => {
  const dispatch = useDispatch();
  const { items, status, page, total } = useSelector((state) => state.legacyProduct);

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);

  useEffect(() => {
    dispatch(fetchLegacyProducts(page));
  }, [dispatch, page]);

  const handleAdd = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        dispatch(updateLegacyProduct({ id: editingProduct.id, legacyProduct: values }));
      } else {
        dispatch(addLegacyProduct(values));
      }
      setIsModalVisible(false);
      setEditingProduct(null);
      form.resetFields();
    });
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (id) => {
    dispatch(deleteLegacyProduct(id));
  };

  const columns = [
    {
      title: 'Legacy Product ID',
      dataIndex: 'legacy_product_id',
      key: 'legacy_product_id',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add Legacy Product
      </Button>
      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: 5,
          total,
          onChange: (page) => dispatch(setPage(page)),
        }}
      />
      <Modal
        title={editingProduct ? 'Edit Legacy Product' : 'Add Legacy Product'}
        open={isModalVisible}
        onOk={handleAdd}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProduct(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="legacy_product_id"
            label="Legacy Product ID"
            rules={[{ required: true, message: 'Please input the legacy product ID!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LegacyProductTable;
