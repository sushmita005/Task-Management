import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, X } from 'lucide-react';

const navItems = [
  { name: 'Task Details', href: '/', icon: BarChart2 }
];

function Sidebar({ open, setOpen }) {
  const location = useLocation();

  return (
    <>
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
          open ? 'block' : 'hidden'
        }`}
        onClick={() => setOpen(false)}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-800 lg:translate-x-0 lg:static lg:inset-0 ${
          open ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-between flex-shrink-0 p-4">
          <Link to="/" className="text-lg font-semibold text-white">
            Task Manager
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-white rounded-md lg:hidden hover:text-gray-200 focus:outline-none focus:ring"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-5">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="px-2">
                <Link 
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                    location.pathname === item.href
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;

