import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, Select, message, Checkbox } from "antd";
import { addProduct, updateProduct } from "../../app/slices/onlineProductSlice";
import axios from "axios";
import { BASE_URL } from "../../utils/appBaseUrl";
import OnlineProductForm from "../OnlineProductForm";

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
const AddNew = ({ isEdit, record }) => {
  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
  } = useSelector((state) => state.onlineProducts);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedMarkets, setSelectedMarkets] = useState(["SE"]);
  useEffect(() => {
    if (isModalVisible && editingProduct === null) {
      handleMarketChange(selectedMarkets);
    } else if (isModalVisible && editingProduct) {
        handleMarketChange(editingProduct.markets);
    }
  }, [isModalVisible]);
  const handleMarketChange = (checkedValues) => {
    if (!checkedValues.includes("SE")) {
      checkedValues.push("SE");
    }
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
        return existingShippingTime;
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
    if (error) {
      message.error(error);
    }
  }, [error]);

  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
      // Set the first GTIN value when opening the modal for a new product
      if (gtin.length > 0) {
        form.setFieldsValue({ gtin: gtin[0].gtin });
      }
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
  const [gtin, setGtin] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        dispatch(
          updateProduct({ id: editingProduct._id, updatedProduct: values })
        ).then((resultAction) => {
          if (updateProduct.fulfilled.match(resultAction)) {
            message.success("Product updated successfully");
            resetForm();
          } else {
            message.error("Failed to update product");
          }
        });
      } else {
        dispatch(addProduct(values)).then((resultAction) => {
          if (addProduct.fulfilled.match(resultAction)) {
            message.success("Product added successfully");
            resetForm();
          } else {
            message.error("Failed to add product");
          }
        });
      }
      setIsModalVisible(false);
    });
  };

  const resetForm = () => {
    form.resetFields();
    setSelectedMarkets(["SE"]);
    setEditingProduct(null);
  };
  useEffect(() => {
    fetchGtin();
  }, []);

  const fetchGtin = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/gtin?page=1&size=57&status=pending`
      );
      setGtin(response.data.gtins);
      setLoading(false);

      // Automatically select the first GTIN value
      if (response.data.gtins.length > 0) {
        form.setFieldsValue({ gtin: response.data.gtins[0].gtin });
      }
    } catch (error) {
      console.error("Failed to fetch gtin", error);
      setLoading(false);
    }
  };

  return (
    <>
      {isEdit ? (
        <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>
          Edit
        </Button>
      ) : (
        <Button
          type="primary"
          onClick={() => showModal()}
          style={{ marginBottom: 16 }}
        >
          Add Product
        </Button>
      )}

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
        <OnlineProductForm
          form={form}
          selectedMarkets={selectedMarkets}
          handleTitleChange={handleTitleChange}
          handleDescriptionChange={handleDescriptionChange}
          gtin={gtin}
          loading={loading}
        />
      </Modal>
    </>
  );
};

export default AddNew;
