// src/components/ProductTable.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Form, Input, Pagination } from "antd";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setPage,
} from "../../app/slices/shopifySlice";

const ShopifyProductTable = () => {
  const dispatch = useDispatch();
  const { products, loading, total, limit, page } = useSelector(
    (state) => state.shopify
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchProducts({ limit, page }));
  }, [dispatch, limit, page]);

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        dispatch(
          updateProduct({ id: editingProduct.id, updatedProduct: values })
        );
      } else {
        dispatch(addProduct(values));
      }
      setIsModalVisible(false);
    });
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "title", dataIndex: "title", key: "title" },
    // { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button
            danger
            disabled
            //   onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>
        Add Product
      </Button>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={page}
        total={total}
        pageSize={limit}
        onChange={handlePageChange}
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="title"
            rules={[
              { required: true, message: "Please enter the product title" },
            ]}
          >
            <Input />
          </Form.Item>
        
        </Form>
      </Modal>
    </div>
  );
};

export default ShopifyProductTable;
