import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Upload, Select, Button, Typography, Space, message } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

// Constants
const BRANDS = {
  Huawei: "",
  Xiaomi: "",
  Iphone: "",
  Sony: "",
  Samsung: "",
  Google: "",
  Motorola: "",
  OnePlus: "",
  Vivo: "",
  Oneplus: "",
  Oppo: "",
  Ipad: "",
};

// Utility Functions
const utils = {
  stringToArrayBuffer: (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  },

  parseTitle: (titleString) => {
    try {
      const fixedTitle = titleString
        .replace(/'/g, '"')
        .replace(/None/g, "null");
      const title = JSON.parse(fixedTitle);
      const svSeTitle = title.find((t) => t.language === "sv-SE");
      return svSeTitle ? svSeTitle.value : "";
    } catch (error) {
      console.error("Error parsing title:", error);
      return "";
    }
  },
  getQuantity: (productName) => {
    const packMatch = productName.match(/(\d+)[-\s]?PACK/i);
    if (packMatch) {
      return parseInt(packMatch[1], 10);
    }
    return 1;
  },

  cleanModelName: (model) => {
    return model
      .replace(/^SKÄRMSKYDD\s+/i, "")
      .replace(/\s+(9H|3D|TOP\s+KVALITET|SUPER\s+KVALITET|HÖG\s+KVALITET)/i, "")
      .replace(/^-+|-+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  },
};

// Data Processing Functions
const dataProcessor = {
  extractModelInfo: (title) => {
    // First, fix concatenated titles by adding space before each "2-Pack"
    const fixedTitle = title.replace(/(\d-Pack)/g, " $1").trim();

    // Handle different title formats
    let normalizedTitle = fixedTitle;

    // If title starts with "Skärmskydd", add "1-Pack" at the start
    if (normalizedTitle.match(/^Skärmskydd\s/i)) {
      normalizedTitle = `1-Pack ${normalizedTitle}`;
    }
    // If title doesn't start with pack quantity, add it
    else if (!normalizedTitle.match(/^\d+\s*-?\s*Pack/i)) {
      normalizedTitle = `1-Pack ${normalizedTitle}`;
    }

    // Add "SKÄRMSKYDD" before "&" if it's missing
    normalizedTitle = normalizedTitle.replace(
      /(\d-Pack\s+[^&]+?)(?=\s*&)/gi,
      "$1 SKÄRMSKYDD"
    );

    const productName = normalizedTitle.trim().toUpperCase();
    let products = [];
    let mainModel = "";

    // Set to track unique models
    const uniqueModels = new Set();

    const productParts = productName
      .split(/\s*&\s*/)
      .map((part) => part.trim());

    for (let part of productParts) {
      let model = "";

      const privacyMatch = part.match(
        /PRIVACY\s+SKÄRMSKYDD\s+FOR\s+(.*?)(?:\s+-|$|\s+HÄRDAT)/i
      );
      const packMatch = part.match(
        /(\d+)[-\s]?PACK\s+(.*?)\s+(?:-|SKÄRMSKYDD|HÄRDAT\sGLAS|LINSSKYDD)/i
      );
      const noPackMatch = part.match(
        /(.*?)\s+(?:-|SKÄRMSKYDD|HÄRDAT\sGLAS|LINSSKYDD)/i
      );
      const skarmskyddMatch = part.match(
        /SKÄRMSKYDD\s+(.*?)(?:\s+-|$|\s+HÄRDAT)/i
      );

      if (privacyMatch) {
        model = privacyMatch[1];
      } else if (packMatch) {
        model = packMatch[2];
      } else if (skarmskyddMatch) {
        model = skarmskyddMatch[1];
      } else if (noPackMatch) {
        model = noPackMatch[1];
      }

      if (model) {
        model = utils.cleanModelName(model);

        if (model && model !== "PRIVACY") {
          const quantity = utils.getQuantity(part);
          const isLensProtector = part.includes("LINSSKYDD");
          const productType = part.toLowerCase().includes("privacy")
            ? "PRIVACY SKÄRMSKYDD"
            : isLensProtector
            ? "LINSSKYDD"
            : "SKÄRMSKYDD";

          if (!isLensProtector && model !== "LINSSKYDD") {
            mainModel = model;
          }

          if (isLensProtector && mainModel) {
            model = mainModel;
          }

          // Check if the model is already encountered
          if (!uniqueModels.has(model)) {
            uniqueModels.add(model); // Add the model to the set
            products.push({ model, quantity, productType });
          }
        }
      }
    }

    // If no valid models found, return the complete title
    if (products.length === 0) {
      return [
        {
          model: title, // Using complete title instead of "Unknown Model"
          quantity: 1,
          productType: "SKÄRMSKYDD",
        },
      ];
    }

    return products;
  },

  processExcelData: (sheet) => {
    return sheet
      .map((row) => {
        try {
          const titleValue = utils.parseTitle(row["title"]);
          const modelInfo = dataProcessor.extractModelInfo(titleValue);
          return {
            originalTitle: titleValue,
            models: modelInfo,
          };
        } catch (error) {
          console.error("Error processing row:", error);
          return {
            originalTitle: "",
            models: [],
          };
        }
      })
      .filter((item) => item.originalTitle !== "");
  },

  filterByBrand: (data, brand) => {
    if (!brand) return data;
    return data.filter((item) =>
      item.models.some((model) =>
        model.model.toUpperCase().includes(brand.toUpperCase())
      )
    );
  },
};

// File Operations
const fileOperations = {
  downloadCSV: (csvData, filename) => {
    const blob = new Blob([utils.stringToArrayBuffer(csvData)], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, filename);
  },
  createCSV: (data) => {
    // Create rows with model information
    const rows = data.flatMap((item) =>
      item.models.map((model) => ({
        original_title: item.originalTitle,
        model: model.model,
        quantity: model.quantity,
        product_type: model.productType,
      }))
    );

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    return XLSX.write(wb, { bookType: "csv", type: "binary" });
  },
};

const ExcelUploader = () => {
  const [csvData, setCsvData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheet = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        );

        const extractedData = dataProcessor.processExcelData(sheet);
        setCsvData(extractedData);
        message.success("File uploaded successfully");
      } catch (error) {
        message.error("Error processing file");
        console.error(error);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDownloadCSV = () => {
    try {
      const filteredData = dataProcessor.filterByBrand(csvData, selectedBrand);

      if (filteredData.length === 0) {
        message.warning("No data matches the selected filter");
        return;
      }

      const csvOutput = fileOperations.createCSV(filteredData);
      fileOperations.downloadCSV(
        csvOutput,
        `output_${selectedBrand || "all"}.csv`
      );
      message.success("File downloaded successfully");
    } catch (error) {
      message.error("Error downloading file");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <Title level={2} style={{ marginBottom: "24px" }}>
        Upload Excel and Generate CSV
      </Title>

      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div className="upload-section">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            style={{ marginBottom: "16px" }}
          />
        </div>

        {csvData.length > 0 && (
          <>
            <Select
              style={{ width: "100%" }}
              placeholder="Select a brand to filter"
              onChange={setSelectedBrand}
              allowClear
              size="large"
            >
              {Object.keys(BRANDS).map((brand) => (
                <Option key={brand} value={brand}>
                  {brand}
                </Option>
              ))}
            </Select>

            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadCSV}
              size="large"
            >
              Download {selectedBrand || "All"} CSV
            </Button>

            <div style={{ marginTop: "12px" }}>
              {`Total titles: ${csvData.length}`}
              {`Total unique models: ${
                new Set(
                  csvData.flatMap((item) => item.models.map((m) => m.model))
                ).size
              }`}
              {selectedBrand &&
                `, Filtered models: ${
                  new Set(
                    dataProcessor
                      .filterByBrand(csvData, selectedBrand)
                      .flatMap((item) => item.models.map((m) => m.model))
                  ).size
                }`}
            </div>
          </>
        )}
      </Space>
    </div>
  );
};

export default ExcelUploader;
