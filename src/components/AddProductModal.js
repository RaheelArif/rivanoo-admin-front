import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';

const { Option } = Select;

const MobileProductModal = ({ visible, onClose, onSubmit, initialData }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields(); // Reset form fields after submission
  };

  return (
    <Modal
      title="Add/Edit Mobile Product"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Submit
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialData}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Brand"
          name="brand"
          rules={[{ required: true, message: 'Please enter the brand' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Release Date"
          name="release_date"
          rules={[{ required: true, message: 'Please select the release date' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter the description' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select the status' }]}
        >
          <Select>
            <Option value="coming_soon">Coming Soon</Option>
            <Option value="ordered">Ordered</Option>
            <Option value="complete">Complete</Option>
            <Option value="canceled">Canceled</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MobileProductModal;
