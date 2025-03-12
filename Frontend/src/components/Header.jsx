import React from 'react';
import { useTheme } from './ThemeProvider';
import { Menu, Moon, Sun } from 'lucide-react';

function Header({ sidebarOpen, setSidebarOpen }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="text-gray-500 focus:outline-none lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="sm:text-xl text-xs font-semibold  text-gray-800 dark:text-white sm:ml-80 ml-7">
              Task Management Dashboard
            </h1>
          </div>
          <div className="flex items-center sm:gap-2 sm:mr-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

