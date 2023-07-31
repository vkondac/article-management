import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import ResourceForm from './ResourceForm';

const GenericList = ({ resource }) => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('')
  const [noArticlesFound, setNoArticlesFound] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/${resource}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get('/tag');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTags();
    fetchCategories();
  }, [resource]);

  useEffect(() => {
    setNoArticlesFound(false);
  }, [data]);

  const handleResourceCreated = (newResource) => {
    const identifier = resource.charAt(0).toUpperCase() + resource.slice(1) + 'ID';
    if (isEdit) {
      setData((prevData) =>
        prevData.map((item) => (item[identifier] === newResource[identifier] ? newResource : item))
      );
    } else {
      setData((prevData) => [...prevData, newResource]);
    }
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setShowForm(true);
    setFormData(item);
    setIsEdit(true);
  };

  const handleDelete = async (item) => {
    try {
      const identifier = resource.charAt(0).toUpperCase() + resource.slice(1) + 'ID';
      await axiosInstance.delete(`/${resource}/${item[identifier]}`);
      setData((prevData) => prevData.filter((dataItem) => dataItem[identifier] !== item[identifier]));
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const handleCreateNew = () => {
    setShowForm(true);
    setFormData({});
    setIsEdit(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setFormData({});
    setIsEdit(false);
  };

  const handleGetArticlesByTag = async () => {
    try {
      const response = await axiosInstance.get(`/article/tag/${selectedTag}`);
      setData(response.data);
    } catch (error) {
      setNoArticlesFound(true);
      console.log(error)
    }
  };

  const handleGetArticlesByCategory = async () => {
    try {
      const response = await axiosInstance.get(`/article/category/${selectedCategory}`);
      setData(response.data);
    } catch (error) {
      setNoArticlesFound(true);
      console.log(error)
    }
  };



  return (
    <div className='flex flex-col justify-center items-center mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>{resource.charAt(0).toUpperCase() + resource.slice(1)}</h2>
      {showForm ? (
        <ResourceForm
          resource={resource}
          formData={formData}
          onCancel={handleFormCancel}
          onResourceCreated={handleResourceCreated}
          isEdit={isEdit}
        />
      ) : (
        <>
          <button className='bg-blue-600 text-white px-4 py-2' onClick={handleCreateNew}>
            Create New {resource}
          </button>
          <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            <option value="">Select Tag</option>
            {tags.map(tag => (
              <option key={tag.TagID} value={tag.TagID}>{tag.Title}</option>
            ))}
          </select>
          <button
            className='bg-green-600 text-white px-4 py-2 ml-2'
            onClick={handleGetArticlesByTag}
          >
            Get Articles By Tag
          </button>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.CategoryID} value={category.CategoryID}>{category.Title}</option>
            ))}
          </select>
          <button
            className='bg-green-600 text-white px-4 py-2 ml-2'
            onClick={handleGetArticlesByCategory}
          >
            Get Articles By Category
          </button>
          {noArticlesFound && (
            <p className="text-red-600 mt-2">No articles found for the selected tag/category.</p>
          )}
          <ul className='list-disc pl-4 mt-10'>
            {data.map((item) => (
              <li key={item.id} className='mb-2'>
                <strong className='text-blue-600'>{item.Title || item.Name}</strong> - {item.Body || ''}
                <button
                  className='bg-green-500 text-white px-2 py-1 ml-2'
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className='bg-red-500 text-white px-2 py-1 ml-2'
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default GenericList;