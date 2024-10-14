const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const userRoute = require('./routes/userRoute');
const departmentRoute = require('./routes/departmentRoute');
const courseRoute = require('./routes/courseRoute');
const studentRoute = require('./routes/studentRoute');

const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

app.get('/', function(req, res){
    res.send("Phoebe Marie Vinas, STUDENT");
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoute);
app.use('/api/departments', departmentRoute);
app.use('/api/courses', courseRoute);
app.use('/api/students', studentRoute);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});