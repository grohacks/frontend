import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import StudentList from './components/StudentList';
import FacultyList from './components/FacultyList';

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        School Management
                    </Typography>
                    <Button color="inherit" component={Link} to="/students">Students</Button>
                    <Button color="inherit" component={Link} to="/faculty">Faculty</Button>
                </Toolbar>
            </AppBar>
            <Container style={{ marginTop: '20px' }}>
                <Routes>
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/faculty" element={<FacultyList />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
