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

function FacultyList() {
    const [faculty, setFaculty] = useState([]);
    const [form, setForm] = useState({ name: '', department: '', experience: '' });
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/api/faculty')
            .then(response => setFaculty(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingFaculty) {
            axios.put(`http://localhost:5000/api/faculty/${editingFaculty._id}`, form)
                .then(response => {
                    setFaculty(faculty.map(member => member._id === editingFaculty._id ? response.data : member));
                    setEditingFaculty(null);
                })
                .catch(error => console.error(error));
        } else {
            axios.post('http://localhost:5000/api/faculty', form)
                .then(response => setFaculty([...faculty, response.data]))
                .catch(error => console.error(error));
        }
        setForm({ name: '', department: '', experience: '' });
        handleClose();
    };

    const handleEdit = (member) => {
        setForm(member);
        setEditingFaculty(member);
        setOpen(true);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/faculty/${id}`)
            .then(() => setFaculty(faculty.filter(member => member._id !== id)))
            .catch(error => console.error(error));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm({ name: '', department: '', experience: '' });
        setEditingFaculty(null);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Faculty</Typography>
            <Grid container spacing={4}>
                {faculty.map(member => (
                    <Grid item xs={12} sm={6} md={4} key={member._id}>
                        <AnimatedCard>
                            <CardContent>
                                <Typography variant="h5">{member.name}</Typography>
                                <Typography color="textSecondary">Department: {member.department}</Typography>
                                <Typography color="textSecondary">Experience: {member.experience} years</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => handleEdit(member)}>Edit</Button>
                                <Button size="small" color="secondary" onClick={() => handleDelete(member._id)}>Delete</Button>
                            </CardActions>
                        </AnimatedCard>
                    </Grid>
                ))}
            </Grid>
            <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: '20px' }}>Add Faculty</Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editingFaculty ? 'Edit Faculty' : 'Add Faculty'}</DialogTitle>
                <DialogContent>
                    <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Department" name="department" value={form.department} onChange={handleChange} fullWidth margin="normal" />
                    <TextField label="Experience" name="experience" type="number" value={form.experience} onChange={handleChange} fullWidth margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">{editingFaculty ? 'Update' : 'Add'}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default FacultyList;
