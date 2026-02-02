import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Demo } from '../types';

interface KanbanViewProps {
  demos: Demo[];
  onUpdateDemo: (demoId: string, updates: Partial<Demo>) => void;
}

type GroupByOption = 'status' | 'category';

export const KanbanView = ({
  demos,
  onUpdateDemo,
}: KanbanViewProps) => {
  const [groupBy, setGroupBy] = useState<GroupByOption>('status');
  const [draggedDemo, setDraggedDemo] = useState<Demo | null>(null);

  // Define columns based on grouping
  const columns = useMemo(() => {
    if (groupBy === 'status') {
      return [
        { id: 'active', title: 'Active', color: 'bg-green-50 border-green-300' },
        { id: 'pending', title: 'Pending', color: 'bg-yellow-50 border-yellow-300' },
        { id: 'completed', title: 'Completed', color: 'bg-blue-50 border-blue-300' },
        { id: 'archived', title: 'Archived', color: 'bg-gray-50 border-gray-300' },
      ];
    } else {
      // Get unique categories
      const categories = Array.from(new Set(demos.map((d) => d.category).filter(Boolean)));
      return categories.map((cat) => ({
        id: cat,
        title: cat,
        color: 'bg-purple-50 border-purple-300',
      }));
    }
  }, [groupBy, demos]);

  // Group demos by column
  const demosByColumn = useMemo(() => {
    const grouped: Record<string, Demo[]> = {};
    columns.forEach((col) => {
      grouped[col.id] = [];
    });

    demos.forEach((demo) => {
      const key = groupBy === 'status' ? demo.status.toLowerCase() : demo.category;
      if (grouped[key]) {
        grouped[key].push(demo);
      }
    });

    // Sort by priority
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.priority - b.priority);
    });

    return grouped;
  }, [demos, columns, groupBy]);

  const handleDragStart = (demo: Demo) => {
    setDraggedDemo(demo);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (!draggedDemo) return;

    if (groupBy === 'status') {
      // Update demo status
      onUpdateDemo(draggedDemo.id, { status: columnId });
    } else {
      // Update demo category
      onUpdateDemo(draggedDemo.id, { category: columnId });
    }

    setDraggedDemo(null);
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'border-l-4 border-l-red-500';
      case 2:
        return 'border-l-4 border-l-orange-500';
      case 3:
        return 'border-l-4 border-l-yellow-500';
      case 4:
        return 'border-l-4 border-l-green-500';
      case 5:
        return 'border-l-4 border-l-blue-500';
      default:
        return 'border-l-4 border-l-gray-500';
    }
  };

  const getTaskStats = (demo: Demo) => {
    const total = demo.comments.length;
    const completed = demo.comments.filter((c) => c.completed).length;
    return { total, completed };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kanban Board</h1>
          <p className="text-sm text-gray-600">
            Total: {demos.length} demos
          </p>
        </div>

        {/* Group By Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setGroupBy('status')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              groupBy === 'status'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Group by Status
          </button>
          <button
            onClick={() => setGroupBy('category')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              groupBy === 'category'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Group by Category
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            {/* Column Header */}
            <div className={`${column.color} border-2 rounded-t-lg p-3`}>
              <h3 className="font-semibold text-gray-900">
                {column.title}
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({demosByColumn[column.id]?.length || 0})
                </span>
              </h3>
            </div>

            {/* Column Content */}
            <div className="bg-gray-100 border-2 border-t-0 border-gray-300 rounded-b-lg p-3 min-h-[500px] space-y-3">
              {demosByColumn[column.id]?.map((demo) => {
                const taskStats = getTaskStats(demo);
                return (
                  <Link
                    key={demo.id}
                    to={`/demo/${demo.id}`}
                    draggable
                    onDragStart={(e) => {
                      e.preventDefault();
                      handleDragStart(demo);
                    }}
                    className={`block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move ${getPriorityColor(
                      demo.priority
                    )}`}
                  >
                    <div className="space-y-2">
                      {/* Demo Thumbnail */}
                      {demo.thumbnailUrl && (
                        <div className="w-full h-32 bg-gray-200 rounded overflow-hidden mb-2">
                          <img
                            src={demo.thumbnailUrl}
                            alt={demo.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Demo Name */}
                      <h4 className="font-semibold text-gray-900">{demo.name}</h4>

                      {/* Client */}
                      <p className="text-sm text-gray-600">{demo.client}</p>

                      {/* Metadata Badges */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                          P{demo.priority}
                        </span>
                        {groupBy === 'status' && demo.category && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            {demo.category}
                          </span>
                        )}
                        {groupBy === 'category' && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded capitalize">
                            {demo.status}
                          </span>
                        )}
                      </div>

                      {/* Task Progress */}
                      {taskStats.total > 0 && (
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Tasks</span>
                            <span>
                              {taskStats.completed}/{taskStats.total}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${(taskStats.completed / taskStats.total) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}

              {/* Empty State */}
              {(!demosByColumn[column.id] || demosByColumn[column.id].length === 0) && (
                <div className="text-center text-gray-400 text-sm py-8">
                  No demos
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Tip:</strong> Drag and drop demo cards between columns to change their{' '}
        {groupBy === 'status' ? 'status' : 'category'}
      </div>
    </div>
  );
};
