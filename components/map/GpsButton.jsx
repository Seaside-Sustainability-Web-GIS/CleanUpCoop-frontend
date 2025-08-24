import { useMap } from 'react-leaflet';
import { IconButton } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import useMapStore from "../../src/store/useMapStore.js";

function GpsButton() {
    const map = useMap();
    const setUserLocation = useMapStore((state) => state.setUserLocation);

    const handleGpsClick = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 14);
                    setUserLocation([latitude, longitude]);
                },
                (error) => {
                    console.error('Error fetching GPS location:', error);
                    alert('Unable to retrieve your location.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    return (
        <IconButton
            onClick={handleGpsClick}
            sx={{
                position: 'absolute',
                top: 130,
                left: 9,
                zIndex: 1000,
                width: '36px',
                height: '36px',
                padding: '4px',
                backgroundColor: 'white',
                border: 'grey 1px solid',
                '&:hover': { backgroundColor: '#f0f0f0' },
            }}
        >
            <GpsFixedIcon />
        </IconButton>
    );
}

export default GpsButton;
