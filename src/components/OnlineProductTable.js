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
import axios from "axios";
import ImageUploadOrUrl from "./ImageUploadOrUrl";
import { BASE_URL } from "../utils/appBaseUrl";
import PostButtons from "./PostButtons";

const { Option } = Select;

const { Group: CheckboxGroup } = Checkbox;

const marketOptions = [
  { label: "SE", value: "SE", currency: "SEK" },
  { label: "NO", value: "NO", currency: "NOK" },
  { label: "DK", value: "DK", currency: "DKK" },
  { label: "FI", value: "FI", currency: "EUR" },
];
// Map each market to a corresponding language (example mapping)
const marketToLanguageMap = {
  SE: "sv-SE",
  NO: "nb-NO",
  DK: "da-DK",
  FI: "fi-FI",
};
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

    // Get the current values of the arrays from the form
    const currentPrices = form.getFieldValue("price") || [];
    const currentOriginalPrices = form.getFieldValue("original_price") || [];
    const currentShippingTimes = form.getFieldValue("shipping_time") || [];
    const currentTitles = form.getFieldValue("title") || [];
    const currentDescriptions = form.getFieldValue("description") || [];

    // Update the price, original_price, shipping_time, title, and description arrays based on the selected markets
    const updatedPrices = checkedValues.map((market) => {
      const existingPrice = currentPrices.find(
        (price) => price.market === market
      );
      if (existingPrice) {
        return existingPrice; // Keep the existing price object if it exists
      }
      const currency =
        marketOptions.find((option) => option.value === market)?.currency || "";
      return {
        market,
        value: {
          amount: 0,
          currency,
        },
      };
    });

    const updatedOriginalPrices = checkedValues.map((market) => {
      const existingOriginalPrice = currentOriginalPrices.find(
        (price) => price.market === market
      );
      if (existingOriginalPrice) {
        return existingOriginalPrice; // Keep the existing original_price object if it exists
      }
      const currency =
        marketOptions.find((option) => option.value === market)?.currency || "";
      return {
        market,
        value: {
          amount: 0,
          currency,
        },
      };
    });

    const updatedShippingTimes = checkedValues.map((market) => {
      const existingShippingTime = currentShippingTimes.find(
        (time) => time.market === market
      );
      if (existingShippingTime) {
        return existingShippingTime; // Keep the existing shipping_time object if it exists
      }
      return {
        market,
        min: 1,
        max: 3,
      };
    });

    const updatedTitles = checkedValues.map((market) => {
      const language = marketToLanguageMap[market]; // Map market to a specific language
      const existingTitle = currentTitles.find(
        (title) => title.language === language
      );
      if (existingTitle) {
        return existingTitle; // Keep the existing title object if it exists
      }
      return {
        language,
        value: "", // Add the default title or leave it blank for the user to fill in
      };
    });

    const updatedDescriptions = checkedValues.map((market) => {
      const language = marketToLanguageMap[market]; // Map market to a specific language
      const existingDescription = currentDescriptions.find(
        (description) => description.language === language
      );
      if (existingDescription) {
        return existingDescription; // Keep the existing description object if it exists
      }
      return {
        language,
        value: "", // Add the default description or leave it blank for the user to fill in
      };
    });

    form.setFieldsValue({
      markets: checkedValues,
      price: updatedPrices,
      original_price: updatedOriginalPrices,
      shipping_time: updatedShippingTimes,
      title: updatedTitles,
      description: updatedDescriptions,
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
  const getLanguageFromMarket = (market) => {
    switch (market) {
      case "SE":
        return "SV"; // Swedish
      case "NO":
        return "NB"; // Norwegian
      case "DK":
        return "DA"; // Danish
      case "FI":
        return "FI"; // Finnish
      default:
        return "EN"; // English as fallback
    }
  };
  const translateText = async (text, targetLanguage) => {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      null,
      {
        params: {
          auth_key: "495b011a-1b6c-4289-b4b5-afa97322c71e:fx", // Replace with your DeepL API key
          text,
          target_lang: targetLanguage,
        },
      }
    );
    return response.data.translations[0].text;
  };
  const handleDescriptionChange = async (value, form, fieldName) => {
    form.setFieldsValue({
      [fieldName]: value, // Set the initial input
    });

    const selectedMarkets = form.getFieldValue("markets");
    const translationPromises = selectedMarkets.map(async (market) => {
      const language = getLanguageFromMarket(market); // Function to map market to language code
      const translatedText = await translateText(value, language);
      return { language: marketToLanguageMap[market], value: translatedText };
    });

    const translatedDescriptions = await Promise.all(translationPromises);

    form.setFieldsValue({
      description: translatedDescriptions, // Update with translated descriptions
    });
  };
  const handleTitleChange = async (value, form, fieldName) => {
    form.setFieldsValue({
      [fieldName]: value, // Set the initial input
    });

    const selectedMarkets = form.getFieldValue("markets");
    const translationPromises = selectedMarkets.map(async (market) => {
      const language = getLanguageFromMarket(market); // Function to map market to language code
      const translatedText = await translateText(value, language);
      return { language: marketToLanguageMap[market], value: translatedText };
    });

    const translatedtitle = await Promise.all(translationPromises);

    form.setFieldsValue({
      title: translatedtitle,
    });
  };
  const [gtin, setgtin] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchgtin();
  }, []);

  const fetchgtin = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/gtin?page=1&size=57&status=pending`);
      setgtin(response.data.gtins);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch gtin", error);
      setLoading(false);
    }
  };
  const columns = [
    {
      title: "Post this Products",
      dataIndex: "01",
      key: "02",
      render: (image, row) => <PostButtons record={row} />,
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
      render: (descriptions) => {
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>
          {descriptions
            .map(
              (description) => `${description.language}: ${description.value}`
            )
            .join(", ")}
        </div>;
      },
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
          <Col style={{display:'none'}} span={24}>
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
                    message:
                      "Please input the main image URL or upload an image!",
                  },
                ]}
              >
                <ImageUploadOrUrl />
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
            <Col style={{display:'none'}} span={24}>
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
                              message:
                                "Please input the minimum shipping days!",
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
                              message:
                                "Please input the maximum shipping days!",
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
        </Form>
      </Modal>
    </>
  );
};

export default OnlineProductTable;
