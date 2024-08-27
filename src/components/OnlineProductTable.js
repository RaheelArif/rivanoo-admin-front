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
} from "antd";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setPage,
  setPageSize,
  setStatusFilter,
} from "../app/slices/onlineProductSlice";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

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
      title: "Legacy Product ID",
      dataIndex: "legacy_product_id",
      key: "legacy_product_id",
    },
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
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: "Please input the SKU!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="legacy_product_id"
            label="Legacy Product ID"
            rules={[
              {
                required: true,
                message: "Please input the Legacy Product ID!",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.List name="categories">
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
                        { required: true, message: "Please input a category!" },
                      ]}
                    >
                      <Input placeholder="Category" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Category
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select>
              <Option value="coming_soon">for sale</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="main_image"
            label="Main Image"
            rules={[
              { required: true, message: "Please input the main image URL!" },
            ]}
          >
            <Input />
          </Form.Item>

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

          <Form.Item
            name="markets"
            label="Markets"
            rules={[{ required: true, message: "Please input the markets!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="title" label="Title">
            <Form.List name="title">
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
                      >
                        <Input placeholder="Title" />
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

          <Form.Item name="description" label="Description">
            <Form.List name="description">
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
                            message: "Please input the description!",
                          },
                        ]}
                      >
                        <Input.TextArea placeholder="Description" />
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
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add Price
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

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
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add Original Price
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item name="shipping_time" label="Shipping Time">
            <Form.List name="shipping_time">
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
                        name={[name, "min"]}
                        fieldKey={[fieldKey, "min"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the minimum shipping time!",
                          },
                        ]}
                      >
                        <InputNumber placeholder="Min Shipping Time" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "max"]}
                        fieldKey={[fieldKey, "max"]}
                        rules={[
                          {
                            required: true,
                            message: "Please input the maximum shipping time!",
                          },
                        ]}
                      >
                        <InputNumber placeholder="Max Shipping Time" />
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
                      Add Shipping Time
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default OnlineProductTable;
