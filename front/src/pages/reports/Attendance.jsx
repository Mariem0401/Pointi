import React from 'react';
import { Table, Card, DatePicker, Button } from 'antd';

const ReportAttendance = () => {
  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'Present' ? 'green' : 'red' }}>
          {status}
        </span>
      ),
    },
    {
      title: 'Hours Worked',
      dataIndex: 'hours',
      key: 'hours',
    },
  ];

  const data = [
    { key: '1', employee: 'John Doe', date: '2023-05-01', status: 'Present', hours: '8' },
    { key: '2', employee: 'Jane Smith', date: '2023-05-01', status: 'Absent', hours: '0' },
  ];

  return (
    <Card 
      title="Attendance Report" 
      extra={
        <>
          <DatePicker.RangePicker style={{ marginRight: 8 }} />
          <Button type="primary">Generate Report</Button>
        </>
      }
    >
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={{ pageSize: 10 }} 
      />
    </Card>
  );
};

export default ReportAttendance;