import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import axios from "axios";
import { BASE_URL } from "../../utils/appBaseUrl";
import moment from "moment";

const SmsSender = ({ record }) => {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const sendMessage = async () => {
    const phoneNumber = "+46793011715";
    const messageBody = `Brand = ${record.brand}\n\n ${
      record.description
    } is  coming on ${moment(record.release_date).format(
      "MMMM Do YYYY"
    )} \n\n if already ordered please update status `; // Replace with the message content
    try {
      const response = await axios.post(`${BASE_URL}/send-sms`, {
        to: phoneNumber,
        message: messageBody,
        productId: record._id,
      });

      if (response.data && response.data.success) {
        message.success("Send");
      }
      return response.data;
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw error;
    }
  };

  return (
    <Button
      type="primary"
      onClick={() => sendMessage(record)}
      style={{ marginRight: 8 }}
    >
      Sms reminder
    </Button>
  );
};

export default SmsSender;
