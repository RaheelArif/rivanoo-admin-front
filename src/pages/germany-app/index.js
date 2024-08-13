import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";

const GermanyAppPage = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/germany_section/pdf_upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      toast.success(response?.data?.message || "File has been uploaded");
      navigate(
        `/result?labels_pdf=${response?.data?.processed_file_location?.pdf_file}&text_file=${response?.data?.processed_file_location?.text_file}`,
        { state: response?.data }
      );
    } catch (err) {
      setLoading(false);
      toast.error(err?.response ? err?.response?.data?.message : err?.message);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Upload File - Rivanoo</title>
      </Helmet>
      <div className="mx:5 lg:mx-20">
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <div className="w-full flex flex-col justify-center items-center mt-[50px] mb-[30px]">
              <div className="w-full flex flex-col justify-center items-center">
                <img
                  src={"/assets/images/rivanoo_logo.png"}
                  alt="Rivanoo Logo"
                  width={100}
                  className="mb-4"
                />
              </div>
              <h2 className="text-2xl lg:text-[2.5rem] text-center text-[#000] font-semibold m-0 mb-2">
                Upload Germany File
              </h2>
            </div>
          </div>
        </div>
        <div className="p-8 lg:p-0 mt-5">
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-3"></div>
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-[#f0f4ff] color-[#007bff] border-2 border-[#007bff] rounded-[10px] p-5 cursor-pointer lg:transition-all lg:duration-[0.3s] lg:ease lg:hover:mt-[-5px]">
                <form
                  className="flex flex-col justify-start items-center"
                  onSubmit={handleSubmit}
                >
                  <label className="text-[1rem] text-[#007bff] font-semibold mb-2">
                    Choose PDF file:
                  </label>
                  <input
                    type="file"
                    className="my-2 w-full"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                  <button
                    className={`bg-[#007bff] text-white font-semibold px-[12px] py-[6px] rounded mt-4 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    type="submit"
                  >
                    {loading ? (
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
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </button>
                </form>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GermanyAppPage;
