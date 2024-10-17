import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddEmployee.css';

const AddEmployee = ({ refreshEmployees, employeeNo, toggleForm }) => {
    const [initialEmployeeData, setInitialEmployeeData] = useState(null);
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [salutation, setSalutation] = useState('');
    const [profileColor, setProfileColor] = useState('Default'); 
    const [grossSalary, setGrossSalary] = useState('');
    const [gender, setGender] = useState('');
    const [fullName, setFullName] = useState('');
   
    const [errorMessages, setErrorMessages] = useState({
        firstName: '',
        lastName: '',
        employeeNumber: '',
    });

    useEffect(() => {
        const fetchEmployee = async () => {
            if (employeeNo) {
                try {
                    const response = await axios.get(`http://localhost:3001/getEmployee/${employeeNo}`);
                    const employee = response.data;

                    if (employee) {
                        setInitialEmployeeData(employee); 
                        setEmployeeNumber(employee.employeeNo);
                        setFirstName(employee.firstName);
                        setLastName(employee.lastName);
                        setSalutation(employee.salutation);
                        setProfileColor(employee.profileColor);
                        setGrossSalary(employee.grossSalary);
                        setGender(employee.gender);
                    } else {
                        alert('Employee not found.');
                    }
                } catch (error) {
                    console.error('Error fetching employee details:', error);
                    alert('Error fetching employee details.');
                }
            } else {
               
                resetForm();
            }
        };
        fetchEmployee();
    }, [employeeNo]);

    const resetForm = () => {
        setEmployeeNumber('');
        setFirstName('');
        setLastName('');
        setSalutation('');
        setProfileColor('Default'); 
        setGrossSalary('');
        setGender('');
    };

    useEffect(() => {
        setFullName(`${firstName} ${lastName}`);
    }, [firstName, lastName]);

    // Update gender based on salutation
    useEffect(() => {
        switch (salutation) {
            case 'Mr':
                setGender('Male');
                break;
            case 'Mrs':
            case 'Ms':
                setGender('Female');
                break;
            case 'Mx':
                setGender('Other');
                break;
            case 'Dr':
            default:
                setGender(''); 
                break;
        }
    }, [salutation]);

    const formatGrossSalary = (value) => {
        const numericValue = value.replace(/\D/g, '');
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const handleGrossSalaryChange = (e) => {
        const formattedValue = formatGrossSalary(e.target.value);
        setGrossSalary(formattedValue);
    };

    // Validation function
    const validateFields = () => {
        const errors = { firstName: '', lastName: '', employeeNumber: '' };

        if (!/^[a-zA-Z]+$/.test(firstName)) {
            errors.firstName = 'First name must be alphabetic.';
        }
        
        if (!/^[a-zA-Z]+$/.test(lastName)) {
            errors.lastName = 'Last name must be alphabetic.';
        }
        
        if (!/^\d+$/.test(employeeNumber)) {
            errors.employeeNumber = 'Employee number must be numeric.';
        }

        setErrorMessages(errors);
        return Object.values(errors).every(error => error === '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateFields()) {
            return; 
        }
    
        try {
            const method = employeeNo ? 'put' : 'post';
            const url = employeeNo 
                ? `http://localhost:3001/updateEmployee/${employeeNo}` 
                : 'http://localhost:3001/addEmployee';
    
            const response = await axios[method](url, {
                employeeNo: employeeNumber,
                firstName,
                lastName,
                salutation,
                profileColor,
                grossSalary: grossSalary.replace(/ /g, ''),
                gender,
            });
    
            alert('Employee saved successfully!');
            refreshEmployees();
            toggleForm();
        } catch (error) {
            console.error('Error saving employee:', error);
            alert(`Error saving employee: ${error.response?.data?.message || error.message}`);
        }
    };
    
    
    const handleCancel = () => {
        // Reset to initial employee data if available
        if (initialEmployeeData) {
            setEmployeeNumber(initialEmployeeData.employeeNo);
            setFirstName(initialEmployeeData.firstName);
            setLastName(initialEmployeeData.lastName);
            setSalutation(initialEmployeeData.salutation);
            setProfileColor(initialEmployeeData.profileColor);
            setGrossSalary(initialEmployeeData.grossSalary);
            setGender(initialEmployeeData.gender);
        } else {
            resetForm();
        }
        setErrorMessages({
            firstName: '',
            lastName: '',
            employeeNumber: '',
        });
    };

    return (
        <div className="form-container">
            <h2>{employeeNo ? 'Employee Information' : 'Employee Information'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="button-group">
                    <button 
                        type="submit" 
                        style={{ backgroundColor: profileColor === 'Default' ? 'gray' : profileColor }}
                    >
                        Save
                    </button>
                    <button type="button" onClick={handleCancel} style={{ marginLeft: '10px' }}>
                        Cancel
                    </button>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>First Name(s)*  </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        {errorMessages.firstName && <div style={{ color: 'red' }}>{errorMessages.firstName}</div>}
                    </div>
                    <div className="form-field">
                        <label>Full Name  </label>
                        <input type="text" value={fullName} disabled />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Last Name* </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        {errorMessages.lastName && <div style={{ color: 'red' }}>{errorMessages.lastName}</div>}
                    </div>
                    <div className="form-field">
                        <label>Gross Salary $PY </label>
                        <input
                            type="text"
                            value={grossSalary}
                            onChange={handleGrossSalaryChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Salutation* </label>
                        <select
                            value={salutation}
                            onChange={(e) => setSalutation(e.target.value)}
                            required
                        >
                            <option value="">Select Salutation</option>
                            <option value="Dr">Dr</option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Mx">Mx</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Employee Profile Colour </label>
                        {['Green', 'Blue', 'Red', 'Default'].map(color => (
                            <label key={color}>
                                <input
                                    type="radio"
                                    value={color}
                                    checked={profileColor === color}
                                    onChange={() => setProfileColor(color)}
                                    required
                                />
                                {color}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Gender* </label>
                        {['Male', 'Female', 'Other'].map(genderOption => (
                            <label key={genderOption}>
                                <input
                                    type="radio"
                                    value={genderOption}
                                    checked={gender === genderOption}
                                    onChange={() => setGender(genderOption)}
                                    required
                                />
                                {genderOption}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-field">
                        <label>Employee #* </label>
                        <input
                            type="text"
                            value={employeeNumber}
                            onChange={(e) => setEmployeeNumber(e.target.value)}
                            required
                        />
                        {errorMessages.employeeNumber && <div style={{ color: 'red' }}>{errorMessages.employeeNumber}</div>}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddEmployee;
