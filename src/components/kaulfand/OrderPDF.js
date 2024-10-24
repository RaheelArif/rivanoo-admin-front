// src/components/OrderUnits/OrderPDF.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    fontSize: 10,
  },
  logo_container: {
    display: "flex",
    justifyContent: "space-between",
  },
  logo: { fontSize: 20 },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "right",
  },
  addressSection: {
    marginBottom: 10,
  },
  addressTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  addressBox: {
    border: "1px solid black",
    padding: 10,
    marginBottom: 20,
  },
  phoneSection: {
    marginBottom: 20,
  },
  phoneTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  phoneBox: {
    border: "1px solid black",
    padding: 10,
  },
  orderInfo: {
    marginBottom: 10,
  },
  table: {
    marginTop: 20,
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    padding: 5,

    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "#f5f5f5", // Light gray background
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    fontSize: 12,
    borderBottomColor: "#EEEEEE",
    paddingVertical: 8,
  },
  // Update column widths to match your layout
  colTitle: { width: "39%", fontSize: 12, fontWeight: 600 },
  colSKU: { width: "14%", fontSize: 12, fontWeight: 600 },
  colArtId: { width: "14%", fontSize: 12, fontWeight: 600 },
  colPris: { width: "11%", textAlign: "right", fontSize: 12, fontWeight: 600 },
  colAntal: { width: "11%", textAlign: "right", fontSize: 12, fontWeight: 600 },
  colTotalt: {
    width: "11%",
    textAlign: "right",
    fontSize: 12,
    fontWeight: 600,
  },
  colTitle2: { width: "39%" },
  colSKU2: { width: "14%", fontSize: 11 },
  colArtId2: { width: "14%", fontSize: 12 },
  colPris2: { width: "11%", textAlign: "right", fontSize: 12 },
  colAntal2: { width: "11%", textAlign: "right", fontSize: 12 },
  colTotalt2: { width: "11%", textAlign: "right", fontSize: 12 },
});

const OrderPDF = ({ order }) => {
  // Format the full name and address
  const formatName = (address) => {
    return `${address?.first_name || ""} ${address?.last_name || ""}`.trim();
  };

  const formatAddress = (address) => {
    const parts = [
      address?.company_name,
      address?.street,
      `${address?.postcode || ""} ${address?.city || ""}`.trim(),
    ].filter(Boolean);
    return parts;
  };

  // Format price to EUR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price || 0);
  };

  // Format date
  const formatDate = (dateStr) => {
    return dateStr ? dayjs(dateStr).format("YYYY-MM-DD HH:mm") : "N/A";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text>{dayjs().format("MM/DD/YY, h:mm A")}</Text>
          </View>
          <Text>Merchant Center</Text>
        </View>
        <View style={styles.logo_container}>
          <Text style={styles.logo}>TEST</Text>
          {/* Title */}
          <Text style={styles.title}>Plocksedel</Text>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressSection}>
          <Text style={styles.addressTitle}>Leveransadress</Text>
          <View style={styles.addressBox}>
            <Text style={{ margin: "5px 0px" }}>
              {formatName(order.shipping_address)}
            </Text>
            {formatAddress(order.shipping_address).map((line, index) => (
              <Text key={index}>{line}</Text>
            ))}
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.orderInfo}>
          <Text style={{ marginBottom: "5px" }}>
            Beställningsnummer: {order.id_order}
          </Text>
        </View>

        {/* Product Details */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colTitle}>Titel</Text>
            <Text style={styles.colSKU}>SKU</Text>
            <Text style={styles.colArtId}>Artikel id</Text>
            <Text style={styles.colPris}>Pris</Text>
            <Text style={styles.colAntal}>Antal</Text>
            <Text style={styles.colTotalt}>Totalt</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colTitle2}>
              {order.product?.title || "N/A"}
            </Text>
            <Text style={styles.colSKU2}>{order.id_offer}</Text>
            <Text style={styles.colArtId2}>{order.id_order_unit}</Text>
            <Text style={styles.colPris2}>{order.price}</Text>
            <Text style={styles.colAntal2}>1</Text>
            <Text style={styles.colTotalt2}>{order.price}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OrderPDF;
