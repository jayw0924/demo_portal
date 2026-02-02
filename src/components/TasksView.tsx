import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Demo, Comment, TaskPriority, TaskStatus } from '../types';

interface TaskWithDemo extends Comment {
  demoId: string;
  demoName: string;
}

interface TasksViewProps {
  demos: Demo[];
  onToggleComplete: (demoId: string, commentId: string) => void;
  onDeleteComment: (demoId: string, commentId: string) => void;
  onUpdatePriority: (demoId: string, commentId: string, priority: TaskPriority) => void;
  onUpdateStatus: (demoId: string, commentId: string, status: TaskStatus) => void;
}

export const TasksView = ({
  demos,
  onToggleComplete,
  onDeleteComment,
  onUpdatePriority,
  onUpdateStatus,
}: TasksViewProps) => {
  const [completionFilter, setCompletionFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');

  // Flatten all comments from all demos
  const allTasks = useMemo(() => {
    const tasks: TaskWithDemo[] = [];
    demos.forEach((demo) => {
      demo.comments.forEach((comment) => {
        tasks.push({
          ...comment,
          demoId: demo.id,
          demoName: demo.name,
        });
      });
    });
    // Sort by priority (High -> Mid -> Low) then by creation date
    return tasks.sort((a, b) => {
      const priorityOrder = { High: 0, Mid: 1, Low: 2 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [demos]);

  const filteredTasks = useMemo(() => {
    let filtered = allTasks;

    // Filter by completion
    if (completionFilter === 'active') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (completionFilter === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    return filtered;
  }, [allTasks, completionFilter, priorityFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [allTasks]);

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

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Mid':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Review':
        return 'bg-purple-100 text-purple-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tasks</h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Total: {stats.total}</span>
          <span>Active: {stats.active}</span>
          <span>Completed: {stats.completed}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        {/* Completion Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Completion</label>
          <div className="flex gap-2">
            <button
              onClick={() => setCompletionFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                completionFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setCompletionFilter('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                completionFilter === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setCompletionFilter('completed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                completionFilter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>

        {/* Priority and Status Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | TaskPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Mid">Mid</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | TaskStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No tasks match the selected filters
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={`${task.demoId}-${task.id}`}
              className={`bg-white rounded-lg shadow-md p-4 transition-opacity ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.demoId, task.id)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <p
                      className={`flex-1 text-gray-800 whitespace-pre-wrap ${
                        task.completed ? 'line-through' : ''
                      }`}
                    >
                      {task.text}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                      <select
                        value={task.priority}
                        onChange={(e) => onUpdatePriority(task.demoId, task.id, e.target.value as TaskPriority)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Mid">Mid</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        value={task.status}
                        onChange={(e) => onUpdateStatus(task.demoId, task.id, e.target.value as TaskStatus)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Approved">Approved</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <Link
                      to={`/demo/${task.demoId}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {task.demoName}
                    </Link>
                    <span>•</span>
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this task?')) {
                      onDeleteComment(task.demoId, task.id);
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredTasks.length} of {allTasks.length} tasks
      </div>
    </div>
  );
};
