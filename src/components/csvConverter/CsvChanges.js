import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "antd";

const ExcelTransformer = () => {
  const [excelData, setExcelData] = useState([]);

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

      const transformedData = jsonData.map((row) => transformRow(row));
      console.log("Transformed Data:", transformedData);

      setExcelData(transformedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const transformRow = (row) => {
    console.log("Raw Row Data:", row);

    return {
      sku: row["sku"]?.toString().trim() || "",
      brand: row["brand"]?.toString().trim() || "",
      titleSE: row["title:sv-SE"]?.toString().trim() || "",
      descriptionSE: row["description:sv-SE"]?.toString().trim() || "",
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
      gtin: "", // GTIN is not present in the provided data, so leaving it empty
    };
  };

  const downloadTransformedExcel = () => {
    if (excelData.length === 0) {
      alert("No data to download. Please upload an Excel file first.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transformed Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "transformed_data.xlsx");
  };

  return (
    <div>
      <h1>Excel Transformer</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {excelData.length > 0 && (
        <Button type="primary" onClick={downloadTransformedExcel}>
          Download CDON Transformed Excel
        </Button>
      )}
    </div>
  );
};

export default ExcelTransformer;
