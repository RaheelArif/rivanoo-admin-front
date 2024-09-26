import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Pagination,
  message,
  Popconfirm,
  Spin,
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
import SmsSender from "./SmsSender";
import whatsAppImg from "../../images/whatsapp.png";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { LoadingOutlined } from "@ant-design/icons";
import { FcCancel, FcShipped } from "react-icons/fc";
import { GiSandsOfTime } from "react-icons/gi";
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

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = React.useState(null);

  useEffect(() => {
    dispatch(
      fetchMobileProducts({
        status: selectedStatus,
        brand: selectedBrand,
        page: currentPage,
        size: pageSize,
      })
    );
  }, [dispatch, selectedStatus, currentPage, pageSize, selectedBrand]);

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
    dispatch(setPage(1)); // Reset to the first page when status changes
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handlePageSizeChange = (current, size) => {
    dispatch(setPageSize(size));
    dispatch(setPage(1)); // Reset to the first page when page size changes
  };

  const getRowClassName = (record) => {
    const today = moment();
    const releaseDate = moment(record.release_date);
    const daysDifference = releaseDate.diff(today, "days");

    if (daysDifference < 10 && record.status === "coming_soon") {
      return "red-row";
    }
    if (record.status === "ordered") {
      return "yellow-row";
    }
    if (record.status === "complete") {
      return "green-row";
    }

    return "";
  };

  const columns = [
    { title: "Brand", dataIndex: "brand", key: "brand" },
    {
      title: "Release Date",
      dataIndex: "release_date",
      key: "release_date",
      render: (date) => (date ? moment(date).format("MMM YYYY") : "N/A"),
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          (
            <div className={getRowClassName(record)}>
              {text === "coming_soon" ? <GiSandsOfTime style={{fontSize:"25px"}} color="orange" /> : null}
              {text === "ordered" ? <FcShipped style={{fontSize:"25px"}}/> : null}
              {text === "complete" ? <TiTick style={{fontSize:"25px"}}/> : null}
              {text === "canceled" ? <FcCancel style={{fontSize:"25px"}}/> : null}
            </div>
          ) || "Unknown"
        );
      },
    },
    {
      title: "Last Reminder",
      dataIndex: "02",
      key: "02",
      render: (text, record) =>
        record.last_reminder ? (
          moment(record.last_reminder).fromNow()
        ) : (
          <p style={{ color: "red" }}>not send</p>
        ),
    },
    {
      title: "Reminder",
      dataIndex: "01",
      key: "01",
      render: (text, record) => (
        <div style={{ display: "flex" }}>
          <SmsSender record={record} />
          <img
            className="wp-img-t"
            onClick={() => handleWhatsAppClick(record)}
            src={whatsAppImg}
            alt=""
          />
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="icons-cont">
          <FaEdit
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          />

          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record._id)} // Function to execute when user confirms
            okText="Yes"
            cancelText="No"
          >
            <MdDelete className="delete-icon" />
          </Popconfirm>
        </div>
      ),
    },
  ];
  const handleWhatsAppClick = (record) => {
    const messageBody = `Brand = ${record.brand}\n\n ${
      record.description
    } is  coming on ${moment(record.release_date).format(
      "MMMM Do YYYY"
    )} \n\n if already ordered please update status `;
    const whatsappURL = `https://api.whatsapp.com/send?phone=+8613006881863&text=${encodeURIComponent(
      messageBody
    )}`;
    window.open(whatsappURL, "_blank");
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
      <Select
        style={{ marginBottom: 16, width: 200, margin: "0px  10px" }}
        placeholder="Select Status"
        onChange={handleStatusChange}
        value={selectedStatus} // Controlled value
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
        value={selectedBrand} // Controlled value
      >
        <Option value="">All Brand</Option>
        {brandOptions &&
          brandOptions.map((b, bi) => {
            return <Option value={b.value}>{b.label}</Option>;
          })}
      </Select>
      <Table
        columns={columns}
        dataSource={mobileProducts}
        rowKey="_id"
        // rowClassName={getRowClassName}
        pagination={false} // Disable the built-in pagination
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
        showSizeChanger={false}
        // onShowSizeChange={handlePageSizeChange}
        // pageSizeOptions={['10', '20', '30', '40']}
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
