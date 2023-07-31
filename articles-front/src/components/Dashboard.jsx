import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GenericList from './GenericList';

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<GenericList resource="article" />} />
      <Route path="/article" element={<GenericList resource="article" />} />
      <Route path="/category" element={<GenericList resource="category" />} />
      <Route path="/tag" element={<GenericList resource="tag" />} />
    </Routes>
  )
}

export default Dashboard;
