import { Button } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/appBaseUrl";

export default function PostButtons({ record }) {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.onlineProducts);

  const handleFyndiqPost = async () => {
    try {
      const payload = {
        sku: record.sku,
        gtin: record.legacy_product_id,
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
        // shipping_time: record.shipping_time.map(({ market = "SE", min, max }) => ({
        //   market,
        //   min,
        //   max,
        // })),
        shipping_time: [{ market: "SE", min: 1, max: 3 }],
      };

      const response = await axios.post(
        `${BASE_URL}/articles/create/fyndiq`,
        payload
      );
      console.log("Response:", response.data);
      alert("Article created successfully on Fyndiq!");
    } catch (error) {
      console.error(
        "Error posting to Fyndiq:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to create article on Fyndiq");
    }
  };

  return (
    <div>
      <Button onClick={() => handleFyndiqPost()}>Fyndiq</Button>
    </div>
  );
}
