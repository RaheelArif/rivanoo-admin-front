import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { BASE_URL } from '../utils/appBaseUrl';

const UploadFile = ({ setTableData }) => {
  const [file, setFile] = useState(null);
  const uploadRef = useRef(null);

  const handleUpload = (file) => {
    if (file.size / 1024 / 1024 > 5) { // 5MB file size limit
      message.error('File must be smaller than 5MB!');
      return false;
    }
    setFile(file);
    return false; // Prevent automatic upload
  };

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${BASE_URL}/upload/comment`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setFile(null);
        setTableData(response.data);

        if (uploadRef.current) {
          uploadRef.current.value = null;
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div>
      <Upload
        beforeUpload={handleUpload}
        maxCount={1}
        ref={uploadRef}
        showUploadList={false} // Hide the default file list
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button onClick={handleSubmit} type="primary" style={{ marginTop: '16px' }}>
        Upload and Process
      </Button>
    </div>
  );
};

export default UploadFile;
