import React from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Upload,
} from "antd";
import { useState } from "react";
import { BASE_URL } from "../../utils/appBaseUrl";
import axios from "axios";

const { Option } = Select;

export default function ShoopifyForm({ form }) {
  const [productTypes, setProductTypes] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [tags, setTags] = useState([]); // For capturing entered tags

  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  const fetchProductTypes = async () => {
    setLoading2(true);
    try {
      const response = await axios.get(`${BASE_URL}/product-types`);
      setProductTypes(response.data?.productTypes);
    } catch (error) {
      setFetchError(error.message);
      message.error("Failed to load product types");
    } finally {
      setLoading2(false);
    }
  };

  // Fetch product types when the dropdown is opened
  const handleDropdownVisibleChange = (open) => {
    if (open && productTypes.length === 0) {
      fetchProductTypes();
    }
  };

  const handleTagsChange = (value) => {
    setTags(value); // Update tags when user adds or removes
    console.log("Tags selected: ", value);
  };

  return (
    <Row>
      <Col span={12}>
        <Form.Item
          name="sh_title"
          label="Title"
          rules={[
            { required: true, message: "Please input the shopify title!" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="sh_body_html"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please input the shopify Description!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="sh_vendor"
          label="Vendor"
          // rules={[
          //   { required: true, message: "Please input the shopify Vendor!" },
          // ]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="sh_product_type"
          label="Product Type"
          rules={[{ required: true, message: "Please select a Product Type" }]}
        >
          <Select
            showSearch
            placeholder="Select a Product Type"
            optionFilterProp="children"
            loading={loading2}
            onDropdownVisibleChange={handleDropdownVisibleChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {productTypes.map((type) => (
              <Option key={type._id} value={type._id}>
                {type.type}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="sh_status"
          label="Status"
          rules={[
            { required: true, message: "Please select at least one Status!" },
          ]}
        >
          <Select
            placeholder="Select Status"
            options={[
              { label: "Active", value: "Active" },
              { label: "Archived", value: "Archived" },
              { label: "Draft", value: "Draft" },
            ]}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        {/* Updated tags field */}
        <Form.Item
          name="sh_tags"
          label="Tags"
          rules={[
            { required: true, message: "Please input at least one tag!" },
          ]}
        >
          <Select
            mode="tags"
            placeholder="Enter or select tags"
            value={tags}
            onChange={handleTagsChange}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="sh_variant_grams"
          label="Variant Grams"
          rules={[
            {
              required: true,
              message: "Please input the weight (grams) for this variant!",
            },
          ]}
        >
          <InputNumber
            min={1}
            placeholder="Enter weight in grams"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="sh_image_position"
          label="Image Position"
          rules={[
            {
              required: true,
              message: "Please input the image position!",
            },
          ]}
        >
          <InputNumber
            min={1}
            placeholder="Enter image position"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="sh_seo_title" label="SEO Title">
          <Input.TextArea />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="sh_seo_description" label="SEO Description">
          <Input.TextArea />
        </Form.Item>
      </Col>
    </Row>
  );
}
