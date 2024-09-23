import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "antd";

const ExcelTransformer = () => {
  const [rawData, setRawData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("Parsed Excel Data:", jsonData);
      setRawData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

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
      category: `${row["category:1"] || ""}${
        row["category:2"] ? ";" + row["category:2"] : ""
      }`.trim(),
      priceSE: row["price:SE:SEK"]?.toString().trim() || "",
      gtin: "",
    };
  };

  const transformRowType2 = (row) => {
    console.log("Processing row:", row);

    const baseRow = {
      Handle: row["title:sv-SE"]?.toString().trim().replace(/\s+/g, "-") || "",
      Title: row["title:sv-SE"]?.toString().trim() || "",
      "Body (HTML)": row["description:sv-SE"]?.toString().trim() || "",
      Vendor: row["brand"]?.toString().trim() || "",
      "Product Category": row["category:1"]?.toString().trim() || "",
      Tags: `${row["category:1"] || ""}${
        row["category:2"] ? ", " + row["category:2"] : ""
      }`.trim(),
      "Variant SKU": row["sku"]?.toString().trim() || "",
      "Variant Grams": "",
      "Variant Inventory Qty": row["quantity"]?.toString().trim() || "",
      "Variant Price": row["price:SE:SEK"]?.toString().trim() || "",
      "Variant Compare At Price":
        row["original_price:SE:SEK"]?.toString().trim() || "",
      "Image Src": row["main_image_url"]?.toString().trim() || "",
      "Image Position": "1",
      "SEO Title": row["title:sv-SE"]?.toString().trim() || "",
      "SEO Description":
        row["description:sv-SE"]?.toString().trim().substring(0, 150) + "...",
      Status:
        row["status"]?.toString().trim().toLowerCase() === "for sale"
          ? "active"
          : "draft",
    };

    const rows = [baseRow];

    for (let i = 1; i <= 6; i++) {
      const imageUrl = row[`other_image_url:${i}`];
      if (imageUrl && imageUrl.trim() !== "") {
        console.log(`Adding additional row for image ${i}:`, imageUrl);
        rows.push({
          Handle: baseRow.Handle,
          "Image Src": imageUrl.trim(),
          "Image Position": (i + 1).toString(),
        });
      }
    }

    console.log("Returning rows:", rows);
    return rows;
  };

  const downloadTransformedExcel = (transformationType) => {
    if (rawData.length === 0) {
      alert("No data to download. Please upload an Excel file first.");
      return;
    }

    let transformedData;
    if (transformationType === "cdon") {
      transformedData = rawData.map(transformRow);
    } else {
      transformedData = rawData.flatMap(transformRowType2);
    }

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
    <div>
      <h1>Excel Transformer</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {rawData.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Button
            style={{ marginRight: "20px" }}
            type="primary"
            onClick={() => downloadTransformedExcel("cdon")}
          >
            Download CDON
          </Button>
          <Button
            type="primary"
            onClick={() => downloadTransformedExcel("shopify")}
          >
            Download Shopify
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExcelTransformer;
