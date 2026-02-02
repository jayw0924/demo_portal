import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Demo } from '../types';

interface DemoFormProps {
  demos: Demo[];
  onSave: (demoData: Omit<Demo, 'id' | 'createdAt' | 'comments'>) => void;
  onUpdate: (id: string, updates: Partial<Demo>) => void;
}

export const DemoForm = ({ demos, onSave, onUpdate }: DemoFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const existingDemo = isEditing ? demos.find((d) => d.id === id) : null;

  const [formData, setFormData] = useState({
    name: '',
    client: '',
    demoUrl: '',
    thumbnailUrl: '',
    category: '',
    priority: 3,
    status: 'active',
  });

  useEffect(() => {
    if (existingDemo) {
      setFormData({
        name: existingDemo.name,
        client: existingDemo.client,
        demoUrl: existingDemo.demoUrl,
        thumbnailUrl: existingDemo.thumbnailUrl,
        category: existingDemo.category,
        priority: existingDemo.priority,
        status: existingDemo.status,
      });
    }
  }, [existingDemo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && id) {
      onUpdate(id, formData);
    } else {
      onSave(formData);
    }

    navigate('/');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Demo' : 'Add New Demo'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Demo Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
            Client *
          </label>
          <input
            type="text"
            id="client"
            name="client"
            required
            value={formData.client}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Demo URL *
          </label>
          <input
            type="url"
            id="demoUrl"
            name="demoUrl"
            required
            value={formData.demoUrl}
            onChange={handleChange}
            placeholder="https://metabox.3dsource.com/metabox-configurator/basic/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail Image URL
          </label>
          <input
            type="url"
            id="thumbnailUrl"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Configurator, Product Demo, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority *
          </label>
          <select
            id="priority"
            name="priority"
            required
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1 - Highest</option>
            <option value={2}>2 - High</option>
            <option value={3}>3 - Medium</option>
            <option value={4}>4 - Low</option>
            <option value={5}>5 - Lowest</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isEditing ? 'Update Demo' : 'Create Demo'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
