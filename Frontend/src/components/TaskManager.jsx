import React, { useState } from 'react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [taskInput, setTaskInput] = useState(''); // State to store task input
  const [statusInput, setStatusInput] = useState(''); // State to store status input

  // Function to handle adding a new task
  const addTask = () => {
    if (taskInput.trim() && statusInput.trim()) {
      const newTask = { task: taskInput, status: statusInput };
      setTasks([...tasks, newTask]);
      setTaskInput(''); // Reset task input field
      setStatusInput(''); // Reset status input field
    } else {
      alert('Please fill out both fields!');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Task Manager</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Status"
          value={statusInput}
          onChange={(e) => setStatusInput(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={addTask} style={{ padding: '5px 10px' }}>
          Add Task
        </button>
      </div>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.task}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManager;
