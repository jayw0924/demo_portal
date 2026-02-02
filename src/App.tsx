import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// import { useLocalStorage } from './hooks/useLocalStorage';
import { useSupabase } from './hooks/useSupabase';
import { Navigation } from './components/Navigation';
import { DemoList } from './components/DemoList';
import { DemoDetail } from './components/DemoDetail';
import { DemoForm } from './components/DemoForm';
import { TasksView } from './components/TasksView';
import { KanbanView } from './components/KanbanView';

function App() {
  const {
    demos,
    loading,
    error,
    addDemo,
    updateDemo,
    deleteDemo,
    addComment,
    deleteComment,
    toggleCommentComplete,
    updateCommentPriority,
    updateCommentStatus,
    exportData,
    importData,
  } = useSupabase();

  if (loading) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading demos...</p>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }

  if (error) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h2>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <DemoList
                  demos={demos}
                  onDelete={deleteDemo}
                  onExport={exportData}
                  onImport={importData}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <TasksView
                  demos={demos}
                  onToggleComplete={toggleCommentComplete}
                  onDeleteComment={deleteComment}
                  onUpdatePriority={updateCommentPriority}
                  onUpdateStatus={updateCommentStatus}
                />
              }
            />
            <Route
              path="/kanban"
              element={
                <KanbanView
                  demos={demos}
                  onUpdateDemo={updateDemo}
                />
              }
            />
            <Route
              path="/demo/new"
              element={
                <DemoForm
                  demos={demos}
                  onSave={addDemo}
                  onUpdate={updateDemo}
                />
              }
            />
            <Route
              path="/demo/:id"
              element={
                <DemoDetail
                  demos={demos}
                  onDelete={deleteDemo}
                  onAddComment={addComment}
                  onDeleteComment={deleteComment}
                  onToggleComplete={toggleCommentComplete}
                  onUpdatePriority={updateCommentPriority}
                  onUpdateStatus={updateCommentStatus}
                />
              }
            />
            <Route
              path="/demo/:id/edit"
              element={
                <DemoForm
                  demos={demos}
                  onSave={addDemo}
                  onUpdate={updateDemo}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
