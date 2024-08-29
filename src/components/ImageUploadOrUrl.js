import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { BASE_URL } from '../utils/appBaseUrl';


const ImageUploadOrUrl = ({ value = '', onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${BASE_URL}/upload/product/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Upload successful');
      const imageUrl = response.data.url;
      setInputValue(imageUrl);
      if (onChange) {
        onChange(imageUrl);
      }
    } catch (error) {
      message.error('Upload failed');
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const url = e.target.value;
    setInputValue(url);
    if (onChange) {
      onChange(url);
    }
  };

  return (
    <>
      <Upload customRequest={handleUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Upload Image</Button>
      </Upload>
      <Input
        style={{ marginTop: 8 }}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Or enter image URL"
      />
    </>
  );
};

export default ImageUploadOrUrl;
