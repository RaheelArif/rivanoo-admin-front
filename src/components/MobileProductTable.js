import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, Switch, message } from 'antd';
import { fetchMobileProducts, addMobileProduct, updateMobileProduct, deleteMobileProduct } from '../app/slices/mobileProductSlice';

const MobileProductTable = () => {
  const dispatch = useDispatch();
  const { items: mobileProducts, status, error } = useSelector((state) => state.mobileProducts);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMobileProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const showModal = (product = null) => {
    setEditingProduct(product);
    form.setFieldsValue(product || {});
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        dispatch(updateMobileProduct({ id: editingProduct._id, mobileProduct: values }));
      } else {
        dispatch(addMobileProduct(values));
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteMobileProduct(id));
  };

  const columns = [
    { title: 'Brand', dataIndex: 'brand', key: 'brand' },
    { title: 'Release Date', dataIndex: 'realise_date', key: 'realise_date' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text) => (text ? 'Active' : 'Inactive') },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button onClick={() => handleDelete(record._id)} danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Add Mobile Product
      </Button>
      <Table columns={columns} dataSource={mobileProducts} rowKey="_id" />
      <Modal
        title={editingProduct ? 'Edit Mobile Product' : 'Add Mobile Product'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="brand" label="Brand" rules={[{ required: true, message: 'Please input the brand!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="realise_date" label="Release Date" rules={[{ required: true, message: 'Please input the release date!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input the description!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MobileProductTable;
