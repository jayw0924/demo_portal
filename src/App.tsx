import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navigation } from './components/Navigation';
import { DemoList } from './components/DemoList';
import { DemoDetail } from './components/DemoDetail';
import { DemoForm } from './components/DemoForm';
import { TasksView } from './components/TasksView';

function App() {
  const {
    demos,
    addDemo,
    updateDemo,
    deleteDemo,
    addComment,
    deleteComment,
    toggleCommentComplete,
    updateCommentPriority,
    updateCommentStatus,
  } = useLocalStorage();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={<DemoList demos={demos} onDelete={deleteDemo} />}
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
