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
        shipping_time: record.shipping_time.map(({ market = "SE", min, max }) => ({
          market,
          min,
          max,
        })),

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



// const payload = {
//     categories: ["332", "18333"],
//     description: [{ language: "sv-SE", value: "sdvds<vdsvsdvdsv" }],
//     gtin: "1234234",
//     images: ["https://storage.googleapis.com/hadaya/26-8-2024/products/GOOGLE%20PIXEL%209/1%20PACK/GOOGLE%20PIXEL%209_1%20PACK_1.jpg"],
//     main_image: "https://i.postimg.cc/pxFKq0Bs/Google-Pixel-7-A.jpg"
// ,
//     markets: ["SE"],
//     original_price: [
//       { market: "SE", value: { amount: 100, currency: "SEK" } },
//     ],
//     price: [{ market: "SE", value: { amount: 100, currency: "SEK" } }],
//     quantity: 12,
//     shipping_time: [{ market: "SE", min: 1, max: 3 }],
//     sku: "weqfewf",
//     status: "for sale",
//     title: [{ language: "sv-SE", value: "vdsfdsfdsfdsvsdv dsvsdavds" }],
//   };
