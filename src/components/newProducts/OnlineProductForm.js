import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Button,
  Row,
  Col,
  Tabs,
  message,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import ImageUploadOrUrl from "../ImageUploadOrUrl";
import ShoopifyForm from "./ShoopifyForm";
const { Option } = Select;
const MAX_IMAGES = 10;
export default function OnlineProductForm({
  form,
  selectedMarkets,
  handleTitleChange,
  handleDescriptionChange,
  gtin,
  loading,
}) {
  const [tab, setTab] = useState("0");

  if (selectedMarkets.length === 0) {
    return <p>Please select at least one market to display the form.</p>;
  }

  const validatePrices = (_, value) => {
    const prices = form.getFieldValue("price");
    const originalPrices = form.getFieldValue("original_price");

    for (let i = 0; i < prices.length; i++) {
      const price = prices[i];
      const originalPrice = originalPrices.find(
        (op) => op.market === price.market
      );

      if (originalPrice && originalPrice.value.amount <= price.value.amount) {
        return Promise.reject(
          `Original price must be higher than price for market ${price.market}`
        );
      }
    }

    return Promise.resolve();
  };

  const items = [
    {
      key: "0",
      label: "Commoon",
    },
    {
      key: "1",
      label: "Fyndiq",
    },
    {
      key: "2",
      label: "Shopify",
    },
    {
      key: "3",
      label: "Cdon",
    },
  ];

  const fyndiqDetails = () => {
    return (
      <Row>
        <Col style={{ display: "none" }} span={24}>
          {" "}
          <Form.Item
            name="markets"
            label="markets"
            rules={[{ required: true, message: "Please input the market!" }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          {" "}
          <Form.Item
            name="categories"
            label="Categories"
            rules={[
              {
                required: true,
                message: "Please select at least one category!",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select categories"
              allowClear
              options={[
                { label: "332", value: 332 },
                { label: "18333", value: 18333 },
                { label: "Category 3", value: "category3" },
                { label: "Category 4", value: "category4" },
                { label: "Category 5", value: "category5" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          {" "}
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select>
              <Option value="for sale">for sale</Option>
              <Option value="paused">paused</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="GTIN"
            name="gtin"
            rules={[
              {
                required: true,
                message: "Please select a GTIN",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a gtin product ID"
              optionFilterProp="children"
              loading={loading}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {gtin.map((product) => (
                <Option key={product._id} value={product.gtin}>
                  {product.gtin}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          {" "}
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Col>

        <Col span={12}>
          {" "}
          <Form.Item name="images" label="Images">
            <Form.List name="images">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name]}
                        fieldKey={[fieldKey]}
                        rules={[
                          {
                            required: true,
                            message:
                              "Please input the image URL or upload an image!",
                          },
                        ]}
                      >
                        <ImageUploadOrUrl />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        if (fields.length < MAX_IMAGES) {
                          add();
                        }
                      }}
                      icon={<PlusOutlined />}
                      disabled={fields.length >= MAX_IMAGES}
                    >
                      Add Image
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Col>
        <Col span={24}>
          {" "}
          <Form.Item style={{ width: "100%" }} name="title" label="Title">
            <Form.List style={{ width: "100%" }} name="title">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        width: "100%",
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "language"]}
                        fieldKey={[fieldKey, "language"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the language!",
                          },
                        ]}
                      >
                        <Input placeholder="Language" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        fieldKey={[fieldKey, "value"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the title!",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Input
                          onBlur={(e) =>
                            handleTitleChange(e.target.value, form, [
                              name,
                              "value",
                            ])
                          }
                          style={{ width: "100%" }}
                          placeholder="Title"
                        />
                      </Form.Item>
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
          </Form.Item>
        </Col>
        <Col span={24}>
          {" "}
          <Form.Item
            style={{ width: "100%" }}
            name="description"
            label="Description"
          >
            <Form.List name="description">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        width: "100%",
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "language"]}
                        fieldKey={[fieldKey, "language"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the language!",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Input placeholder="Language" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        fieldKey={[fieldKey, "value"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the description!",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Input.TextArea
                          onBlur={(e) =>
                            handleDescriptionChange(e.target.value, form, [
                              name,
                              "value",
                            ])
                          }
                          style={{ width: "100%" }}
                          placeholder="Description"
                        />
                      </Form.Item>
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="original_price"
            label="Original Price"
            rules={[{ validator: validatePrices }]}
          >
            <Form.List name="original_price">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "market"]}
                        fieldKey={[fieldKey, "market"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the market!",
                          },
                        ]}
                      >
                        <Input placeholder="Market" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value", "amount"]}
                        fieldKey={[fieldKey, "value", "amount"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the amount!",
                          },
                          { validator: validatePrices },
                        ]}
                      >
                        <InputNumber placeholder="Amount" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value", "currency"]}
                        fieldKey={[fieldKey, "value", "currency"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the currency!",
                          },
                        ]}
                      >
                        <Input placeholder="Currency" />
                      </Form.Item>
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="price" label="Price">
            <Form.List name="price">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "market"]}
                        fieldKey={[fieldKey, "market"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the market!",
                          },
                        ]}
                      >
                        <Input placeholder="Market" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value", "amount"]}
                        fieldKey={[fieldKey, "value", "amount"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the amount!",
                          },
                          { validator: validatePrices },
                        ]}
                      >
                        <InputNumber placeholder="Amount" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "value", "currency"]}
                        fieldKey={[fieldKey, "value", "currency"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the currency!",
                          },
                        ]}
                      >
                        <Input placeholder="Currency" />
                      </Form.Item>
                    </Space>
                  ))}
                </>
              )}
            </Form.List>
          </Form.Item>
        </Col>
        <Col style={{ display: "none" }} span={24}>
          <Form.List name="shipping_time">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key}>
                    <Form.Item
                      {...restField}
                      name={[name, "market"]}
                      label="Market"
                      rules={[
                        {
                          required: true,
                          message: "Please input the market!",
                        },
                      ]}
                    >
                      <Input placeholder="e.g., SE" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "min"]}
                      label="Min Days"
                      rules={[
                        {
                          required: true,
                          message: "Please input the minimum shipping days!",
                        },
                      ]}
                    >
                      <Input type="number" placeholder="e.g., 1" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "max"]}
                      label="Max Days"
                      rules={[
                        {
                          required: true,
                          message: "Please input the maximum shipping days!",
                        },
                      ]}
                    >
                      <Input type="number" placeholder="e.g., 3" />
                    </Form.Item>
                    <Button type="danger" onClick={() => remove(name)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()}>
                  Add Shipping Time
                </Button>
              </>
            )}
          </Form.List>
        </Col>
      </Row>
    );
  };
  const commonDetails = () => {
    return (
      <Row>
        {" "}
        <Col span={12}>
          {" "}
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: "Please input the SKU!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          {" "}
          <Form.Item
            name="main_image"
            label="Main Image"
            rules={[
              {
                required: true,
                message: "Please input the main image URL or upload an image!",
              },
            ]}
          >
            <ImageUploadOrUrl />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  return (
    <Form form={form} layout="vertical">
      <Row>
        <Col span={24}>
          <Tabs
            defaultActiveKey={tab}
            activeKey={tab}
            items={items}
            onChange={(t) => setTab(t)}
            setTab
            centered
          />
        </Col>
        <Col span={24} style={{ display: tab === "0" ? "block" : "none" }}>
          {commonDetails()}
        </Col>
        <Col span={24} style={{ display: tab === "1" ? "block" : "none" }}>
          {fyndiqDetails()}
        </Col>
        <Col span={24} style={{ display: tab === "2" ? "block" : "none" }}>
        <ShoopifyForm  form={form}/>
          {/* {ShoopifyForm(form)} */}
        </Col>
      </Row>
    </Form>
  );
}
