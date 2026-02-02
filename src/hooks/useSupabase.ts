import { useState, useEffect } from 'react';
import type { Demo } from '../types';
import { supabase } from '../lib/supabase';

interface SupabaseDemo {
  id: string;
  name: string;
  client: string;
  demo_url: string;
  thumbnail_url: string | null;
  category: string;
  priority: number;
  status: string;
  created_at: string;
}

interface SupabaseComment {
  id: string;
  demo_id: string;
  text: string;
  completed: boolean;
  priority: string;
  status: string;
  created_at: string;
}

// Convert Supabase format to app format
const convertSupabaseDemoToDemo = (
  demo: SupabaseDemo,
  comments: SupabaseComment[]
): Demo => ({
  id: demo.id,
  name: demo.name,
  client: demo.client,
  demoUrl: demo.demo_url,
  thumbnailUrl: demo.thumbnail_url || '',
  category: demo.category,
  priority: demo.priority,
  status: demo.status,
  createdAt: demo.created_at,
  comments: comments
    .filter((c) => c.demo_id === demo.id)
    .map((c) => ({
      id: c.id,
      text: c.text,
      completed: c.completed,
      priority: c.priority as 'Low' | 'Mid' | 'High',
      status: c.status as 'Pending' | 'In Progress' | 'Review' | 'Approved',
      createdAt: c.created_at,
    })),
});

