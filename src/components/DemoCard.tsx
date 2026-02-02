import { Link } from 'react-router-dom';
import type { Demo } from '../types';

interface DemoCardProps {
  demo: Demo;
  onDelete: (id: string) => void;
}

export const DemoCard = ({ demo, onDelete }: DemoCardProps) => {
  const priorityColors = {
    1: 'bg-red-100 text-red-800 border-red-300',
    2: 'bg-orange-100 text-orange-800 border-orange-300',
    3: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    4: 'bg-green-100 text-green-800 border-green-300',
    5: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-800',
  };

  const priorityColor = priorityColors[demo.priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800 border-gray-300';
  const statusColor = statusColors[demo.status.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/demo/${demo.id}`}>
        <div className="aspect-video bg-gray-200 overflow-hidden">
          {demo.thumbnailUrl ? (
            <img
              src={demo.thumbnailUrl}
              alt={demo.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No thumbnail
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/demo/${demo.id}`} className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              {demo.name}
            </h3>
          </Link>
          <div className={`ml-2 px-2 py-1 rounded text-xs font-medium border ${priorityColor}`}>
            P{demo.priority}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">{demo.client}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {demo.status}
            </span>
            <span className="text-xs text-gray-500">{demo.category}</span>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/demo/${demo.id}/edit`}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm('Are you sure you want to delete this demo?')) {
                  onDelete(demo.id);
                }
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
