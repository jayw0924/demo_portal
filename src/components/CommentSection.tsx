import { useState } from 'react';
import type { Comment, TaskPriority, TaskStatus } from '../types';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: string) => void;
  onToggleComplete: (commentId: string) => void;
  onUpdatePriority: (commentId: string, priority: TaskPriority) => void;
  onUpdateStatus: (commentId: string, status: TaskStatus) => void;
}

export const CommentSection = ({
  comments,
  onAddComment,
  onDeleteComment,
  onToggleComplete,
  onUpdatePriority,
  onUpdateStatus,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Comments & Tasks</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment or task..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Comment
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-opacity ${
                comment.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={comment.completed}
                  onChange={() => onToggleComplete(comment.id)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this comment?')) {
                          onDeleteComment(comment.id);
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                  <p
                    className={`text-gray-800 whitespace-pre-wrap ${
                      comment.completed ? 'line-through' : ''
                    }`}
                  >
                    {comment.text}
                  </p>
                  <div className="flex gap-3 mt-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Priority</label>
                      <select
                        value={comment.priority}
                        onChange={(e) => onUpdatePriority(comment.id, e.target.value as TaskPriority)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Mid">Mid</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Status</label>
                      <select
                        value={comment.status}
                        onChange={(e) => onUpdateStatus(comment.id, e.target.value as TaskStatus)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Approved">Approved</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
