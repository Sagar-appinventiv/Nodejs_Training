const express = require('express');
const Joi = require('joi');

const app = express();
app.use(express.json());

let employees = [];

const schema = Joi.object({
  empName: Joi.string().required(),
  empId: Joi.string().required(),
  empEmail: Joi.string().email().required(),
  password: Joi.string().required()
});

app.get('/employees', (req, res) => {
  res.json({ status: 'success', data: employees });
});

app.post('/employees', (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ status: 'error'});
  } else {
    employees.push(value);
    res.status(201).json({ status: 'success', message: 'Employee created successfully' });
  }
});

app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ statusCode: 400, status: 'error'});
    console.log(error);
  } else {
    const index = employees.findIndex(i => i.empId == id);
    if (index >= 0) {
        employees[index] = value;
        res.json({ status: 'success', message: 'Employee updated successfully' });
    } else {
        res.status(404).json({ status: 'error', message: 'Employee not found' });
    }
  }
});

app.patch('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ statusCode: 400, status: 'error'});
    console.log(error);
  } else {
    const index = employees.findIndex(i => i.empId == id);
    if (index >= 0) {
        employees[index] = value;
        res.json({ status: 'success', message: 'Employee updated successfully' });
    } else {
        res.status(404).json({ statusCode: 404, status: 'error', message: 'Employee not found' });
    }
  }
});

app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  const index = employees.findIndex(i => i.empId == id);
  if (index >= 0) {
    employees.splice(index, 1);
    res.json({ status: 'success', message: 'Employee deleted successfully' });
  } else {
    res.status(404).json({ statusCode: 404, status: 'error', message: 'Employee not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
