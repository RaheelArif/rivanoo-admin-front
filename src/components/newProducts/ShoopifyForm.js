import React from "react";
import { Button, Col, Form, Input, message, Row, Select, Upload } from "antd";
import { useState } from "react";
import { BASE_URL } from "../../utils/appBaseUrl";
import axios from "axios";
import Papa from "papaparse";
import { UploadOutlined } from "@ant-design/icons";
import ImageUploadOrUrl from "../ImageUploadOrUrl";
const { Option } = Select;

export default function ShoopifyForm({ form }) {
  const [productTypes, setProductTypes] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [csvData, setCsvData] = useState(null);

  const handleUpload = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data[0]; // Assume first row has the product data
        setCsvData(data); // Set the CSV data in state
        populateForm(data); // Populate form with CSV data
      },
      error: (error) => {
        message.error("Failed to parse CSV file");
      },
    });
    return false;
  };

  const populateForm = (data) => {
    console.log(data);
    form.setFieldsValue({
      sh_title: data["Title"],
      sh_body_html: data["Body (HTML)"],
      sh_vendor: data["Vendor"],
      sh_product_type: data["Product Category"],
      sh_status: data["Status"],
      sh_tags: data["Tags"],
      main_image: data["Image Src"],

      //   price: data['Variant Price'],
      //   sku: data['Variant SKU'],
    });
  };

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
  return (
    <Row>
      {" "}
      <Col span={24}>
        {" "}
        {/* CSV Upload Component */}
        <Form.Item label="Upload CSV">
          <Upload
            beforeUpload={handleUpload}
            accept=".csv"
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload CSV</Button>
          </Upload>
        </Form.Item>
        {/* <Button onClick={() => console.log(form.getFieldValue())}>
          CheckValues
        </Button> */}
      </Col>
      <Col span={12}>
        {" "}
        <Form.Item
          name="sh_title"
          label="title"
          rules={[
            { required: true, message: "Please input the shopify title!" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </Col>
      <Col span={12}>
        {" "}
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
        {" "}
        <Form.Item
          name="sh_vendor"
          label="Vendor"
          rules={[
            { required: true, message: "Please input the shopify Vendor!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="sh_product_type"
          label="Product Type"
          rules={[
            {
              required: true,
              message: "Please select a Product Type",
            },
          ]}
        >
          <Input.TextArea />
          {/* <Select
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
          </Select> */}
        </Form.Item>
      </Col>
      <Col span={12}>
        {" "}
        <Form.Item
          name="sh_status"
          label="Status"
          rules={[
            {
              required: true,
              message: "Please select at least one Status!",
            },
          ]}
        >
          {/* <Input /> */}
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
        <Form.Item name="sh_tags" label="Tags">
          <Input.TextArea />
        </Form.Item>
      </Col>
    </Row>
  );
}
