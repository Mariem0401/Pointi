import React from 'react';
import { Card, Table, Tabs, Tag } from 'antd';

const { TabPane } = Tabs;

const ReportPerformance = () => {
  // Employee performance table
  const employeeColumns = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Tag color={rating >= 4 ? 'green' : rating >= 3 ? 'orange' : 'red'}>
          {rating}/5
        </Tag>
      ),
    },
    {
      title: 'Completed Tasks',
      dataIndex: 'tasks',
      key: 'tasks',
    },
  ];

  const employeeData = [
    { key: '1', employee: 'John Doe', department: 'IT', rating: 4.5, tasks: 42 },
    { key: '2', employee: 'Jane Smith', department: 'HR', rating: 3.8, tasks: 38 },
  ];

  // Department performance table
  const departmentColumns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Average Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Projects Completed',
      dataIndex: 'projects',
      key: 'projects',
    },
  ];

  const departmentData = [
    { key: '1', department: 'IT', rating: 4.2, projects: 15 },
    { key: '2', department: 'HR', rating: 3.9, projects: 8 },
  ];

  return (
    <Card title="Performance Reports">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Employee Performance" key="1">
          <Table 
            columns={employeeColumns} 
            dataSource={employeeData} 
            pagination={{ pageSize: 5 }} 
          />
        </TabPane>
        <TabPane tab="Department Performance" key="2">
          <Table 
            columns={departmentColumns} 
            dataSource={departmentData} 
            pagination={false} 
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ReportPerformance;