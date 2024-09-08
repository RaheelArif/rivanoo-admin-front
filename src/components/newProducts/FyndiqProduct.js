import { Button, Modal } from "antd";
import React, { useState } from "react";
import { BASE_URL } from "../../utils/appBaseUrl";

export default function FyndiqProduct({ record }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getProduct = async (sku) => {
    try {
      // Fetch the product by SKU from your backend API
      const response = await fetch(`${BASE_URL}/articles/sku/${sku}`);
      const product = await response.json();

      // Set the selected product and open the modal
      setSelectedProduct(product);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching product by SKU:", error);
    }
  };
  return (
    <div>
      <Button onClick={() => getProduct(record.sku)} type="primary">
        Open Fyndiq
      </Button>
      <Modal
        title="Product Title"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        {selectedProduct && <p>hi</p>}
      </Modal>
    </div>
  );
}
