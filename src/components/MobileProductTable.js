import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Pagination, message } from 'antd';
import { fetchMobileProducts, addMobileProduct, updateMobileProduct, deleteMobileProduct, setSelectedStatus, setPage, setPageSize } from '../app/slices/mobileProductSlice';
import moment from 'moment';

const { Option } = Select;

const MobileProductTable = () => {
  const dispatch = useDispatch();
  const { items: mobileProducts, status, error, selectedStatus, currentPage, pageSize, total } = useSelector((state) => state.mobileProducts);

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = React.useState(null);

  useEffect(() => {
    dispatch(fetchMobileProducts({ status: selectedStatus, page: currentPage, size: pageSize }));
  }, [dispatch, selectedStatus, currentPage, pageSize]);

  useEffect(() => {
    if (status === 'failed' && error) {
      message.error(error);
    }
  }, [status, error]);

  const showModal = (product = null) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      release_date: product ? moment(product.release_date) : null,
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        release_date: values.release_date ? values.release_date.format('YYYY-MM-DD') : null,
      };

      if (editingProduct) {
        dispatch(updateMobileProduct({ id: editingProduct._id, mobileProduct: formattedValues }));
      } else {
        dispatch(addMobileProduct(formattedValues));
      }
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteMobileProduct(id));
  };

  const handleStatusChange = (value) => {
    dispatch(setSelectedStatus(value));
    dispatch(setPage(1)); // Reset to the first page when status changes
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handlePageSizeChange = (current, size) => {
    dispatch(setPageSize(size));
    dispatch(setPage(1)); // Reset to the first page when page size changes
  };

  const getRowClassName = (record) => {
    const today = moment();
    const releaseDate = moment(record.release_date);
    const daysDifference = releaseDate.diff(today, 'days');

    if (daysDifference < 10) {
      return 'red-row';
    }

    return '';
  };

  const columns = [
    { title: 'Brand', dataIndex: 'brand', key: 'brand' },
    { 
      title: 'Release Date', 
      dataIndex: 'release_date',
      key: 'release_date',
      render: (date) => date ? moment(date).format('YYYY-MM-DD') : 'N/A',
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (text) => {
        const statusMapping = {
          coming_soon: 'Coming Soon',
          ordered: 'Ordered',
          complete: 'Complete',
          canceled: 'Canceled',
        };
        return statusMapping[text] || 'Unknown';
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Button onClick={() => handleDelete(record._id)} danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Add Mobile Product
      </Button>
      <Select 
        style={{ marginBottom: 16, width: 200 }}
        placeholder="Select Status"
        onChange={handleStatusChange}
        value={selectedStatus} // Controlled value
      >
        <Option value="">All</Option>
        <Option value="coming_soon">Coming Soon</Option>
        <Option value="ordered">Ordered</Option>
        <Option value="complete">Complete</Option>
        <Option value="canceled">Canceled</Option>
      </Select>
      <Table
        columns={columns}
        dataSource={mobileProducts}
        rowKey="_id"
        rowClassName={getRowClassName}
        pagination={false} // Disable the built-in pagination
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
        showSizeChanger={false}
        // onShowSizeChange={handlePageSizeChange}
        // pageSizeOptions={['10', '20', '30', '40']}
        style={{ marginTop: 16, textAlign: 'center' }}
      />
      <Modal
        title={editingProduct ? 'Edit Mobile Product' : 'Add Mobile Product'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="brand" 
            label="Brand" 
            rules={[{ required: true, message: 'Please input the brand!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="release_date"
            label="Release Date" 
            rules={[{ required: true, message: 'Please select the release date!' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item 
            name="description" 
            label="Description" 
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="status" 
            label="Status" 
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select>
              <Option value="coming_soon">Coming Soon</Option>
              <Option value="ordered">Ordered</Option>
              <Option value="complete">Complete</Option>
              <Option value="canceled">Canceled</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MobileProductTable;
