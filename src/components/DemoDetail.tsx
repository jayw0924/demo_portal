import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Demo, TaskPriority, TaskStatus } from '../types';
import { CommentSection } from './CommentSection';

interface DemoDetailProps {
  demos: Demo[];
  onDelete: (id: string) => void;
  onAddComment: (demoId: string, text: string) => void;
  onDeleteComment: (demoId: string, commentId: string) => void;
  onToggleComplete: (demoId: string, commentId: string) => void;
  onUpdatePriority: (demoId: string, commentId: string, priority: TaskPriority) => void;
  onUpdateStatus: (demoId: string, commentId: string, status: TaskStatus) => void;
}

export const DemoDetail = ({
  demos,
  onDelete,
  onAddComment,
  onDeleteComment,
  onToggleComplete,
  onUpdatePriority,
  onUpdateStatus,
}: DemoDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const demo = demos.find((d) => d.id === id);

  if (!demo) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Demo not found</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Go back to home
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this demo?')) {
      onDelete(demo.id);
      navigate('/');
    }
  };

  const priorityLabels = {
    1: 'Highest',
    2: 'High',
    3: 'Medium',
    4: 'Low',
    5: 'Lowest',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with metadata */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{demo.name}</h1>
            <p className="text-lg text-gray-600">{demo.client}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/demo/${demo.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Category:</span>
            <p className="text-gray-900">{demo.category}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Priority:</span>
            <p className="text-gray-900">
              {demo.priority} - {priorityLabels[demo.priority as keyof typeof priorityLabels]}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Status:</span>
            <p className="text-gray-900 capitalize">{demo.status}</p>
          </div>
          <div>
            <span className="font-medium text-gray-500">Demo URL:</span>
            <a
              href={demo.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              Open in new tab
            </a>
          </div>
        </div>
      </div>

      {/* Embedded configurator */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Embedded Configurator</h2>
        <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
          <embed
            width="100%"
            height="800"
            src={demo.demoUrl}
            className="border-0"
          />
        </div>
      </div>

      {/* Comments section */}
      <CommentSection
        comments={demo.comments}
        onAddComment={(text) => onAddComment(demo.id, text)}
        onDeleteComment={(commentId) => onDeleteComment(demo.id, commentId)}
        onToggleComplete={(commentId) => onToggleComplete(demo.id, commentId)}
        onUpdatePriority={(commentId, priority) => onUpdatePriority(demo.id, commentId, priority)}
        onUpdateStatus={(commentId, status) => onUpdateStatus(demo.id, commentId, status)}
      />
    </div>
  );
};
