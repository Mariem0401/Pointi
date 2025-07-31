import React from 'react';
import { Card, Table, Select, Button } from 'antd';
import { Bar } from 'react-chartjs-2';

const { Option } = Select;

const ReportCosts = () => {
  // Table data
  const columns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Salary Costs',
      dataIndex: 'salary',
      key: 'salary',
    },
    {
      title: 'Benefits',
      dataIndex: 'benefits',
      key: 'benefits',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  const data = [
    { key: '1', department: 'IT', salary: '$50,000', benefits: '$10,000', total: '$60,000' },
    { key: '2', department: 'HR', salary: '$40,000', benefits: '$8,000', total: '$48,000' },
  ];

  // Chart data
  const chartData = {
    labels: ['IT', 'HR', 'Finance', 'Operations'],
    datasets: [
      {
        label: 'Labor Costs',
        data: [60000, 48000, 55000, 52000],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <Card 
      title="Labor Costs Report"
      extra={
        <>
          <Select defaultValue="2023" style={{ width: 120, marginRight: 8 }}>
            <Option value="2023">2023</Option>
            <Option value="2022">2022</Option>
          </Select>
          <Button type="primary">Export</Button>
        </>
      }
    >
      <div style={{ marginBottom: 24 }}>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false} 
      />
    </Card>
  );
};

export default ReportCosts;