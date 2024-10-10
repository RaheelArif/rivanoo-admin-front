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
  Spin,
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
import UnCompleteTable from "./UnCompleteTable";
import { debounce } from "lodash"; // To debounce the search input

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
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        release_date: values.release_date
          ? values.release_date.format("YYYY-MM-DD")
          : null,
      };

      if (editingProduct) {
        dispatch(
          updateMobileProduct({
            id: editingProduct._id,
            mobileProduct: formattedValues,
          })
        );
      } else {
        dispatch(addMobileProduct(formattedValues));
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
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
        placeholder="Search by name"
        style={{ marginBottom: 16, width: 300 , marginLeft: "10px" }}
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

      {selectedStatus === "complete" ? (
        <CompleteStatusTable
          showModal={showModal}
          handleDelete={handleDelete}
          mobileProducts={mobileProducts}
        />
      ) : (
        <UnCompleteTable
          showModal={showModal}
          handleDelete={handleDelete}
          mobileProducts={mobileProducts}
        />
      )}

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
            <Select>
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

export default MobileProductTable;
