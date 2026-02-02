import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Demo } from '../types';
import { DemoCard } from './DemoCard';

interface DemoListProps {
  demos: Demo[];
  onDelete: (id: string) => void;
}

export const DemoList = ({ demos, onDelete }: DemoListProps) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'name' | 'createdAt'>('priority');

  // Get unique categories and statuses
  const categories = useMemo(() => {
    const cats = new Set(demos.map((d) => d.category));
    return ['all', ...Array.from(cats)];
  }, [demos]);

  const statuses = useMemo(() => {
    const stats = new Set(demos.map((d) => d.status));
    return ['all', ...Array.from(stats)];
  }, [demos]);

  // Filter and sort demos
  const filteredAndSortedDemos = useMemo(() => {
    let filtered = demos;

    if (filterCategory !== 'all') {
      filtered = filtered.filter((d) => d.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((d) => d.status === filterStatus);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        return a.priority - b.priority;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [demos, filterCategory, filterStatus, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Demo Tracker</h1>
        <Link
          to="/demo/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          + Add New Demo
        </Link>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((stat) => (
                <option key={stat} value={stat}>
                  {stat === 'all' ? 'All Statuses' : stat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort by
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'priority' | 'name' | 'createdAt')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="priority">Priority</option>
              <option value="name">Name</option>
              <option value="createdAt">Date Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* Demo Grid */}
      {filteredAndSortedDemos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No demos found</p>
          <Link
            to="/demo/new"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Create your first demo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDemos.map((demo) => (
            <DemoCard key={demo.id} demo={demo} onDelete={onDelete} />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredAndSortedDemos.length} of {demos.length} demos
      </div>
    </div>
  );
};
