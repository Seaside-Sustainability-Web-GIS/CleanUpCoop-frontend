import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button} from '@mui/material';
import {useState, useEffect} from 'react';

function AdoptAreaFormModal({open, onClose, onSubmit, selectedPoint}) {
    const [formData, setFormData] = useState({
        name: '',
        note: '',
        lat: '',
        lng: '',
    });

    useEffect(() => {
        if (selectedPoint) {
            setFormData((prev) => ({
                ...prev,
                lat: selectedPoint[0].toFixed(6),
                lng: selectedPoint[1].toFixed(6),
            }));
        }
    }, [selectedPoint]);

    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Adopt This Area</DialogTitle>
            <DialogContent>
                <TextField
                    name="name"
                    label="Your Name"
                    fullWidth
                    margin="dense"
                    value={formData.name}
                    onChange={handleChange}
                />
                <TextField
                    name="note"
                    label="Notes"
                    fullWidth
                    margin="dense"
                    multiline
                    rows={3}
                    value={formData.note}
                    onChange={handleChange}
                />
                <TextField
                    name="lat"
                    label="Latitude"
                    fullWidth
                    margin="dense"
                    value={formData.lat}
                    disabled
                />
                <TextField
                    name="lng"
                    label="Longitude"
                    fullWidth
                    margin="dense"
                    value={formData.lng}
                    disabled
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="success">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AdoptAreaFormModal;
