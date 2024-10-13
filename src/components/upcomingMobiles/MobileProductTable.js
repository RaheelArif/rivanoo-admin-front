import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  Pagination,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Button,
} from "antd";
import {
  fetchMobileProducts,
  addMobileProduct,
  updateMobileProduct,
  deleteMobileProduct,
  setSelectedStatus,
  setSelectedBrands,
  setPage,
  setPageSize,
} from "../../app/slices/mobileProductSlice";
import moment from "moment";
import CompleteStatusTable from "./CompleteStatusTable";
import { debounce } from "lodash"; // To debounce the search input

const { Option } = Select;
const brandOptions = [
  { label: "huawei", value: "huawei" },
  { label: "xiaomi", value: "xiaomi" },
  { label: "iphone", value: "iphone" },
  { label: "iphone  watch", value: "iphone_watch" },
  { label: "sony", value: "sony" },
  { label: "samsung", value: "samsung" },
  { label: "samsung tab", value: "samsung_tab" },
  { label: "samsung watch", value: "samsung_watch" },
  { label: "google", value: "google" },
  { label: "motorola", value: "motorola" },
  { label: "oneplus", value: "oneplus" },
  { label: "vivo", value: "vivo" },
];

const rivanooStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Order", value: "order" },
  { label: "Complete", value: "complete" },
  { label: "Cancel", value: "cancel" },
];

const MobileProductTable = () => {
  const dispatch = useDispatch();
  const {
    items: mobileProducts,
    status,
    error,
    selectedStatus,
    selectedBrand,
    currentPage,
    pageSize,
    total,
  } = useSelector((state) => state.mobileProducts);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [rivanooStatus, setRivanooStatus] = useState(""); // State for rivanoo status

  // Debounce function for search input
  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
    dispatch(setPage(1)); // Reset to the first page on search
  }, 300); // 300ms delay for debouncing

  useEffect(() => {
    dispatch(
      fetchMobileProducts({
        status: selectedStatus,
        brand: selectedBrand,
        page: currentPage,
        size: pageSize,
        search: searchTerm, // Pass the search term to the fetch action
      })
    );
  }, [
    dispatch,
    selectedStatus,
    currentPage,
    pageSize,
    selectedBrand,
    searchTerm,
  ]);

  useEffect(() => {
    if (status === "failed" && error) {
      message.error(error);
    }
  }, [status, error]);

  const showModal = (product = null) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      release_date: product ? moment(product.release_date) : null,
      rivanoo_status: product ? product.rivanoo_status : null,
      brand: selectedBrand,
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        let formattedValues = {
          ...values,
          release_date: values.release_date
            ? values.release_date.format("YYYY-MM-DD")
            : null,
        };

        if (editingProduct) {
          if (
            values.rivanoo_status === "complete" &&
            values.description === "pending"
          ) {
            formattedValues = {
              ...formattedValues,
              description: values.skallhuset,
            };
          }
          // Update product and handle success/error
          dispatch(
            updateMobileProduct({
              id: editingProduct._id,
              mobileProduct: formattedValues,
            })
          )
            .then(() => {
              message.success("Mobile product updated successfully!");
            })
            .catch((err) => {
              message.error(`Error updating mobile product: ${err.message}`);
            });
        } else {
          formattedValues = {
            ...formattedValues,
            status: "complete", // Set status to "complete" for new product
          };

          // Add product and handle success/error
          dispatch(addMobileProduct(formattedValues))
            .then(() => {
              message.success("Mobile product added successfully!");
            })
            .catch((err) => {
              message.error(`Error adding mobile product: ${err.message}`);
            });
        }

        form.resetFields(); // Reset form fields
        setIsModalVisible(false); // Close modal
      })
      .catch(() => {
        message.error("Please fill out all required fields."); // Validation error
      });
  };

  const handleCancel = () => {
    form.resetFields(); // Reset the form fields
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteMobileProduct(id));
  };

  const handleStatusChange = (value) => {
    dispatch(setSelectedStatus(value));
    dispatch(setPage(1)); // Reset to the first page when status changes
  };

  const handleBrandChange = (value) => {
    dispatch(setSelectedBrands(value));
    dispatch(setPage(1)); // Reset to the first page when brand changes
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handlePageSizeChange = (current, size) => {
    dispatch(setPageSize(size));
    dispatch(setPage(1)); // Reset to the first page when page size changes
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add Mobile Product
      </Button>
      <Input
        placeholder="Search in Rivanoo"
        style={{ marginBottom: 16, width: 300, marginLeft: "10px" }}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Select
        style={{ marginBottom: 16, width: 200, marginLeft: "10px" }}
        placeholder="Select Brand"
        onChange={handleBrandChange}
        value={selectedBrand}
      >
        <Option value="">All Brand</Option>
        {brandOptions.map((b) => (
          <Option key={b.value} value={b.value}>
            {b.label}
          </Option>
        ))}
      </Select>

      <CompleteStatusTable
        showModal={showModal}
        handleDelete={handleDelete}
        mobileProducts={mobileProducts}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{ marginTop: 16, textAlign: "center" }}
      />

      <Modal
        title={editingProduct ? "Edit Mobile Product" : "Add Mobile Product"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: "Please select the brand!" }]}
          >
            <Select placeholder="Select a brand">
              {brandOptions.map((brand) => (
                <Option key={brand.value} value={brand.value}>
                  {brand.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Title"
            rules={[{ required: true, message: "Please input the Title!" }]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item name="skallhuset" label="Skallhuset">
            <Input allowClear />
          </Form.Item>

          <Form.Item name="rivanoo_status" label="Rivanoo Status">
            <Select placeholder="Select a status">
              {rivanooStatusOptions.map((status) => (
                <Option key={status.value} value={status.value}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MobileProductTable;
