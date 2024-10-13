import { Checkbox, Input, Popconfirm, Table, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { updateMobileProduct } from "../../app/slices/mobileProductSlice";
import { GiSandsOfTime } from "react-icons/gi";
import { FcCancel, FcShipped } from "react-icons/fc";
import { TiTick } from "react-icons/ti";

export default function CompleteStatusTable({
  showModal,
  handleDelete,
  mobileProducts,
}) {
  const dispatch = useDispatch();
  const [noteEdits, setNoteEdits] = useState({});
  const [localProductState, setLocalProductState] = useState([]);

  // Sync localProductState with mobileProducts when mobileProducts change
  useEffect(() => {
    setLocalProductState(mobileProducts);
  }, [mobileProducts]);

  const handleNoteChange = (e, recordId) => {
    setNoteEdits({
      ...noteEdits,
      [recordId]: e.target.value,
    });
  };

  const handleNoteBlur = (record) => {
    if (noteEdits[record._id] !== record.notes) {
      dispatch(
        updateMobileProduct({
          id: record._id,
          mobileProduct: { notes: noteEdits[record._id] },
        })
      );
    }
  };

  const handleCheckboxChange = (e, record, field) => {
    // Optimistically update the local state
    const updatedProducts = localProductState.map((product) =>
      product._id === record._id
        ? { ...product, [field]: e.target.checked }
        : product
    );
    setLocalProductState(updatedProducts);

    // Dispatch API call to update backend
    dispatch(
      updateMobileProduct({
        id: record._id,
        mobileProduct: { [field]: e.target.checked },
      })
    );
  };

  const columns = [
    { title: "Brand", dataIndex: "brand", key: "brand" },
    {
      title: "Rivanoo",
      dataIndex: "description",
      key: "description",
      render: (text, record) =>
        text === "pending" ? (
          <Tag color="red">Pending</Tag>
        ) : (
          <p style={{ color: "green", fontSize: "600" }}> {text}</p>
        ),
    },
    {
      title: "Rivanoo Status",
      dataIndex: "rivanoo_status",
      key: "rivanoo_status",
      render: (text, record) => {
        return (
          (
            <div>
              {text === "order" ? (
                <FcShipped style={{ fontSize: "25px", color: "orange" }} />
              ) : null}
              {text === "complete" ? (
                <TiTick style={{ fontSize: "25px", color: "green" }} />
              ) : null}
              {text === "cancel" ? (
                <FcCancel style={{ fontSize: "25px", color: "red" }} />
              ) : null}
              {text === "pending" ? "Pending" : null}
            </div>
          ) || "Unknown"
        );
      },
    },
    {
      title: "Skallhuset",
      key: "skallhuset",
      dataIndex: "skallhuset",

      render: (text, record) =>
        text === "pending" ? <Tag color="red">Pending</Tag> : text,
    },
    {
      title: "Privacy",
      key: "privacy",
      dataIndex: "privacy",
      render: (text, record) => (
        <Checkbox
          checked={record.privacy}
          onChange={(e) => handleCheckboxChange(e, record, "privacy")}
        />
      ),
    },
    {
      title: "Lens Protector",
      key: "lens_protector",
      dataIndex: "lens_protector",
      render: (text, record) => (
        <Checkbox
          checked={record.lens_protector}
          onChange={(e) => handleCheckboxChange(e, record, "lens_protector")}
        />
      ),
    },
    {
      title: "Screen Protector",
      key: "screen_protector",
      dataIndex: "screen_protector",
      render: (text, record) => (
        <Checkbox
          checked={record.screen_protector}
          onChange={(e) => handleCheckboxChange(e, record, "screen_protector")}
        />
      ),
    },
    {
      title: "TPU Case",
      key: "tpu_case",
      dataIndex: "tpu_case",
      render: (text, record) => (
        <Checkbox
          checked={record.tpu_case}
          onChange={(e) => handleCheckboxChange(e, record, "tpu_case")}
        />
      ),
    },
    
    {
      title: "Rivanoo",
      key: "rivanoo",
      dataIndex: "rivanoo",
      render: (text, record) => (
        <Checkbox
          checked={record.rivanoo}
          onChange={(e) => handleCheckboxChange(e, record, "rivanoo")}
        />
      ),
    },
    {
      title: "CDON",
      key: "cdon",
      dataIndex: "cdon",
      render: (text, record) => (
        <Checkbox
          checked={record.cdon}
          onChange={(e) => handleCheckboxChange(e, record, "cdon")}
        />
      ),
    },
    {
      title: "Fyndiq",
      key: "fyndiq",
      dataIndex: "fyndiq",
      render: (text, record) => (
        <Checkbox
          checked={record.fyndiq}
          onChange={(e) => handleCheckboxChange(e, record, "fyndiq")}
        />
      ),
    },
    {
      title: "Amazon",
      key: "amazon",
      dataIndex: "amazon",
      render: (text, record) => (
        <Checkbox
          checked={record.amazon}
          onChange={(e) => handleCheckboxChange(e, record, "amazon")}
        />
      ),
    },
    {
      title: "Notes",
      key: "notes",
      dataIndex: "notes",
      render: (text, record) => (
        <Input.TextArea
          style={{ width: "200px" }}
          value={
            noteEdits[record._id] !== undefined ? noteEdits[record._id] : text
          }
          autoSize={{ minRows: 2, maxRows: 5 }}
          onChange={(e) => handleNoteChange(e, record._id)}
          onBlur={() => handleNoteBlur(record)}
        />
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
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <MdDelete className="delete-icon" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={localProductState}
      rowKey="_id"
      pagination={false} // Disable the built-in pagination
    />
  );
}
