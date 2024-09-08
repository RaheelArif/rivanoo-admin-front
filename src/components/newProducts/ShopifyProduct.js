import React, { useState } from "react";
import { BASE_URL } from "../../utils/appBaseUrl";
import { Form, Input, Button, Modal, Popconfirm, notification } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../app/slices/onlineProductSlice";

export default function ShopifyProduct({ record, id }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Fetch product details by ID
  const getProductById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/shopify/products/${id}`);
      const data = await response.json();
      if (data.product) {
        form.setFieldsValue({
          title: data.product.title,
          // Add other fields here if needed
        });
        setSelectedProduct(data.product);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // Handle product update
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (selectedProduct) {
        const updatedProduct = {
          ...selectedProduct,
          title: values.title,
          // Include other fields as needed
        };

        const response = await fetch(
          `${BASE_URL}/shopify/products/${selectedProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update the product");
        }

        const result = await response.json();
        notification.success({
          message: "Update Successful",
          description: "Product has been updated successfully.",
        });
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      notification.error({
        message: "Update Failed",
        description: "Failed to update the product. Please try again.",
      });
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    try {
      if (selectedProduct) {
        const response = await fetch(
          `${BASE_URL}/shopify/products/${selectedProduct.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete the product");
        }
        console.log(response);
        if (response.status) {
          dispatch(
            updateProduct({
              id: record._id,
              updatedProduct: {
                ...record,
                platforms: record.platforms
                  ? record.platforms.filter((f) => f.platform !== "Shopify")
                  : [],
              },
            })
          );
        }
        notification.success({
          message: "Delete Successful",
          description: `Product with ID ${selectedProduct.id} has been deleted successfully.`,
        });
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      notification.error({
        message: "Delete Failed",
        description: "Failed to delete the product. Please try again.",
      });
    }
  };

  return (
    <div>
      {record.platforms &&
        record.platforms.map((p, pi) => {
          return p.platform === "Shopify" ? (
            <Button
              key={pi}
              onClick={() => getProductById(p.id)}
              type="primary"
            >
              Open Shopify
            </Button>
          ) : null;
        })}

      <Modal
        title="Product Details"
        open={isModalVisible}
        onOk={handleUpdate}
        okText="Update"
        onCancel={() => setIsModalVisible(false)}
      >
        {selectedProduct && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input placeholder="Enter the product title" />
            </Form.Item>
            {/* Add other Form.Items as needed */}
          </Form>
        )}
        <Popconfirm
          title="Are you sure you want to delete this product?"
          onConfirm={handleDelete}
          okText="Delete"
          cancelText="Cancel"
        >
          <Button type="danger">Delete</Button>
        </Popconfirm>
      </Modal>
    </div>
  );
}
// 9578976543063
