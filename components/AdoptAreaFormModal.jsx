import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem} from '@mui/material';
import {useState, useEffect} from 'react';
import {useAuthStore} from '../src/store/useAuthStore';
import useUIStore from '../src/store/useUIStore.js';
import useMapStore from '../src/store/useMapStore.js';
import useAdoptedAreasStore from '../src/store/useAdoptedAreasStore.js';
import PropTypes from 'prop-types';


function AdoptAreaFormModal({open, onClose, selectedPoint}) {
    const [formData, setFormData] = useState({
        "area_name": "",
        "adoptee_name": "",
        "adoption_type": "indefinite",
        "end_date": "",
        "email": "",
        "city": "",
        "state": "",
        "country": "",
        "note": "",
        "location": {
            "type": "Point",
            "coordinates": ["", ""]
        }
    });

    const locationMetadata = useMapStore((state) => state.locationMetadata);
    const {createAdoptedArea} = useAdoptedAreasStore();
    const showSnackbar = useUIStore((state) => state.showSnackbar);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (selectedPoint && locationMetadata && user) {
            let lng
            let lat

            if (typeof selectedPoint === "object" && !Array.isArray(selectedPoint)) {
                // Object case: { lng, lat }
                if (Number.isFinite(selectedPoint.lng)) {
                    lng = selectedPoint.lng;
                }
                if (Number.isFinite(selectedPoint.lat)) {
                    lat = selectedPoint.lat;
                }
            } else if (Array.isArray(selectedPoint)) {
                // Array case: [lng, lat]
                if (Number.isFinite(selectedPoint[0])) {
                    lng = selectedPoint[0];
                }
                if (Number.isFinite(selectedPoint[1])) {
                    lat = selectedPoint[1];
                }
            }

            // Only update if both are valid numbers
            if (lng !== undefined && lat !== undefined) {
                setFormData((prev) => ({
                    ...prev,
                    email: user.email,
                    city: locationMetadata.city || "",
                    state: locationMetadata.state || "",
                    country: locationMetadata.country || "",
                    location: {
                        ...prev.location,
                        coordinates: [
                            parseFloat(lng.toFixed(6)),
                            parseFloat(lat.toFixed(6)),
                        ],
                    },
                }));
            }
        }
    }, [selectedPoint, locationMetadata, user]);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'adoption_type' && value === 'indefinite'
                ? {end_date: ''}
                : {})
        }));
    };

    const handleSubmit = async () => {
        try {
            const coords = formData.location?.coordinates;
            if (
                !coords ||
                coords.length !== 2 ||
                !Number.isFinite(coords[0]) ||
                !Number.isFinite(coords[1])
            ) {
                showSnackbar('Please choose a point on the map first.', 'error');
                return;
            }

            if (formData.adoption_type === 'temporary' && !formData.end_date) {
                showSnackbar('Please select an end date for a temporary adoption.', 'error');
                return;
            }
            const payload = {
                ...formData,
                end_date: formData.adoption_type === 'indefinite' ? null : formData.end_date,
                location: {
                    type: "Point",
                    coordinates: [coords[0], coords[1]],
                },
            };

            const result = await createAdoptedArea(payload);

            if (result.success) {
                showSnackbar('Area adopted successfully!', 'success');
                onClose();
            } else {
                showSnackbar(`Error: ${result.error || 'Failed to save area.'}`, 'error');
            }
        } catch (err) {
            console.error('Adoption error:', err);
            showSnackbar(`Error: ${err.message}`, 'error');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Adopt this Area</DialogTitle>
            <DialogContent>
                <TextField
                    name="area_name"
                    label="Area Name"
                    fullWidth
                    margin="dense"
                    value={formData.area_name}
                    onChange={handleChange}
                />

                <TextField
                    name="adoptee_name"
                    label="Adoptee Name"
                    fullWidth
                    margin="dense"
                    value={formData.adoptee_name}
                    onChange={handleChange}
                />

                <TextField
                    select
                    name="adoption_type"
                    label="Adoption Type"
                    fullWidth
                    margin="dense"
                    value={formData.adoption_type}
                    onChange={handleChange}
                >
                    <MenuItem value="indefinite">Indefinite</MenuItem>
                    <MenuItem value="temporary">Temporary</MenuItem>
                </TextField>

                {formData.adoption_type === 'temporary' && (
                    <TextField
                        name="end_date"
                        label="End Date"
                        type="date"
                        fullWidth
                        margin="dense"
                        value={formData.end_date}
                        onChange={handleChange}
                        sx={{
                            '& input': {
                                padding: '16.5px 14px',
                            },
                            '& label': {
                                transform: 'translate(14px, -6px) scale(0.75)',
                            },
                        }}
                    />
                )}

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
                    value={formData?.city || ''}
                    disabled
                />
                <TextField
                    label="State"
                    fullWidth
                    margin="dense"
                    value={formData?.state || ''}
                    disabled
                />
                <TextField
                    label="Country"
                    fullWidth
                    margin="dense"
                    value={formData?.country || ''}
                    disabled
                />
                <TextField
                    name="lat"
                    label="Latitude"
                    fullWidth
                    margin="dense"
                    value={formData.location.coordinates[1] ?? ""}
                    disabled
                />
                <TextField
                    name="lng"
                    label="Longitude"
                    fullWidth
                    margin="dense"
                    value={formData.location.coordinates[0] ?? ""}
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

AdoptAreaFormModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    selectedPoint: PropTypes.arrayOf(PropTypes.number),
};

export default AdoptAreaFormModal;
