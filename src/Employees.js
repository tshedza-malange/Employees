import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Employees.css';
import AddEmployee from './AddEmployee';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [selectedEmployeeNo, setSelectedEmployeeNo] = useState(null); // Track selected employee

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3001/getEmployees');
            console.log('API Response:', response.data);
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const toggleAddEmployeeForm = (employeeNo = null) => {
        setShowAddEmployee(true); // Always show the form
        setSelectedEmployeeNo(employeeNo); // Set the selected employee number
    };

    const handleDelete = async (employeeNo) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`http://localhost:3001/deleteEmployee/${employeeNo}`);
                setEmployees(employees.filter(employee => employee.employeeNo !== employeeNo));
                alert('Employee deleted successfully!');
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('Error deleting employee. Please try again.');
            }
        }
    };

    const refreshEmployees = () => {
        fetchEmployees(); 
    };

    return (
        <div>
            <h2>Current Employees</h2>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => toggleAddEmployeeForm()}>
                    Add Employee
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Employee #</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Salutation</th>
                        <th>Profile Colour</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length === 0 ? (
                        <tr>
                            <td colSpan="6">No employees found.</td>
                        </tr>
                    ) : (
                        employees.map((employee) => (
                            <tr key={employee._id}>
                                <td>
                                    <button onClick={() => toggleAddEmployeeForm(employee.employeeNo)}>
                                        {employee.employeeNo}
                                    </button>
                                </td>
                                <td>{employee.firstName}</td>
                                <td>{employee.lastName}</td>
                                <td>{employee.salutation}</td>
                                <td>{employee.profileColor}</td>
                                <td>
                                    <button onClick={() => handleDelete(employee.employeeNo)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <br/>
            <br/>
            <br/>
            <br/>
            <b/>
            <br/>
            <br/>
            <br/>
            <br/>
            <b/>
            <b/>
            <br/>
            <br/>
            <br/>
            <br/>
            <b/>
            {showAddEmployee && (
                <AddEmployee 
                    refreshEmployees={refreshEmployees} 
                    employeeNo={selectedEmployeeNo} 
                    toggleForm={() => setShowAddEmployee(false)} // Add this prop to toggle visibility
                />
            )}
        </div>
    );
};

export default Employee;



