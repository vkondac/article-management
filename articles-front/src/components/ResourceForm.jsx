import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';

const ResourceForm = ({ resource, formData, onCancel, onResourceCreated, isEdit }) => {
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const identifier = resource.charAt(0).toUpperCase() + resource.slice(1) + 'ID';
    try {
      if (localFormData.hasOwnProperty('CategoryID')) {
        localFormData.CategoryID = parseInt(localFormData.CategoryID, 10);
      }

      if (localFormData.hasOwnProperty('TagIDs')) {
        localFormData.TagIDs = localFormData.TagIDs.split(',').map(id => parseInt(id.trim(), 10));
      }

      if (isEdit) {
        const response = await axiosInstance.put(`/${resource}/${localFormData[identifier]}`, localFormData);
        onResourceCreated(response.data);
      } else {
        const response = await axiosInstance.post(`/${resource}`, localFormData);
        onResourceCreated(response.data);
      }
    } catch (error) {
      console.error('Error creating/editing resource:', error);
    }
  };

  useEffect(() => {
    axiosInstance.get('/tag')
      .then(response => setTags(response.data))
      .catch(error => console.error('Error fetching tags:', error));

    axiosInstance.get('/category')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const fields = {
    default: [
      { name: 'Title', placeholder: 'Title', required: true },
    ],
    article: [
      { name: 'Title', placeholder: 'Title', required: true },
      { name: 'Reporter', placeholder: 'Reporter', required: true },
      { name: 'Body', placeholder: 'Body', required: true },
      {
        name: 'TagIDs',
        placeholder: 'Select Tag',
        required: true,
        options: tags.map(tag => ({ value: tag.TagID, label: tag.Title }))
      },
      {
        name: 'CategoryID',
        placeholder: 'Select Category',
        required: true,
        options: categories.map(category => ({ value: category.CategoryID, label: category.Title }))
      }
    ],
  }

  const currentFields = fields[resource] || fields.default;

  return (
    <div className='flex flex-col justify-center items-center mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>Create New {resource}</h2>
      <form className='w-96' onSubmit={handleSubmit}>
        {currentFields.map((field) => (
          field.options ? (
            <select
              key={field.name}
              name={field.name}
              value={localFormData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              style={{ color: 'black' }}
            >
              <option value="" disabled>{field.placeholder}</option>
              {field.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input
              key={field.name}
              type='text'
              name={field.name}
              placeholder={field.placeholder}
              value={localFormData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
            />
          )
        ))}
        <button type='submit' className='bg-blue-600 text-white px-4 py-2 mt-4'>
          Save
        </button>
        <button type='button' className='bg-red-600 text-white px-4 py-2 mt-4' onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ResourceForm;
