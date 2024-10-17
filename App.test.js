import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// app.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Your Express setup
app.use(cors());
app.use(express.json());

// Connect to MongoDB in memory for testing
beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/EmployeesDB';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Your Mongoose schema and model
const userSchema = new mongoose.Schema({
    employeeNo: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    salutation: { type: String, required: true },
    profileColor: { type: String, required: true },
    grossSalary: { type: Number, required: true },
    gender: { type: String, required: true },
});
const userModel = mongoose.model("Employees", userSchema, "Employees");

// Your routes
app.get("/getEmployees", async (req, res) => {
    try {
        const employees = await userModel.find({});
        res.json(employees);
    } catch (err) {
        res.status(500).send(err);
    }
});

// More routes...

// Tests
describe('Employee API', () => {
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Test for getting employees
    test('GET /getEmployees should return an array of employees', async () => {
        const response = await request(app).get('/getEmployees');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test for adding an employee
    test('POST /addEmployee should create a new employee', async () => {
        const newEmployee = {
            employeeNo: '003',
            firstName: 'Alice',
            lastName: 'Johnson',
            salutation: 'Ms.',
            profileColor: 'pink',
            grossSalary: 60000,
            gender: 'Female'
        };

        const response = await request(app).post('/addEmployee').send(newEmployee);
        expect(response.statusCode).toBe(201);
        expect(response.body.firstName).toBe(newEmployee.firstName);
    });
});

