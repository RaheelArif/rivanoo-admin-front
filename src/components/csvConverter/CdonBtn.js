import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "antd";

const CdonBtn = ({ rawData }) => {
  const transformRow = (row) => {
    const formatDescription = (text) => {
      if (!text) return "";
      const formattedText = text.replace(/\n/g, "<br>");
      return `<p>${formattedText}</p>`;
    };

    return {
      sku: row["sku"]?.toString().trim() || "",
      brand: row["brand"]?.toString().trim() || "",
      titleSE: row["title:sv-SE"]?.toString().trim() || "",
      descriptionSE: formatDescription(row["description:sv-SE"]),
      originalPriceSe: row["original_price:SE:SEK"]?.toString().trim() || "",
      stock: row["quantity"]?.toString().trim() || "",
      mainImage: row["main_image_url"]?.toString().trim() || "",
      extraImages: [
        row["other_image_url:1"],
        row["other_image_url:2"],
        row["other_image_url:3"],
        row["other_image_url:4"],
        row["other_image_url:5"],
        row["other_image_url:6"],
      ]
        .filter(Boolean)
        .join("; "),
      deliveryTimeMinSe: row["shipping_time:min:SE"]?.toString().trim() || "",
      deliveryTimeMaxSe: row["shipping_time:max:SE"]?.toString().trim() || "",
      category: `5468`,
      priceSE: row["price:SE:SEK"]?.toString().trim() || "",
      gtin: row["gtin"]?.toString().trim() || "",
    };
  };

  const downloadTransformedExcel = (transformationType) => {
    if (rawData.length === 0) {
      alert("No data to download. Please upload an Excel file first.");
      return;
    }

    let transformedData;
    transformedData = rawData.map(transformRow);

    console.log(`Transformed ${transformationType} data:`, transformedData);

    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transformed Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, `${transformationType}_transformed_data.xlsx`);
  };

  return (
    <Button
      style={{ marginRight: "20px" }}
      type="primary"
      onClick={() => downloadTransformedExcel("cdon")}
    >
      Download CDON
    </Button>
  );
};

export default CdonBtn;
