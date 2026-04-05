import React, { useState, KeyboardEvent } from 'react';
import { Check, Trash2, Plus, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const addTask = () => {
    if (inputValue.trim() === '') return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
    };
    
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(task => !task.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <ListTodo size={28} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Vazifalar ro'yxati
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Bugungi rejalaringizni yozib qo'ying
          </p>
        </div>

        {/* Input area */}
        <div className="mt-8 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Yangi vazifa qo'shish..."
            className="flex-1 min-w-0 block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
          <button
            onClick={addTask}
            disabled={!inputValue.trim()}
            className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Filters */}
        {tasks.length > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {f === 'all' && 'Barchasi'}
                {f === 'active' && 'Bajarilmagan'}
                {f === 'completed' && 'Bajarilgan'}
              </button>
            ))}
          </div>
        )}

        {/* Task List */}
        <div className="mt-6">
          <ul className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <motion.li
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  key={task.id}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                    task.completed 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 text-transparent hover:border-indigo-500'
                      }`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                    <span
                      className={`truncate transition-all duration-200 ${
                        task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 ml-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all p-1 rounded-md hover:bg-red-50"
                    aria-label="Vazifani o'chirish"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
            
            {tasks.length > 0 && filteredTasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-500 text-sm"
              >
                Bu bo'limda vazifalar yo'q.
              </motion.div>
            )}
            
            {tasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                  <Check className="text-gray-300" size={32} />
                </div>
                <p className="text-gray-500 text-sm">Hali hech qanday vazifa qo'shilmagan.</p>
              </motion.div>
            )}
          </ul>
        </div>

        {/* Footer stats */}
        {tasks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span>{activeCount} ta vazifa qoldi</span>
            {tasks.length - activeCount > 0 && (
              <button 
                onClick={() => setTasks(tasks.filter(t => !t.completed))}
                className="hover:text-gray-800 transition-colors"
              >
                Bajarilganlarni tozalash
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
