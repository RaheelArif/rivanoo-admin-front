import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input, message, InputNumber } from "antd";
import {
  fetchOrderProducts,
  addOrderProduct,
  updateOrderProduct,
  deleteOrderProduct,
} from "../app/slices/orderProductSlice";

const OrderProductTable = () => {
  const dispatch = useDispatch();
  const {
    items: orderProducts,
    status,
    error,
  } = useSelector((state) => state.orderProducts);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrderProducts());
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
        dispatch(
          updateOrderProduct({ id: editingProduct._id, orderProduct: values })
        );
      } else {
        dispatch(addOrderProduct(values));
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteOrderProduct(id));
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Article ID", dataIndex: "article_id", key: "article_id" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Variations ID",
      dataIndex: "variations_id",
      key: "variations_id",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(record._id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add Order Product
      </Button>
      <Table columns={columns} dataSource={orderProducts} rowKey="_id" />
      <Modal
        title={editingProduct ? "Edit Order Product" : "Add Order Product"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="article_id"
            label="Article ID"
            rules={[
              { required: true, message: "Please input the article ID!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="variations_id"
            label="Variations ID"
            rules={[
              { required: true, message: "Please input the variations ID!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OrderProductTable;