export const useSupabase = () => {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all demos and comments
  const fetchDemos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch demos
      const { data: demosData, error: demosError } = await supabase
        .from('demos')
        .select('*')
        .order('created_at', { ascending: false });

      if (demosError) throw demosError;

      // Fetch all comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Combine demos with their comments
      const combinedDemos = (demosData || []).map((demo) =>
        convertSupabaseDemoToDemo(demo, commentsData || [])
      );

      setDemos(combinedDemos);
    } catch (err) {
      console.error('Error fetching demos:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch demos');
    } finally {
      setLoading(false);
    }
  };

  // Load demos on mount
  useEffect(() => {
    fetchDemos();
  }, []);

  const addDemo = async (demoData: Omit<Demo, 'id' | 'createdAt' | 'comments'>) => {
    try {
      const { data, error } = await supabase
        .from('demos')
        .insert({
          name: demoData.name,
          client: demoData.client,
          demo_url: demoData.demoUrl,
          thumbnail_url: demoData.thumbnailUrl || null,
          category: demoData.category,
          priority: demoData.priority,
          status: demoData.status,
        })
        .select()
        .single();

      if (error) throw error;

      const newDemo: Demo = {
        id: data.id,
        name: data.name,
        client: data.client,
        demoUrl: data.demo_url,
        thumbnailUrl: data.thumbnail_url || '',
        category: data.category,
        priority: data.priority,
        status: data.status,
        createdAt: data.created_at,
        comments: [],
      };

      setDemos([newDemo, ...demos]);
      return newDemo;
    } catch (err) {
      console.error('Error adding demo:', err);
      setError(err instanceof Error ? err.message : 'Failed to add demo');
      return null;
    }
  };

  const updateDemo = async (id: string, updates: Partial<Demo>) => {
    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.client !== undefined) dbUpdates.client = updates.client;
      if (updates.demoUrl !== undefined) dbUpdates.demo_url = updates.demoUrl;
      if (updates.thumbnailUrl !== undefined) dbUpdates.thumbnail_url = updates.thumbnailUrl || null;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await supabase
        .from('demos')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setDemos(demos.map((demo) =>
        demo.id === id ? { ...demo, ...updates } : demo
      ));
    } catch (err) {
      console.error('Error updating demo:', err);
      setError(err instanceof Error ? err.message : 'Failed to update demo');
    }
  };

  const deleteDemo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('demos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDemos(demos.filter((demo) => demo.id !== id));
    } catch (err) {
      console.error('Error deleting demo:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete demo');
    }
  };

  const getDemo = (id: string) => {
    return demos.find((demo) => demo.id === id);
  };

  const addComment = async (demoId: string, commentText: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          demo_id: demoId,
          text: commentText,
          completed: false,
          priority: 'Mid',
          status: 'Pending',
        })
        .select()
        .single();

      if (error) throw error;

      const newComment = {
        id: data.id,
        text: data.text,
        completed: data.completed,
        priority: data.priority as 'Low' | 'Mid' | 'High',
        status: data.status as 'Pending' | 'In Progress' | 'Review' | 'Approved',
        createdAt: data.created_at,
      };

      setDemos(demos.map((demo) =>
        demo.id === demoId
          ? { ...demo, comments: [...demo.comments, newComment] }
          : demo
      ));
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  const deleteComment = async (demoId: string, commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setDemos(demos.map((demo) =>
        demo.id === demoId
          ? { ...demo, comments: demo.comments.filter((c) => c.id !== commentId) }
          : demo
      ));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  const toggleCommentComplete = async (demoId: string, commentId: string) => {
    try {
      const demo = demos.find((d) => d.id === demoId);
      const comment = demo?.comments.find((c) => c.id === commentId);
      if (!comment) return;

      const { error } = await supabase
        .from('comments')
        .update({ completed: !comment.completed })
        .eq('id', commentId);

      if (error) throw error;

      setDemos(demos.map((d) =>
        d.id === demoId
          ? {
              ...d,
              comments: d.comments.map((c) =>
                c.id === commentId ? { ...c, completed: !c.completed } : c
              ),
            }
          : d
      ));
    } catch (err) {
      console.error('Error toggling comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle comment');
    }
  };

  const updateCommentPriority = async (
    demoId: string,
    commentId: string,
    priority: 'Low' | 'Mid' | 'High'
  ) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ priority })
        .eq('id', commentId);

      if (error) throw error;

      setDemos(demos.map((d) =>
        d.id === demoId
          ? {
              ...d,
              comments: d.comments.map((c) =>
                c.id === commentId ? { ...c, priority } : c
              ),
            }
          : d
      ));
    } catch (err) {
      console.error('Error updating comment priority:', err);
      setError(err instanceof Error ? err.message : 'Failed to update priority');
    }
  };

  const updateCommentStatus = async (
    demoId: string,
    commentId: string,
    status: 'Pending' | 'In Progress' | 'Review' | 'Approved'
  ) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', commentId);

      if (error) throw error;

      setDemos(demos.map((d) =>
        d.id === demoId
          ? {
              ...d,
              comments: d.comments.map((c) =>
                c.id === commentId ? { ...c, status } : c
              ),
            }
          : d
      ));
    } catch (err) {
      console.error('Error updating comment status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(demos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `demo-tracker-backup-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Demo[];

        // Import each demo
        for (const demo of imported) {
          // Insert demo
          const { data: demoData, error: demoError } = await supabase
            .from('demos')
            .insert({
              name: demo.name,
              client: demo.client,
              demo_url: demo.demoUrl,
              thumbnail_url: demo.thumbnailUrl || null,
              category: demo.category,
              priority: demo.priority,
              status: demo.status,
            })
            .select()
            .single();

          if (demoError) {
            console.error('Error importing demo:', demoError);
            continue;
          }

          // Insert comments for this demo
          if (demo.comments && demo.comments.length > 0) {
            const commentsToInsert = demo.comments.map((comment) => ({
              demo_id: demoData.id,
              text: comment.text,
              completed: comment.completed,
              priority: comment.priority,
              status: comment.status,
            }));

            const { error: commentsError } = await supabase
              .from('comments')
              .insert(commentsToInsert);

            if (commentsError) {
              console.error('Error importing comments:', commentsError);
            }
          }
        }

        // Refresh demos from database
        await fetchDemos();
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  return {
    demos,
    loading,
    error,
    addDemo,
    updateDemo,
    deleteDemo,
    getDemo,
    addComment,
    deleteComment,
    toggleCommentComplete,
    updateCommentPriority,
    updateCommentStatus,
    exportData,
    importData,
  };
};
