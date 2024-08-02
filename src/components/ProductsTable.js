import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Image } from 'antd';
import { fetchProducts, deleteProduct } from '../features/products/productsSlice';
import AddProductModal from './AddProductModal';

const ProductsTable = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);
    const status = useSelector((state) => state.products.status);
    const error = useSelector((state) => state.products.error);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteProduct(id));
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'GTIN',
            dataIndex: 'gtin',
            key: 'gtin',
        },
        {
            title: 'Title (ENG)',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Sale Price',
            dataIndex: 'salePrice',
            key: 'salePrice',
        },
        {
            title: 'Original Price',
            dataIndex: 'originalPrice',
            key: 'originalPrice',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Market',
            dataIndex: 'market',
            key: 'market',
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <Image width={50} src={text} />,
        },
        {
            title: 'Extra Images',
            dataIndex: 'extraImages',
            key: 'extraImages',
            render: (images) => images.map((img, index) => <Image key={index} width={50} src={img} />),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button type="primary" onClick={() => console.log('Edit:', record._id)}>
                        Edit
                    </Button>
                    <Button type="primary" danger onClick={() => handleDelete(record._id)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Products</h2>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                Add New Product
            </Button>
            <Table columns={columns} dataSource={products} rowKey="_id" />
            <AddProductModal visible={isModalVisible} onClose={closeModal} />
        </div>
    );
};

export default ProductsTable;
