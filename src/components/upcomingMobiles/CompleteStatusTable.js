import { Checkbox, Input, Popconfirm, Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FcCancel, FcShipped } from "react-icons/fc";
import { GiSandsOfTime } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
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
export default function CompleteStatusTable({
  showModal,
  handleDelete,
  mobileProducts,
}) {
  const dispatch = useDispatch();
  const [noteEdits, setNoteEdits] = useState({});

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
  const columns = [
    { title: "Brand", dataIndex: "brand", key: "brand" },

    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Accessories",
      key: "accessories",
      dataIndex: "accessories",
      render: (text, record) => (
        <Checkbox
          checked={text}
          onClick={(e) => {
            dispatch(
              updateMobileProduct({
                id: record._id,
                mobileProduct: { accessories: e.target.checked },
              })
            );
            console.log(e.target.checked, text);
          }}
        />
      ),
    },

    {
      title: "Lens Protector",
      key: "lens_protector",
      dataIndex: "lens_protector",
      render: (text, record) => (
        <Checkbox
          checked={text}
          onClick={(e) => {
            dispatch(
              updateMobileProduct({
                id: record._id,
                mobileProduct: { lens_protector: e.target.checked },
              })
            );
          }}
        />
      ),
    },
    {
      title: "Screen Protector",
      key: "screen_protector",
      dataIndex: "screen_protector",
      render: (text, record) => (
        <Checkbox
          checked={text}
          onClick={(e) => {
            dispatch(
              updateMobileProduct({
                id: record._id,
                mobileProduct: { screen_protector: e.target.checked },
              })
            );
          }}
        />
      ),
    },
    {
      title: "TPU Case",
      key: "tpu_case",
      dataIndex: "tpu_case",
      render: (text, record) => (
        <Checkbox
          checked={text}
          onClick={(e) => {
            dispatch(
              updateMobileProduct({
                id: record._id,
                mobileProduct: { tpu_case: e.target.checked },
              })
            );
            console.log(e.target.checked, text);
          }}
        />
      ),
    },
    {
      title: "CDON",
      key: "cdon",
      dataIndex: "cdon",
      render: (text, record) => (
        <Checkbox
          checked={text}
          onClick={(e) => {
            dispatch(
              updateMobileProduct({
                id: record._id,
                mobileProduct: { cdon: e.target.checked },
              })
            );
          }}
        />
      ),
    },
    {
      title: "Fyndiq",
      key: "fyndiq",
      dataIndex: "fyndiq",
      render: (text, record) => (
        <Checkbox
          checked={text}
          onClick={(e) => {
            dispatch(
              updateMobileProduct({
                id: record._id,
                mobileProduct: { fyndiq: e.target.checked },
              })
            );
          }}
        />
      ),
    },
    {
      title: "Amazon",
      key: "amazon",
      dataIndex: "amazon",
      render: (text, record) => (
        <Checkbox
          checked={text}
          onClick={(e) => {
            dispatch(
              updateMobileProduct({
                id: record._id,
                mobileProduct: { amazon: e.target.checked },
              })
            );
          }}
        />
      ),
    },
    {
      title: "Skallhuset",
      key: "skallhuset",
      dataIndex: "skallhuset",

      render: (text, record) => (
        <Checkbox
          checked={text}
          onClick={(e) => {
            dispatch(
              updateMobileProduct({
                id: record._id,
                mobileProduct: { skallhuset: e.target.checked },
              })
            );
          }}
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
  return (
    <Table
      columns={columns}
      dataSource={mobileProducts}
      rowKey="_id"
      // rowClassName={getRowClassName}
      pagination={false} // Disable the built-in pagination
    />
  );
}
