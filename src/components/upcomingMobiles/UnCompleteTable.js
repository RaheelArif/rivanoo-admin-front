import { Popconfirm, Table } from "antd";
import moment from "moment";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { FcCancel, FcShipped } from "react-icons/fc";
import { GiSandsOfTime } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import SmsSender from "./SmsSender";
import whatsAppImg from "../../images/whatsapp.png";
export default function UnCompleteTable({
  showModal,
  handleDelete,
  mobileProducts,
}) {
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
              {text === "coming_soon" ? (
                <GiSandsOfTime style={{ fontSize: "25px" }} color="orange" />
              ) : null}
              {text === "ordered" ? (
                <FcShipped style={{ fontSize: "25px" }} />
              ) : null}
              {text === "complete" ? (
                <TiTick style={{ fontSize: "25px" }} />
              ) : null}
              {text === "canceled" ? (
                <FcCancel style={{ fontSize: "25px" }} />
              ) : null}
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
