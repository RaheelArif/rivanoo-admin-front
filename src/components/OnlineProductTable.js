import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Pagination,
  Space,
  InputNumber,
  Checkbox,
  Row,
  Col,
} from "antd";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setPage,
  setPageSize,
} from "../app/slices/onlineProductSlice";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

const { Group: CheckboxGroup } = Checkbox;

const marketOptions = [
  { label: "SE", value: "SE", currency: "SEK" },
  { label: "NO", value: "NO", currency: "NOK" },
  { label: "DK", value: "DK", currency: "DKK" },
  { label: "FI", value: "FI", currency: "EUR" },
];
const OnlineProductTable = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
    total,
    currentPage,
    pageSize,
  } = useSelector((state) => state.onlineProducts);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedMarkets, setSelectedMarkets] = useState([]);

  const handleMarketChange = (checkedValues) => {
    setSelectedMarkets(checkedValues);

    // Get the current values of price, original_price, and shipping_time arrays from the form
    const currentPrices = form.getFieldValue("price") || [];
    const currentOriginalPrices = form.getFieldValue("original_price") || [];
    const currentShippingTimes = form.getFieldValue("shipping_time") || [];

    // Function to update price arrays based on selected markets
    const updatePriceArray = (currentArray) => {
      return checkedValues.map((market) => {
        const existingPrice = currentArray.find(
          (price) => price.market === market
        );
        if (existingPrice) {
          return existingPrice; // Keep the existing price object if it exists
        }
        const currency =
          marketOptions.find((option) => option.value === market)?.currency ||
          "";
        return {
          market,
          value: {
            amount: 0,
            currency,
          },
        };
      });
    };

    // Function to update shipping_time array based on selected markets
    const updateShippingTimeArray = () => {
      return checkedValues.map((market) => {
        const existingShippingTime = currentShippingTimes.find(
          (time) => time.market === market
        );
        if (existingShippingTime) {
          return existingShippingTime; // Keep the existing shipping time object if it exists
        }
        return {
          market,
          min: 1, // Default min value
          max: 3, // Default max value
        };
      });
    };

    // Update the form fields with the updated arrays
    form.setFieldsValue({
      markets: checkedValues,
      price: updatePriceArray(currentPrices),
      original_price: updatePriceArray(currentOriginalPrices),
      shipping_time: updateShippingTimeArray(),
    });
  };

  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        size: pageSize,
      })
    );
  }, [dispatch, currentPage, pageSize]);

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
          updateProduct({ id: editingProduct._id, updatedProduct: values })
        );
      } else {
        dispatch(addProduct(values));
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handlePageSizeChange = (current, size) => {
    dispatch(setPageSize(size));
  };
  const columns = [
    {
      title: "Post this Products",
      dataIndex: "01",
      key: "02",
      render: (image, row) => (
        <div>
          <Button onClick={() => console.log(row)}>Fyndiq</Button>
          <Button onClick={() => console.log(row)}>amazon</Button>
          <Button onClick={() => console.log(row)}>shopify</Button>
          <Button onClick={() => console.log(row)}>cdon</Button>
        </div>
      ),
    },
    { title: "SKU", dataIndex: "sku", key: "sku" },

    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) => categories.join(", "),
    },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Main Image",
      dataIndex: "main_image",
      key: "main_image",
      render: (image) => <img width={80} src={image} alt="" />,
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div>
          {images.map((image, index) => (
            <img
              key={index}
              width={80}
              src={image}
              alt={`Image ${index}`}
              style={{ marginRight: 8 }}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (titles) =>
        titles.map((title) => `${title.language}: ${title.value}`).join(", "),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (descriptions) =>
        descriptions
          .map((description) => `${description.language}: ${description.value}`)
          .join(", "),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (prices) =>
        prices
          .map(
            (price) =>
              `${price.market}: ${price.value.amount} ${price.value.currency}`
          )
          .join(", "),
    },
    {
      title: "Original Price",
      dataIndex: "original_price",
      key: "original_price",
      render: (originalPrices) =>
        originalPrices
          .map(
            (originalPrice) =>
              `${originalPrice.market}: ${originalPrice.value.amount} ${originalPrice.value.currency}`
          )
          .join(", "),
    },
    {
      title: "Shipping Time",
      dataIndex: "shipping_time",
      key: "shipping_time",
      render: (shippingTimes) =>
        shippingTimes
          .map(
            (shippingTime) =>
              `${shippingTime.market}: ${shippingTime.min} - ${shippingTime.max}`
          )
          .join(", "),
    },
    {
      title: "Markets",
      dataIndex: "markets",
      key: "markets",
      render: (markets) => markets.join(", "),
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
        Add Product
      </Button>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
        showSizeChanger
      />
      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        className="top-20-modal"
      >
        <CheckboxGroup
          options={marketOptions}
          value={selectedMarkets}
          onChange={handleMarketChange}
          style={{ marginBottom: 16 }}
        />
        <button onClick={() => console.log(form.getFieldValue())}>
          values
        </button>
        <Form form={form} layout="vertical">
          <Row>
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
                    { label: "Category 1", value: "category1" },
                    { label: "Category 2", value: "category2" },
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
                rules={[
                  { required: true, message: "Please select the status!" },
                ]}
              >
                <Select>
                  <Option value="for sale">for sale</Option>
                  <Option value="paused">paused</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  { required: true, message: "Please input the quantity!" },
                ]}
              >
                <InputNumber />
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
                    message: "Please input the main image URL!",
                  },
                ]}
              >
                <Input />
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
                                message: "Please input the image URL!",
                              },
                            ]}
                          >
                            <Input placeholder="Image URL" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
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
                              style={{ width: "100%" }}
                              placeholder="Title"
                            />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                        >
                          Add Title
                        </Button>
                      </Form.Item>
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
                <Form.List style={{ width: "100%" }} name="description">
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
                              style={{ width: "100%" }}
                              placeholder="Description"
                            />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                        >
                          Add Description
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>
            <Col span={12}>
              {" "}
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
              {" "}
              <Form.Item name="original_price" label="Original Price">
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
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default OnlineProductTable;
