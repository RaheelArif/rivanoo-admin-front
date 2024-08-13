import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, InputNumber, Button, Space } from 'antd';
import { addProduct } from '../app/slices/productsSlice';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const AddProductModal = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    
    const onFinish = (values) => {
        dispatch(addProduct(values));
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            open={visible}
            title="Add New Product"
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                {/* <Form.Item
                    name="sku"
                    label="SKU"
                    rules={[{ required: true, message: 'Please input the SKU!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="gtin"
                    label="GTIN"
                    rules={[{ required: true, message: 'Please input the GTIN!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item> */}
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please input the title!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                {/* <Form.Item
                    name="salePrice"
                    label="Sale Price"
                    rules={[{ required: true, message: 'Please input the sale price!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item> */}
                <Form.Item
                    name="originalPrice"
                    label="Original Price"
                    rules={[{ required: true, message: 'Please input the original price!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please input the status!' }]}
                >
                    <Input />
                </Form.Item>
                {/* <Form.Item
                    name="market"
                    label="Market"
                    rules={[{ required: true, message: 'Please input the market!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="brand"
                    label="Brand"
                    rules={[{ required: true, message: 'Please input the brand!' }]}
                >
                    <Input />
                </Form.Item> */}
                <Form.Item
                    name="image"
                    label="Image URL"
                    rules={[{ required: true, message: 'Please input the image URL!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: 'Please input the quantity!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                
                <Form.List name="variation_ids">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field, index) => (
                                <Space key={field.key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                                    <Form.Item
                                        {...field}
                                        name={[field.name]}
                                        fieldKey={[field.fieldKey]}
                                        rules={[{ required: true, message: 'Please input a variation ID!' }]}
                                    >
                                        <Input placeholder="Variation ID" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Variation ID
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Product
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddProductModal;
