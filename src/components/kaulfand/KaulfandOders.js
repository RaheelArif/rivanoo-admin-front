// src/components/OrderUnits/OrderUnitsTable.jsx
import React, { useState, useEffect } from 'react';
import { Table, Card, Select, Space, Button, Modal } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { BASE_URL } from "../../utils/appBaseUrl";
import OrderPDF from './OrderPDF'; // Make sure to create this component separately
import { PDFDownloadLink } from '@react-pdf/renderer';

const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'need_to_be_sent', label: 'Need to be Sent' },
    { value: 'open', label: 'Open' },
    { value: 'received', label: 'Received' },
    { value: 'returned', label: 'Returned' },
    { value: 'returned_paid', label: 'Returned & Paid' },
    { value: 'sent', label: 'Sent' },
    { value: 'sent_and_autopaid', label: 'Sent & Auto-paid' }
];

const KaulfandOders = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 50,
        total: 0
    });

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id_order',
            key: 'id_order',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span style={{ 
                    textTransform: 'capitalize',
                    color: status === 'cancelled' ? 'red' : 'inherit'
                }}>
                    {status?.replace(/_/g, ' ')}
                </span>
            )
        },
        {
            title: 'Created At',
            dataIndex: 'ts_created',
            key: 'ts_created',
            render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button 
                    icon={<FilePdfOutlined />} 
                    onClick={() => handlePrintClick(record)}
                >
                    Print
                </Button>
            )
        }
    ];

    // Function to handle print button click
    const handlePrintClick = (record) => {
        setSelectedOrder(record);
        setPdfModalVisible(true);
    };

    // Function to handle modal close
    const handleModalClose = () => {
        setPdfModalVisible(false);
        setSelectedOrder(null);
    };

    const fetchOrderUnits = async (params = {}) => {
        try {
            setLoading(true);
            
            const queryObj = {
                page: params.page || 1,
                limit: params.limit || 50
            };

            if (status) {
                queryObj.status = status;
            }

            const queryParams = new URLSearchParams(queryObj).toString();
            const response = await fetch(`${BASE_URL}/kaufland/order-units?${queryParams}`);
            const result = await response.json();

            if (result.success) {
                setData(result.data.data || []);
                setPagination({
                    ...pagination,
                    total: result.data.total || 0,
                    current: params.page || 1
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Failed to fetch order units:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderUnits();
    }, [status]);

    const handleTableChange = (newPagination, filters, sorter) => {
        fetchOrderUnits({
            page: newPagination.current,
            limit: newPagination.pageSize
        });
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        setPagination(prev => ({
            ...prev,
            current: 1
        }));
    };

    return (
        <Card title="Order Units">
            <Space direction="vertical" style={{ width: '100%' }}>
                <Select
                    style={{ width: 200 }}
                    placeholder="Select status"
                    options={STATUS_OPTIONS}
                    onChange={handleStatusChange}
                    value={status}
                    allowClear
                />

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id_order_unit"
                    pagination={pagination}
                    onChange={handleTableChange}
                    loading={loading}
                />

<Modal
    title="Order PDF"
    open={pdfModalVisible}
    onCancel={handleModalClose}
    footer={null}
    width={800}
>
    {selectedOrder && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <PDFDownloadLink
                document={<OrderPDF order={selectedOrder} />}
                fileName={`order-${selectedOrder.id_order || 'unknown'}.pdf`}
                style={{
                    textDecoration: 'none',
                    padding: '10px 20px',
                    color: '#fff',
                    backgroundColor: '#1890ff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'inline-block'
                }}
            >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
            </PDFDownloadLink>
        </div>
    )}
</Modal>
            </Space>
        </Card>
    );
};

export default KaulfandOders;