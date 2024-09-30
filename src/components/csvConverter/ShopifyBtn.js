import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button, Table } from "antd";

const ShopifyBtn = ({ rawData }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);

  const columns = [
    {
      title: "Title",
      dataIndex: "title:sv-SE",
      key: "title:sv-SE",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Price",
      dataIndex: "price:SE:SEK",
      key: "price:SE:SEK",
    },
  ];
  const transformRowType2 = (row) => {
    const baseRow = {
      Handle: row["title:sv-SE"]?.toString().trim().replace(/\s+/g, "-") || "",
      Title: row["title:sv-SE"]?.toString().trim() || "",
      "Body (HTML)": row["description:sv-SE"]?.toString().trim() || "",
      Vendor: row["brand"]?.toString().trim() || "",
      "Product Category": "1549",
      Tags: generateTags(row["title:sv-SE"] || ""),
      Published: "TRUE",
      "Option1 Name": "Title",
      "Option1 Value": "Default Title",
      "Variant SKU": row["sku"]?.toString().trim() || "",
      "Variant Grams": "50",
      "Variant Compare At Price":
        row["original_price:SE:SEK"]?.toString().trim() || "",
      "Variant Price": row["price:SE:SEK"]?.toString().trim() || "",
      "Variant Inventory Tracker": "shopify",
      "Variant Inventory Qty": row["quantity"]?.toString().trim() || "1000",
      "Variant Inventory Policy": "deny",
      "Variant Taxable": "false",
      "Image Src": row["main_image_url"]?.toString().trim() || "",
      "Image Position": "1",
      "SEO Title": generateCorrectedTitle(row["title:sv-SE"] || ""),
      "SEO Description": generateDescription(row["title:sv-SE"] || ""),
      Status:
        row["status"]?.toString().trim().toLowerCase() === "for sale"
          ? "active"
          : "draft",
    };

    const rows = [baseRow];

    for (let i = 1; i <= 6; i++) {
      const imageUrl = row[`other_image_url:${i}`];
      if (imageUrl && imageUrl.trim() !== "") {
        rows.push({
          Handle: baseRow.Handle,
          "Image Src": imageUrl.trim(),
          "Image Position": (i + 1).toString(),
        });
      }
    }

    return rows;
  };

  const generateDescription = (productName) => {
    const normalizedProductName = productName.toLowerCase(); // Normalize to lowercase for comparison

    // Extracting the model for description generation
    let model = "Unknown Model";

    if (normalizedProductName.includes("1-pack")) {
      model = productName
        .split(/1[-\s]?Pack/i)[1]
        .split("Skärmskydd")[0]
        .trim();
    } else if (normalizedProductName.includes("2-pack")) {
      model = productName
        .split(/2[-\s]?Pack/i)[1]
        .split("Skärmskydd")[0]
        .trim();
    }

    // Generating the SEO description
    if (
      normalizedProductName.includes("1-pack") ||
      normalizedProductName.includes("2-pack")
    ) {
      return (
        `Skydda din ${model} med vårt högkvalitativa härdat glas skärmskydd. ` +
        "Ger full täckning och skydd mot smuts, fläckar och repor. " +
        "Oleofob beläggning mot fingeravtryck, enkel installation med perfekt passform. " +
        "Inkluderar även kameraskydd och rengöringskit. " +
        `Idealiskt för din ${model}. Köp idag och skydda din enhet!`
      );
    }

    return `Skydda din ${model} med vårt högkvalitativa härdat glas skärmskydd.`;
  };

  const generateCorrectedTitle = (productName) => {
    const normalizedProductName = productName.trim().toUpperCase();
    let model = "";

    // Handle different pack configurations and extract the model accordingly
    if (normalizedProductName.includes("1 PACK")) {
      model = productName.split(/1[-\s]?Pack/i)[1];
      if (model) {
        model = model.split("Skärmskydd")[0].trim();
        return `1-Pack ${toTitleCase(model)} Skärmskydd i Härdat Glas`;
      }
    } else if (normalizedProductName.includes("2 PACK")) {
      model = productName.split(/2[-\s]?Pack/i)[1];
      if (model) {
        model = model.split("Skärmskydd")[0].trim();
        return `2-Pack ${toTitleCase(model)} Skärmskydd i Härdat Glas`;
      }
    } else if (normalizedProductName.includes("&")) {
      // Handle cases with "&" in the product name
      const parts = normalizedProductName.split("&").map((part) => part.trim());
      const mainModel = parts[0].split("SKÄRMSKYDD")[0].trim(); // Get the model before "Skärmskydd"
      return `${toTitleCase(mainModel)} Skärmskydd & ${parts[1]} i Härdat Glas`;
    } else {
      // Handle cases that don't match specific pack conditions
      const modelTitle = normalizedProductName
        .split(" - ")[0]
        .split("SKÄRMSKYDD")[0]
        .trim(); // Get the main model before "Skärmskydd"
      return `${toTitleCase(modelTitle)} Skärmskydd i Härdat Glas`;
    }

    return "Unknown Configuration"; // Default return if no conditions match
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const brandTags = {
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

  const generateTags = (productName) => {
    const tags = [];
    const normalizedProductName = productName.toLowerCase();
  
    // Add brand tag
    let brandInName = null;
    Object.keys(brandTags).forEach((brand) => {
      if (normalizedProductName.includes(brand.toLowerCase())) {
        tags.push(brand);
        brandInName = brand; // Store the brand to avoid duplication in the model tag
      }
    });
  
    // Add common tags
    tags.push("Type_Skärmskydd");
  
    // Extract model information
    const modelMatch = productName.match(/1[-\s]?Pack\s+([\w\s]+?)\s+Skärmskydd/i) || 
                       productName.match(/2[-\s]?Pack\s+([\w\s]+?)\s+Skärmskydd/i);
  
    if (modelMatch) {
      let model = modelMatch[1].trim();
      if (brandInName && model.toLowerCase().startsWith(brandInName.toLowerCase())) {
        // Remove brand from model if it's duplicated
        model = model.replace(new RegExp(`^${brandInName}`, 'i'), '').trim();
      }
      const modelTag = `model-${brandInName ? brandInName + ' ' + model : model}`;
      tags.push(modelTag);
    }
  
    // Add Skärmskydd tag
    tags.push("Skärmskydd");
  
    // Remove pack information and join tags
    return tags
      .map((tag) => tag.replace(/\b(1 pack|2 pack|3 pack)\b/gi, "").trim())
      .join(", ");
  };
  

  const transformedData = rawData.flatMap(transformRowType2);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
    selectedRowKeys: selectedRows.map((row) => row.key),
  };

  const handleShowTable = () => {
    setIsTableVisible(true);
  };

  const handleDownload = (dataToDownload) => {
    if (dataToDownload.length === 0) {
      alert("No data to download.");
      return;
    }

    const transformedData = dataToDownload.flatMap(transformRowType2);

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
    saveAs(data, "shopify_transformed_data.xlsx");
  };

  return (
    <>
      <Button type="primary" onClick={handleShowTable}>
        Show Shopify Data
      </Button>
      {isTableVisible && (
        <>
          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={rawData.map((item, index) => ({ ...item, key: index }))}
          />
          <Button
            type="primary"
            onClick={() => handleDownload(selectedRows)}
            style={{ marginRight: "10px" }}
          >
            Download Selected Rows
          </Button>
          <Button danger type="primary" onClick={() => handleDownload(rawData)}>
            Download All Rows
          </Button>
        </>
      )}
    </>
  );
};

export default ShopifyBtn;
