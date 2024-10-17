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
  fetchUpcomingProducts, // Use upcoming slice actions
  addUpcomingProduct,
  updateUpcomingProduct,
  deleteUpcomingProduct,
  setSelectedStatus,
  setSelectedBrands,
  setPage,
  setPageSize,
} from "../../app/slices/upcomingMobilesSlice"; // Change to upcomingSlice
import moment from "moment";
import CompleteStatusTable from "./CompleteStatusTable";
import UnCompleteTable from "./UnCompleteTable";
import { debounce } from "lodash"; // To debounce the search input
import { BASE_URL } from "../../utils/appBaseUrl";
import axios from "axios";
const { Option } = Select;
const brandOptions = [
  { label: "huawei", value: "huawei" },
  { label: "xiaomi", value: "xiaomi" },
  { label: "iphone", value: "iphone" },
  { label: "sony", value: "sony" },
  { label: "samsung", value: "samsung" },
  { label: "google", value: "google" },
  { label: "motorola", value: "motorola" },
  { label: "oneplus", value: "oneplus" },
  { label: "vivo", value: "vivo" },
];

const Upcoming = () => {
  const dispatch = useDispatch();
  const {
    items: upcomingProducts, // Update to match upcoming slice
    status,
    error,
    selectedStatus,
    selectedBrand,
    currentPage,
    pageSize,
    total,
  } = useSelector((state) => state.upcomingProducts); // Update selector for upcomingSlice

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isStatusComplete, setIsStatusComplete] = useState(false);
  // Debounce function for search input
  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
    dispatch(setPage(1)); // Reset to the first page on search
  }, 300); // 300ms delay for debouncing

  useEffect(() => {
    dispatch(
      fetchUpcomingProducts({
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
    });
    setIsModalVisible(true);
  };
  const handleStatusChangeComplete = (value) => {
    if (value === "complete") {
      setIsStatusComplete(true);
    } else {
      setIsStatusComplete(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteUpcomingProduct(id));
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
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let formattedValues = {
        ...values,
        release_date: values.release_date
          ? values.release_date.format("YYYY-MM-DD")
          : null,
      };

      if (editingProduct) {
        if (values.status === "complete") {
          if (
            !window.confirm(
              "Are you sure you want to mark this product as complete?"
            )
          ) {
            return;
          }

          formattedValues = {
            ...formattedValues,
            rivanoo_status: "complete",
          };

          try {
            const response = await axios.get(
              `${BASE_URL}/mobile_product?brand=${values.brand}&page=1&size=500`
            );
            console.log("GET response:", response.data, response.data?.total);
            formattedValues = {
              ...formattedValues,
              row_placement:
                response.data &&
                typeof response.data.total === "number" &&
                response.data.total >= 0
                  ? response.data.total + 1
                  : 1,
            };
          } catch (error) {
            console.error("Error fetching mobile product data:", error);
            formattedValues.row_placement = 1;
            message.error(
              "Failed to fetch product data. Using default row placement."
            );
          }
        }

        try {
          console.log("Updating product with data:", formattedValues);

          // Create a new object with only the fields that have changed
          const updatedFields = {};
          Object.keys(formattedValues).forEach((key) => {
            if (formattedValues[key] !== editingProduct[key]) {
              updatedFields[key] = formattedValues[key];
            }
          });

          console.log("Fields to update:", updatedFields);

          await dispatch(
            updateUpcomingProduct({
              id: editingProduct._id,
              mobileProduct: updatedFields, // Only send fields that have changed
            })
          );
          message.success("Product updated successfully");
        } catch (error) {
          console.error("Error updating product:", error);
          message.error("Failed to update product. Please try again.");
          return;
        }
      } else {
        try {
          await dispatch(addUpcomingProduct(formattedValues));
          message.success("Product added successfully");
        } catch (error) {
          console.error("Error adding product:", error);
          message.error("Failed to add product. Please try again.");
          return;
        }
      }
      setIsModalVisible(false);
    } catch (validationError) {
      console.error("Form validation failed:", validationError);
      message.error("Please fill in all required fields correctly.");
    }
  };
  return (
    <>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add Upcoming Product
      </Button>
      <Input
        placeholder="Search by name"
        style={{ marginBottom: 16, width: 300, marginLeft: "10px" }}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      <Select
        style={{ marginBottom: 16, width: 200, margin: "0px  10px" }}
        placeholder="Select Status"
        onChange={handleStatusChange}
        value={selectedStatus}
      >
        <Option value="">All Status</Option>
        <Option value="coming_soon">Upcoming</Option>
        <Option value="ordered">Ordered</Option>
        <Option value="complete">Complete</Option>
        <Option value="canceled">Canceled</Option>
      </Select>

      <Select
        style={{ marginBottom: 16, width: 200 }}
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

      <UnCompleteTable
        showModal={showModal}
        handleDelete={handleDelete}
        mobileProducts={upcomingProducts} // Use upcoming products
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
        title={
          editingProduct ? "Edit Upcoming Product" : "Add Upcoming Product"
        }
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
            name="release_date"
            label="Release Date"
            rules={[
              { required: true, message: "Please select the release date!" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select onSelect={handleStatusChangeComplete}>
              <Option value="coming_soon">Coming Soon</Option>
              <Option value="ordered">Ordered</Option>
              <Option value="complete">Complete</Option>
              <Option value="canceled">Canceled</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Upcoming;
