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
import OnlineProductForm from "./OnlineProductForm";
import AddNew from "./newProducts/AddNew";

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
      title: "GTIN",
      dataIndex: "gtin",
      key: "gtin",
      render: (text) => text,
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
          <AddNew isEdit={true} record={record} />
          <Button onClick={() => handleDelete(record._id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <AddNew />
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
    </>
  );
};

export default OnlineProductTable;
