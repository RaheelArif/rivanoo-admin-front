import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "antd";

const ShopifyBtn = ({ rawData }) => {
  const transformRowType2 = (row) => {
    console.log("Processing row:", row);

    const baseRow = {
      Handle: row["title:sv-SE"]?.toString().trim().replace(/\s+/g, "-") || "",
      Title: row["title:sv-SE"]?.toString().trim() || "",
      "Body (HTML)": row["description:sv-SE"]?.toString().trim() || "",
      Vendor: row["brand"]?.toString().trim() || "",
      "Product Category": row["category:1"]?.toString().trim() || "",
      Tags: generateTags(row["title:sv-SE"] || ""),
      "Variant SKU": row["sku"]?.toString().trim() || "",
      "Variant Grams": "50",
      "Variant Price": row["price:SE:SEK"]?.toString().trim() || "",
      "Variant Compare At Price":
        row["original_price:SE:SEK"]?.toString().trim() || "",
      "Image Src": row["main_image_url"]?.toString().trim() || "",
      "Image Position": "1",
      "SEO Title": generateCorrectedTitle(row["title:sv-SE"] || ""),
      "SEO Description": generateDescription(row["title:sv-SE"] || ""),
      Status:
        row["status"]?.toString().trim().toLowerCase() === "for sale"
          ? "active"
          : "draft",
      "Option1 Name": "Title",
      "Option1 Value": "Default Title",
      "Variant Inventory Tracker": "shopify",
      "Variant Inventory Qty": row["quantity"]?.toString().trim() || "1000",
      "Variant Inventory Policy": "deny",
      "Variant Taxable": "false",
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

  const generateDescription = (productName) => {
    const productNameLower = productName.toLowerCase();
    let model = productName;

    if (productNameLower.includes("1 pack screen & 1 pack lens")) {
      model = productName.replace(/1 pack screen & 1 pack lens/i, "").trim();
    } else if (productNameLower.includes("2 pack screen & 2 pack lens")) {
      model = productName.replace(/2 pack screen & 2 pack lens/i, "").trim();
    } else if (productNameLower.includes("2 pack screen & 1 pack lens")) {
      model = productName.replace(/2 pack screen & 1 pack lens/i, "").trim();
    } else if (productNameLower.includes("pack")) {
      model = productName.replace(/\d+\s*pack.*/i, "").trim();
    }

    return (
      `Skydda din ${model} med vårt högkvalitativa härdat glas skärmskydd. ` +
      "Ger full täckning och skydd mot smuts, fläckar och repor. " +
      "Oleofob beläggning mot fingeravtryck, enkel installation med perfekt passform. " +
      "Inkluderar även kameraskydd och rengöringskit. " +
      `Idealiskt för din ${model}. Köp idag och skydda din enhet!`
    );
  };

  const generateCorrectedTitle = (productName) => {
    const normalizedProductName = productName.trim().toUpperCase();

    if (normalizedProductName.includes("1 PACK SCREEN & 1 PACK LENS")) {
      const model = normalizedProductName
        .replace(/1 PACK SCREEN & 1 PACK LENS/i, "")
        .trim();
      return `1-Pack ${toTitleCase(
        model
      )} Skärmskydd & 1-Pack Linsskydd i Härdat Glas`;
    } else if (normalizedProductName.includes("2 PACK SCREEN & 2 PACK LENS")) {
      const model = normalizedProductName
        .replace(/2 PACK SCREEN & 2 PACK LENS/i, "")
        .trim();
      return `2-Pack ${toTitleCase(
        model
      )} Skärmskydd & 2-Pack Linsskydd i Härdat Glas`;
    } else if (normalizedProductName.includes("2 PACK SCREEN & 1 PACK LENS")) {
      const model = normalizedProductName
        .replace(/2 PACK SCREEN & 1 PACK LENS/i, "")
        .trim();
      return `2-Pack ${toTitleCase(
        model
      )} Skärmskydd & 1-Pack Linsskydd i Härdat Glas`;
    } else if (normalizedProductName.includes("1 PACK")) {
      const model = normalizedProductName.replace(/1 PACK/i, "").trim();
      return `${toTitleCase(model)} Skärmskydd i Härdat Glas - 1-Pack`;
    } else if (normalizedProductName.includes("2 PACK")) {
      const model = normalizedProductName.replace(/2 PACK/i, "").trim();
      return `${toTitleCase(model)} Skärmskydd i Härdat Glas - 2-Pack`;
    } else {
      return toTitleCase(productName);
    }
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
    Object.keys(brandTags).forEach((brand) => {
      if (normalizedProductName.includes(brand.toLowerCase())) {
        tags.push(brand);
      }
    });

    // Add common tags
    tags.push("Type_Skärmskydd");

    // Extract model information
    const modelMatch = normalizedProductName.match(/model-(.*?)(\b|$)/);
    if (modelMatch) {
      let model = modelMatch[1].replace(/-/g, " ").trim();
      const brandInName = Object.keys(brandTags).find((brand) =>
        normalizedProductName.includes(brand.toLowerCase())
      );
      const modelTag = brandInName
        ? `model-${brandInName} ${model}`
        : `model-${model}`;
      tags.push(modelTag);
    } else {
      tags.push(`model-${normalizedProductName.replace(/-/g, " ")}`);
    }

    // Add Skärmskydd tag
    tags.push("Skärmskydd");

    // Remove pack information and join tags
    return tags
      .map((tag) => tag.replace(/\b(1 pack|2 pack|3 pack)\b/gi, "").trim())
      .join(", ");
  };
  const downloadTransformedExcel = (transformationType) => {
    if (rawData.length === 0) {
      alert("No data to download. Please upload an Excel file first.");
      return;
    }

    let transformedData;

    transformedData = rawData.flatMap(transformRowType2);

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
    <Button type="primary" onClick={() => downloadTransformedExcel("shopify")}>
      Download Shopify
    </Button>
  );
};

export default ShopifyBtn;
