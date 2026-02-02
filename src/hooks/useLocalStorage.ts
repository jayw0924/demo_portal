import { useState, useEffect, useRef } from 'react';
import type { Demo } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'demo-tracker-demos';

// Helper function to load initial data from localStorage
const loadInitialDemos = (): Demo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading demos from localStorage:', error);
  }
  return [];
};

export const useLocalStorage = () => {
  // Initialize state with data from localStorage
  const [demos, setDemos] = useState<Demo[]>(loadInitialDemos);
  const isInitialMount = useRef(true);

  // Save demos to localStorage whenever they change (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demos));
  }, [demos]);

  const addDemo = (demoData: Omit<Demo, 'id' | 'createdAt' | 'comments'>) => {
    const newDemo: Demo = {
      ...demoData,
      id: uuidv4(),
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setDemos([...demos, newDemo]);
    return newDemo;
  };

  const updateDemo = (id: string, updates: Partial<Demo>) => {
    setDemos(demos.map(demo =>
      demo.id === id ? { ...demo, ...updates } : demo
    ));
  };

  const deleteDemo = (id: string) => {
    setDemos(demos.filter(demo => demo.id !== id));
  };

  const getDemo = (id: string) => {
    return demos.find(demo => demo.id === id);
  };

  const addComment = (demoId: string, commentText: string) => {
    const demo = demos.find(d => d.id === demoId);
    if (!demo) return;

    const newComment = {
      id: uuidv4(),
      text: commentText,
      createdAt: new Date().toISOString(),
      completed: false,
      priority: 'Mid' as const,
      status: 'Pending' as const,
    };

    updateDemo(demoId, {
      comments: [...demo.comments, newComment],
    });
  };

  const deleteComment = (demoId: string, commentId: string) => {
    const demo = demos.find(d => d.id === demoId);
    if (!demo) return;

    updateDemo(demoId, {
      comments: demo.comments.filter(c => c.id !== commentId),
    });
  };

  const toggleCommentComplete = (demoId: string, commentId: string) => {
    const demo = demos.find(d => d.id === demoId);
    if (!demo) return;

    const updatedComments = demo.comments.map(c =>
      c.id === commentId ? { ...c, completed: !c.completed } : c
    );

    updateDemo(demoId, {
      comments: updatedComments,
    });
  };

  const updateCommentPriority = (demoId: string, commentId: string, priority: 'Low' | 'Mid' | 'High') => {
    const demo = demos.find(d => d.id === demoId);
    if (!demo) return;

    const updatedComments = demo.comments.map(c =>
      c.id === commentId ? { ...c, priority } : c
    );

    updateDemo(demoId, {
      comments: updatedComments,
    });
  };

  const updateCommentStatus = (demoId: string, commentId: string, status: 'Pending' | 'In Progress' | 'Review' | 'Approved') => {
    const demo = demos.find(d => d.id === demoId);
    if (!demo) return;

    const updatedComments = demo.comments.map(c =>
      c.id === commentId ? { ...c, status } : c
    );

    updateDemo(demoId, {
      comments: updatedComments,
    });
  };

  return {
    demos,
    addDemo,
    updateDemo,
    deleteDemo,
    getDemo,
    addComment,
    deleteComment,
    toggleCommentComplete,
    updateCommentPriority,
    updateCommentStatus,
  };
};
