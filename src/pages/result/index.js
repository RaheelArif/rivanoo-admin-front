import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet";

const ResultPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(null);
  const result_data = location.state || {};

  const getFileUrl = (fileType) => {
    return `/api/germany_section/download/${result_data?.processed_file_location[fileType]}`;
  };

  const handleDownload = async (fileType) => {
    try {
      setLoading(fileType);
      const response = await axios.get(getFileUrl(fileType), {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        result_data?.processed_file_location[fileType]
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(null);
      toast.success("File downloaded successfully!");
    } catch (error) {
      setLoading(null);
      toast.error("Error downloading file");
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Extraction Results - Rivanoo</title>
      </Helmet>
      <div className="mx-5 lg:mx-20">
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <div className="w-full flex flex-col justify-center items-center mt-[50px] mb-[30px]">
              <div className="w-full flex flex-col justify-center items-center">
                <img
                  src={"/assets/images/rivanoo_logo.png"}
                  alt="Rivanoo Logo"
                  width={100}
                  className="mb-10"
                />
              </div>
              <h2 className="text-2xl lg:text-[2.5rem] text-center text-[#000] font-semibold m-0 mb-0.5">
                Extraction Results
              </h2>
              <p className="text-lg lg:text-[1.25rem] text-center text-[#333] font-normal m-0 mb-0.5">
                Number of labels extracted: 9
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-3"></div>
          <div className="col-span-12 lg:col-span-6">
            <div className="flex flex-col lg:flex-row justify-center items-center gap-3">
              <button
                className={`bg-[#28a745] text-white font-semibold px-4 py-2.5 rounded-lg cursor-pointer ${
                  loading === "pdf_file" ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleDownload("pdf_file")}
                disabled={loading === "pdf_file"}
              >
                {loading === "pdf_file" ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 me-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Downloading...
                  </>
                ) : (
                  "Download Extracted Labels PDF"
                )}
              </button>

              <button
                className={`bg-[#17a2b8] text-white font-semibold px-4 py-2.5 rounded-lg cursor-pointer ${
                  loading === "text_file" ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleDownload("text_file")}
                disabled={loading === "text_file"}
              >
                {loading === "text_file" ? (
                  <>
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 me-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Downloading...
                  </>
                ) : (
                  "Download Extracted Text"
                )}
              </button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3"></div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
