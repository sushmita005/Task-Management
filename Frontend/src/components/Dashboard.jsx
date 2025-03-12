import { useState, useEffect, useCallback } from "react";
import DataTable from "./DataTable";
import TaskModal from "./TaskModal";
import axios from "axios";  // for making HTTP requests
import { io } from "socket.io-client";
import { notify } from "./Notification";

const API_URL = "http://localhost:5000/tasks";

function Dashboard() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const socket = io("http://localhost:5000"); // Connect to the Socket.IO server

  // Fetch tasks from the backend
  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await axios.get(API_URL);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    // Listen for real-time events
    socket.on("taskAdded", (newTask) => {
      console.log("listening for task",newTask)
      notify(newTask.message, "success");
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socket.on("taskUpdated", (updatedTask) => {
      notify(updatedTask.message, "success");
      fetchTasks();
    });

    socket.on("taskDeleted", (deletedTaskId) => {
      notify(deletedTaskId.message, "error");
      // setTasks((prevTasks) =>
      //   prevTasks.filter((task) => task.id !== parseInt(deletedTaskId?.id))
      // );
      fetchTasks();
    });

    // Clean up socket listeners on unmount
    return () => {
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTasks]);

  // Handle add or update task
  const handleSaveTask = useCallback(
    async (taskName, taskStatus) => {
      const taskPayload = { name: taskName, status: taskStatus };

      try {
        if (editTaskId) {
          // Update task
          await axios.put(`${API_URL}/${editTaskId}`, taskPayload);
        } else {
          // Add new task
          await axios.post(API_URL, taskPayload);
        }
        setShowTaskModal(false);
        setEditTaskId(null);
      } catch (error) {
        console.error("Error saving task:", error);
      }
    },
    [editTaskId]
  );

  // Handle task deletion
  const handleDeleteTask = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }, []);

  // Open modal for adding a task
  const handleAddTaskClick = () => {
    setShowTaskModal(true);
    setEditTaskId(null);
  };

  // Open modal for editing a task
  const handleEditTaskClick = (id) => {
    setEditTaskId(id);
    setShowTaskModal(true);
  };

  return (
    <div>
      <div className="relative h-16 w-full bg-gray-100 dark:bg-gray-900">
        <button
          onClick={handleAddTaskClick}
          className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-md text-sm absolute right-4"
        >
          Add Task
        </button>
      </div>

      {showTaskModal && (
        <TaskModal
          onSaveTask={handleSaveTask}
          initialData={editTaskId ? tasks.find((task) => task.id === editTaskId) : null}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      <DataTable
        tasks={tasks}
        onEditTask={handleEditTaskClick}
        deleteTask={handleDeleteTask}
      />
    </div>
  );
}

export default Dashboard;
