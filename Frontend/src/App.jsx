import  { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Header from './components/Header';
import Sidebar from './components/Slider';
import Dashboard from './components/Dashboard';
import './App.css';
import { ToastContainer } from 'react-toastify';

import "react-toastify/dist/ReactToastify.css";  // Make sure to include the CSS file


function App() {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <ThemeProvider>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
              <div className="container mx-auto px-6 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  {/* Add other routes here */}
                </Routes>
              </div>
            </main>
          </div>
          <ToastContainer />
          {/* <Button/> */}
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
