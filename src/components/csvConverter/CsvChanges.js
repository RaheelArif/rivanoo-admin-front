import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "antd";
import CdonBtn from "./CdonBtn";
import ShopifyBtn from "./ShopifyBtn";

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


  return (
    <div>
      <h1>Fyndiq Excel Transformer</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {rawData.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <CdonBtn rawData={rawData} />
          <ShopifyBtn rawData={rawData} />
        </div>
      )}
    </div>
  );
};

export default ExcelTransformer;
