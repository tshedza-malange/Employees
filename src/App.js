import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Employee from './Employees'; 
import AddEmployee from './AddEmployee';

function App() {
  return (
    <Router>
      <div className="App">

        <main>
          <Routes>
             <Route path="/" element={<Employee />} />
            <Route path="/employee/:employeeNo" element={<AddEmployee />} />
            <Route path="/add" element={<AddEmployee />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
