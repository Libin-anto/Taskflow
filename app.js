const { useState, useEffect } = React;

// Main App Component
function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add new task
  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium'
    };
    setTasks([newTask, ...tasks]);
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Edit task
  const editTask = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  // Update task priority
  const updatePriority = (id, priority) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, priority } : task
    ));
  };

  // Clear completed tasks
  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Statistics
  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'dark-mode' : ''}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode}
          stats={stats}
        />

        {/* Task Input */}
        <TaskInput addTask={addTask} />

        {/* Statistics */}
        <Statistics stats={stats} />

        {/* Filter Buttons */}
        <FilterButtons 
          filter={filter} 
          setFilter={setFilter}
          clearCompleted={clearCompleted}
          hasCompleted={stats.completed > 0}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
          editTask={editTask}
          updatePriority={updatePriority}
        />

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <EmptyState filter={filter} />
        )}
      </div>
    </div>
  );
}

// Header Component
function Header({ darkMode, setDarkMode, stats }) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <h1 className="text-5xl font-bold text-indigo-600">
          ✓ To-Do List
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <p className="text-gray-600 text-lg">
        Stay organized and productive
      </p>
    </div>
  );
}

// Task Input Component
function TaskInput({ addTask }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (input.trim() === '') {
      setError('Task cannot be empty');
      return;
    }

    if (input.trim().length < 3) {
      setError('Task must be at least 3 characters');
      return;
    }

    addTask(input.trim());
    setInput('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105"
          >
            Add Task
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">⚠️ {error}</p>
        )}
      </div>
    </form>
  );
}

// Statistics Component
function Statistics({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-md p-4 text-center">
        <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
        <p className="text-gray-600 text-sm">Total Tasks</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 text-center">
        <p className="text-3xl font-bold text-orange-500">{stats.active}</p>
        <p className="text-gray-600 text-sm">Active</p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 text-center">
        <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
        <p className="text-gray-600 text-sm">Completed</p>
      </div>
    </div>
  );
}

// Filter Buttons Component
function FilterButtons({ filter, setFilter, clearCompleted, hasCompleted }) {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-between items-center">
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {hasCompleted && (
        <button
          onClick={clearCompleted}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition"
        >
          Clear Completed
        </button>
      )}
    </div>
  );
}


// Task List Component
function TaskList({ tasks, deleteTask, toggleTask, editTask, updatePriority }) {
  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
          editTask={editTask}
          updatePriority={updatePriority}
        />
      ))}
    </div>
  );
}

// Task Item Component
function TaskItem({ task, deleteTask, toggleTask, editTask, updatePriority }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [showPriority, setShowPriority] = useState(false);

  const handleEdit = () => {
    if (editText.trim() === '') return;
    editTask(task.id, editText.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const priorityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-green-500 bg-green-50'
  };

  const priorityLabels = {
    high: '🔴 High',
    medium: '🟡 Medium',
    low: '🟢 Low'
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 transition transform hover:scale-[1.02] border-l-4 ${priorityColors[task.priority]}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleTask(task.id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-indigo-500'
          }`}
        >
          {task.completed && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3 py-2 border-2 border-indigo-500 rounded-lg focus:outline-none"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {task.text}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => setShowPriority(!showPriority)}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  {priorityLabels[task.priority]}
                </button>
              </div>
              
              {/* Priority Selector */}
              {showPriority && (
                <div className="flex gap-2 mt-2">
                  {Object.entries(priorityLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        updatePriority(task.id, key);
                        setShowPriority(false);
                      }}
                      className={`text-xs px-3 py-1 rounded-lg ${
                        task.priority === key
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Edit task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ filter }) {
  const messages = {
    all: 'No tasks yet. Add one to get started!',
    active: 'No active tasks. Great job!',
    completed: 'No completed tasks yet. Keep going!'
  };

  const emojis = {
    all: '📝',
    active: '✨',
    completed: '🎯'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-12 text-center">
      <div className="text-6xl mb-4">{emojis[filter]}</div>
      <p className="text-xl text-gray-600">{messages[filter]}</p>
    </div>
  );
}

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
