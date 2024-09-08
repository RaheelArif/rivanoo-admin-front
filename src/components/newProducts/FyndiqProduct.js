import React, { useState } from "react";
import { BASE_URL } from "../../utils/appBaseUrl";
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  Modal,
  Popconfirm,
  notification,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { updateProduct } from "../../app/slices/onlineProductSlice";

import { useDispatch } from "react-redux";
export default function FyndiqProduct({ record }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log("Form Values:", values);
  };
  const getProduct = async (sku) => {
    try {
      // Fetch the product by SKU from your backend API
      const response = await fetch(`${BASE_URL}/articles/sku/${sku}`);
      const product = await response.json();

      // Set the selected product and open the modal
      if (product.content && product.content.article) {
        const fetchedProduct = product.content.article;

        // Populate the form with fetched product data
        form.setFieldsValue({
          title: fetchedProduct.title,
          // Add other fields here as needed
        });

        // Set the selected product and open the modal
        setSelectedProduct(fetchedProduct);
        setSelectedMarkets(fetchedProduct);
        setIsModalVisible(true);

        console.log(fetchedProduct);
      }
    } catch (error) {
      console.error("Error fetching product by SKU:", error);
    }
  };
  const handleUpdate = async () => {
    try {
      // Collect the form values
      const values = await form.validateFields(); // Validate and get form values

      // Ensure the form values include all required fields for the product object
      let updatedProduct;
      if (selectedProduct) {
        updatedProduct = {
          brand: selectedProduct.brand,
          categories: selectedProduct.categories,
          description: selectedProduct.description,
          gtin: selectedProduct.gtin,
          images: selectedProduct.images,
          main_image: selectedProduct.main_image,
          shipping_time: selectedProduct.shipping_time,
          sku: selectedProduct.sku,
          status: selectedProduct.status,
          markets: selectedProduct.markets,
          title: values.title,
        };
      }
      // Get the articleId from the selected product or some other source
      const articleId = selectedProduct.id; // Adjust this to match your data structure

      // Send a PUT request to update the article
      const response = await fetch(`${BASE_URL}/articles/${articleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to update the article");
      }

      const result = await response.json();

      // Handle the response from the server
      console.log("Update successful:", result);

      // Close the modal or update UI as needed
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const articleId = selectedProduct.id;

      const response = await fetch(`${BASE_URL}/articles/${articleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the article");
      }

      const result = await response.json();
      dispatch(
        updateProduct({
          id: record._id,
          updatedProduct: {
            ...record,
            platforms: record.platforms
              ? record.platforms.filter((f) => f.platform !== "Fyndiq")
              : [],
          },
        })
      );
      notification.success({
        message: "Delete Successful",
        description: `Article with ID ${articleId} has been deleted successfully.`,
      });

      setIsModalVisible(false);
    } catch (error) {
      console.error("Error deleting article:", error);
      notification.error({
        message: "Delete Failed",
        description: "Failed to delete the article. Please try again.",
      });
    }
  };
  return (
    <div>
      <Button onClick={() => getProduct(record.sku)} type="primary">
        Open Fyndiq
      </Button>
      <Modal
        title="Product Title"
        open={isModalVisible}
        onOk={() => handleUpdate()}
        okText="Update"
        onCancel={() => setIsModalVisible(false)}
      >
        {selectedProduct && (
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.List name="title">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space
                      key={field.key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...field}
                        label="Language"
                        name={[field.name, "language"]}
                        fieldKey={[field.fieldKey, "language"]}
                        rules={[
                          {
                            required: true,
                            message: "Please select a language",
                          },
                        ]}
                      >
                        <Input placeholder="Enter the title" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Title"
                        name={[field.name, "value"]}
                        fieldKey={[field.fieldKey, "value"]}
                        rules={[
                          { required: true, message: "Please input the title" },
                        ]}
                      >
                        <Input placeholder="Enter the title" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        )}
        <Popconfirm
          title="Are you sure you want to delete this article?"
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
