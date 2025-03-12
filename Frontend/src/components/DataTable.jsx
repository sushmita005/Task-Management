import { formatDateToLocal } from "@/utils/dateFormatter";
import { Pencil, Trash } from "lucide-react";
import React, { useCallback, useState } from "react";

// Memoizing the component to prevent unnecessary re-renders
// eslint-disable-next-line react/prop-types
const DataTable = React.memo(({ tasks, onEditTask, deleteTask }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState({ column: "id", order: "asc" }); // State for sorting

  const handleEditClick = useCallback((id) => {
    onEditTask(id);
  }, [onEditTask]);

  const handleDeleteClick = useCallback((id) => {
    deleteTask(id);
  }, [deleteTask]);

  // Conditional class logic for task status
  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-blue-500";
      case "Pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Sorting logic
  const sortTasks = (tasks) => {
    const { column, order } = sortBy;
    return [...tasks].sort((a, b) => {
      if (column === "created_at") {
        // For created_at, we need to parse the dates
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (typeof a[column] === "string") {
        // For string columns like name, task_id
        const comparison = a[column].localeCompare(b[column]);
        return order === "asc" ? comparison : -comparison;
      }

      return b[column] - a[column]; // Numeric columns
    });
  };

  // Filter tasks based on search query and selected status
  const filteredTasks = tasks?.filter((task) => {
    const matchesSearchQuery =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toString().includes(searchQuery);

    const matchesStatus =
      filterStatus === "All" || task.status === filterStatus;

    return matchesSearchQuery && matchesStatus;
  });

  // Apply sorting after filtering
  const sortedTasks = sortTasks(filteredTasks);

  // Toggle sorting direction
  const handleSort = (column) => {
    setSortBy((prevSortBy) => {
      const newOrder =
        prevSortBy.column === column && prevSortBy.order === "asc"
          ? "desc"
          : "asc";
      return { column, order: newOrder };
    });
  };

  // Render the arrow symbol for sorting
  const renderArrow = (column) => {
    if(sortBy.column === "sno") return null;
    if(sortBy.column === "id") return null;
    if (sortBy.column !== column) return null;
    return sortBy.order === "asc" ? "▲" : "▼";
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />

        {/* Filter Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="All">Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 dark:text-white">
                <tr>
                  <th
                    onClick={() => handleSort("sno")}
                    className="text-sm font-medium text-gray-900 dark:text-white px-6 py-4 text-left cursor-pointer"
                  >
                    S. No. {renderArrow("sno")}
                  </th>
                  <th
                    onClick={() => handleSort("id")}
                    className="text-sm font-medium text-gray-900 dark:text-white px-6 py-4 text-left cursor-pointer"
                  >
                    Task ID {renderArrow("id")}
                  </th>
                  <th
                    onClick={() => handleSort("name")}
                    className="text-sm font-medium text-gray-900 dark:text-white px-6 py-4 text-left cursor-pointer"
                  >
                    Task Name {renderArrow("name")}
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="text-sm font-medium text-gray-900 dark:text-white px-6 py-4 text-left cursor-pointer"
                  >
                    Status {renderArrow("status")}
                  </th>
                  <th
                    onClick={() => handleSort("created_at")}
                    className="text-sm font-medium text-gray-900 dark:text-white px-6 py-4 text-left cursor-pointer"
                  >
                    Created At {renderArrow("created_at")}
                  </th>
                  <th className="text-sm font-medium text-gray-900 dark:text-white px-6 py-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks?.length > 0 ? (
                  sortedTasks?.map((task, index) => (
                    <tr key={task.id} className="bg-white dark:bg-gray-600 border-b">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {task.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{task.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full ${getStatusClass(task.status)} text-white`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 rounded-full">
                          {formatDateToLocal(task.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleEditClick(task.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-full h-10  mr-2"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(task.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full h-10"
                        >
                          <Trash size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white">
                    <td colSpan="6" className="text-center py-4 text-sm text-gray-500 dark:bg-gray-600 dark:text-white">
                      No tasks available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DataTable;
