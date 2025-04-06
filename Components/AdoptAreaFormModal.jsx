import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button} from '@mui/material';
import {useState, useEffect} from 'react';
import useStore from '../src/store/useStore';
import {useAuthStore} from '../src/store/useAuthStore';


function AdoptAreaFormModal({open, onClose, onSubmit, selectedPoint}) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        note: '',
        lat: '',
        lng: '',
    });
    const locationMetadata = useStore((state) => state.locationMetadata);
    const user = useAuthStore((state) => state.user);
    console.log(user)

    useEffect(() => {
        if (selectedPoint) {
            setFormData((prev) => ({
                ...prev,
                lat: selectedPoint[1].toFixed(6),
                lng: selectedPoint[0].toFixed(6),
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
                    name="first_name"
                    label="First Name"
                    fullWidth
                    margin="dense"
                    value={formData.first_name}
                    onChange={handleChange}
                />

                <TextField
                    name="last_name"
                    label="Last Name"
                    fullWidth
                    margin="dense"
                    value={formData.last_name}
                    onChange={handleChange}
                />

                <TextField
                    label="Email Address"
                    fullWidth
                    margin="dense"
                    value={user?.email || ''}
                    disabled
                />
                <TextField
                    label="City"
                    fullWidth
                    margin="dense"
                    value={locationMetadata?.city || ''}
                    disabled
                />
                <TextField
                    label="State"
                    fullWidth
                    margin="dense"
                    value={locationMetadata?.state || ''}
                    disabled
                />
                <TextField
                    label="Country"
                    fullWidth
                    margin="dense"
                    value={locationMetadata?.country || ''}
                    disabled
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
