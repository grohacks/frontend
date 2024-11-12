import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Typography,
    Grid,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import { styled } from '@mui/system';

const AnimatedCard = styled(Card)(({ theme }) => ({
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

function StudentList() {
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({ name: '', age: '', grade: '' });
    const [editingStudent, setEditingStudent] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/students')
            .then(response => setStudents(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingStudent) {
            axios.put(`http://localhost:5000/api/students/${editingStudent._id}`, form)
                .then(response => {
                    setStudents(students.map(student => student._id === editingStudent._id ? response.data : student));
                    setEditingStudent(null);
                })
                .catch(error => console.error(error));
        } else {
            axios.post('http://localhost:5000/api/students', form)
                .then(response => setStudents([...students, response.data]))
                .catch(error => console.error(error));
        }
        setForm({ name: '', age: '', grade: '' });
        handleClose();
    };

    const handleEdit = (student) => {
        setForm(student);
        setEditingStudent(student);
        setOpen(true);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/students/${id}`)
            .then(() => setStudents(students.filter(student => student._id !== id)))
            .catch(error => console.error(error));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm({ name: '', age: '', grade: '' });
        setEditingStudent(null);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Students</Typography>
            <Grid container spacing={4}>
                {students.map(student => (
                    <Grid item xs={12} sm={6} md={4} key={student._id}>
                        <AnimatedCard>
                            <CardContent>
                                <Typography variant="h5">{student.name}</Typography>
                                <Typography color="textSecondary">Age: {student.age}</Typography>
                                <Typography color="textSecondary">Grade: {student.grade}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => handleEdit(student)}>Edit</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(student._id)}>Delete</Button>
                            </CardActions>
                        </AnimatedCard>
                    </Grid>
                ))}
            </Grid>
            <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: '20px' }}>Add Student</Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
                <DialogContent>
                    <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Age" name="age" type="number" value={form.age} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Grade" name="grade" value={form.grade} onChange={handleChange} fullWidth margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">{editingStudent ? 'Update' : 'Add'}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default StudentList;