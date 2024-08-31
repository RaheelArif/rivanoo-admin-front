import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchGtins,
  addGtin,
  updateGtin,
  deleteGtin,
  setPage,
} from '../app/slices/gtinSlice';

const { Option } = Select;

const GtinTable = () => {
  const dispatch = useDispatch();
  const { items, status, page, total } = useSelector((state) => state.gtin);

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [gtinStatus, setGtinStatus] = useState("");

  useEffect(() => {
    dispatch(fetchGtins({ page, status: gtinStatus }));
  }, [dispatch, page, gtinStatus]);

  const handleAdd = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        dispatch(updateGtin({ id: editingProduct.id, gtin: values }));
      } else {
        dispatch(addGtin(values));
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
    dispatch(deleteGtin(id));
  };

  const columns = [
    {
      title: 'Gtin',
      dataIndex: 'gtin',
      key: 'gtin',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Product Id',
      dataIndex: 'product_id',
      key: 'product_id',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Gtin
        </Button>
        <Select
          placeholder="Filter by Status"
          onChange={(value) => setGtinStatus(value)}
          value={gtinStatus}
          style={{ width: 200 }}
          allowClear
        >
          <Option value="">All</Option>
          <Option value="pending">Pending</Option>
          <Option value="complete">Complee</Option>
        </Select>
      </Space>
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
        title={editingProduct ? 'Edit Gtin' : 'Add Gtin'}
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
            name="gtin"
            label="Gtin ID"
            rules={[{ required: true, message: 'Please input the Gtin ID!' }]}
          >
            <Input type="number" />
          </Form.Item>
     
        </Form>
      </Modal>
    </>
  );
};

export default GtinTable;
