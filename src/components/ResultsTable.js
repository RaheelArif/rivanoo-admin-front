import React from 'react';
import { Table } from 'antd';

const ResultsTable = ({ tableData }) => {
  const columns = [
    {
      title: 'Article',
      dataIndex: 'Article',
      key: 'article',
    },
    {
      title: 'Review Date',
      dataIndex: 'Review date',
      key: 'reviewDate',
    },
    {
      title: 'Stars',
      dataIndex: 'Stars',
      key: 'stars',
    },
    {
      title: 'Link',
      dataIndex: 'Link',
      key: 'link',
      render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">Link</a>,
    },
  ];

  return <Table dataSource={tableData} columns={columns} rowKey="Article" />;
};

export default ResultsTable;
