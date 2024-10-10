import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import moment from "moment";

const { Option } = Select;

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
      open={visible}
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

export default MobileProductForm;
