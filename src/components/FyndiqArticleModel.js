import React, { useState, useEffect } from "react";
import { Table, Spin, Pagination, Tag } from "antd";
import axios from "axios";
import { BASE_URL } from "../utils/appBaseUrl";

const ArticlesTable = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(5000); // Total number of articles
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [pageSize] = useState(100); // Page size (you can make it dynamic if you want)

  // Fetch articles from the backend with pagination
  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/articles`, {
        params: {
          page,
          limit: pageSize, // Send limit and page as query params
        },
      });
      //   console.log(response.data.data)
      setArticles(response.data?.data || []); // Adjust based on your backend response structure
 // Set total count if available in the response
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch articles when page changes
  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  // Define the table columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => record.title?.[0]?.value || "N/A", // Adjust if title is an array of objects
    },
    {
      title: "model_name",
      dataIndex: "model_name",
      key: "model_name",
      render: (text, record) => (
        <Tag color={text === "Unknown Model" ? "red" : "blue"}>{text}</Tag>
      ), // Adjust if title is an array of objects
    },
  ];

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page
  };

  return (
    <div>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={articles}
            rowKey="sku"
            pagination={false} // Disable default Antd pagination as we're handling it manually
          />
          {/* Custom Pagination */}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange} // Trigger on page change
          />
        </>
      )}
    </div>
  );
};

export default ArticlesTable;
