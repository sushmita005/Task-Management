/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from "react";

const TaskModal = ({ onSaveTask, initialData, onClose }) => {
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    if (initialData) {
      setTask(initialData.name);
      setStatus(initialData.status);
    } else {
      setTask(""); // Reset task name when opening in "Add Task" mode
      setStatus("Pending"); // Reset status to "Pending"
    }
  }, [initialData]);

  const handleSave = useCallback(() => {
    if (task.trim() === "") {
      return; // Don't save if task is empty
    }
    onSaveTask(task, status); // Pass task data to parent
  }, [task, status, onSaveTask]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Task" : "Add Task"}</h2>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Task Name"
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          aria-label="Task Name"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          aria-label="Task Status"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-md mr-2">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
           
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskModal);
