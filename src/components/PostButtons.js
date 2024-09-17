import { Button, Checkbox, message } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/appBaseUrl";
import { updateProduct } from "../app/slices/onlineProductSlice";
import FyndiqProduct from "./newProducts/FyndiqProduct";
import { addProduct } from "../app/slices/shopifySlice";
import ShopifyProduct from "./newProducts/ShopifyProduct";

export default function PostButtons({ record }) {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.onlineProducts);

  const handleFyndiqPost = async (wb) => {
    try {
      const payload = {
        sku: record.sku,
        // gtin: record.gtin,
        categories: record.categories,
        status: record.status,
        quantity: record.quantity,
        main_image: record.main_image,
        images: record.images,
        markets: record.markets,
        title: record.title.map(({ _id, ...rest }) => rest), // Remove _id
        description: record.description.map(({ _id, ...rest }) => rest), // Remove _id
        price: record.price.map(({ _id, value, market }) => ({
          market,
          value: {
            amount: value.amount,
            currency: value.currency,
          },
        })),
        original_price: record.original_price.map(({ _id, value, market }) => ({
          market,
          value: {
            amount: value.amount,
            currency: value.currency,
          },
        })),
        shipping_time: record.shipping_time.map(
          ({ market = "SE", min, max }) => ({
            market,
            min,
            max,
          })
        ),
      };

      const response = await axios.post(
        `${BASE_URL}/articles/create/fyndiq`,
        payload
      );
      console.log("Response:", response.data);
      if (response.data && response.data.data && response.data.data.id) {
        dispatch(
          updateProduct({
            id: record._id,
            updatedProduct: {
              ...record,
              platforms: [
                ...record.platforms,
                { platform: "Fyndiq", id: response.data.data.id },
              ],
            },
          })
        );
      }

      alert("Article created successfully on Fyndiq!");
    } catch (error) {
      console.error(
        "Error posting to Fyndiq:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to create article on Fyndiq");
    }
  };
  const createHtmlString = (description) => `<strong>${description}</strong>`;
  const handleShopifyPost = async () => {
    // Define your product object
    const newProduct = {
      title: record.sh_title,
      body_html: createHtmlString(record.sh_body_html),
      vendor: record.sh_vendor,
      product_type: record.sh_product_type,
      variants: [
        {
          option1: "Blue",
          option2: "155",
        },
        {
          option1: "Black",
          option2: "159",
        },
      ],
      options: [
        {
          name: "Color",
          values: ["Blue", "Black"],
        },
        {
          name: "Size",
          values: ["155", "159"],
        },
      ],
    };

    try {
      // Dispatch the addProduct action and get the response
      const data = await dispatch(addProduct(newProduct)).unwrap();

      // Process the response data
      console.log("Product added successfully:", data);
      if (data.success && data.product && data.product.id) {
        dispatch(
          updateProduct({
            id: record._id,
            updatedProduct: {
              ...record,
              platforms: [
                ...record.platforms,
                { platform: "Shopify", id: data.product.id },
              ],
            },
          })
        );
      }
      // Optionally show a success message or update the UI
      message.success("Product added successfully!");

      // Update the UI or state based on the response
      // For example, you could trigger a fetch for the updated product list
      // dispatch(fetchProducts({ limit: 10, page: 1 }));
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("Failed to add product.");
    }
  };
  return (
    <div>
      {record.platforms &&
      record.platforms.some((p) => p.platform === "Fyndiq") ? (
        <FyndiqProduct record={record} />
      ) : (
        <Button onClick={() => handleFyndiqPost("Fyndiq")}> Fyndiq</Button>
      )}
      {record.platforms &&
      record.platforms.some((p) => p.platform === "Shopify") ? (
        <ShopifyProduct record={record} />
      ) : (
        <Button onClick={() => handleShopifyPost()}>Shopify</Button>
      )}
    </div>
  );
}
