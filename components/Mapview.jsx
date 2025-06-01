// Refactored MapView.jsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../src/App.css';
import { Box, Button } from '@mui/material';
import useStore from '../src/store/useStore';
import { useAuthStore } from "../src/store/useAuthStore.js";
import CollapsibleTable from './CollapsableTable.jsx';
import MapCursorManager from './/map/MapCursorManager.jsx'
import ClickCapture from './/map/ClickCapture.jsx';
import HomeButton from './/map/HomeButton.jsx';
import GpsButton from './/map/GpsButton.jsx';

const apiEndpoint = 'https://seaside-backend-oh06.onrender.com/api';
const gpsLocationIcon = L.divIcon({
    className: 'gps-location-icon',
    iconSize: [16, 16],
    html: `<div class="gps-marker"></div>`,
});

function BoundsUpdater() {
    const map = useMap();
    const bounds = useStore(state => state.bounds);

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [map, bounds]);

    return null;
}

function MapUpdater() {
    const map = useMap();
    const mapCenter = useStore((state) => state.mapCenter);

    useEffect(() => {
        if (mapCenter) {
            map.setView(mapCenter);
        }
    }, [mapCenter]);

    return null;
}

function MapView() {
    const { BaseLayer } = LayersControl;
    const mapCenter = useStore((state) => state.mapCenter);
    const userLocation = useStore((state) => state.userLocation);
    const isDataLoaded = useStore((state) => state.isDataLoaded);
    const adoptedAreas = useStore((state) => state.adoptedAreas);
    const setAdoptedAreas = useStore((state) => state.setAdoptedAreas);
    const showSnackbar = useStore((state) => state.showSnackbar);
    const sessionToken = useAuthStore.getState().sessionToken;
    const user = useAuthStore.getState().user;

    const fetchAdoptedAreas = async () => {
        try {
            const res = await fetch(`${apiEndpoint}/adopted-area-layer/`);
            const data = await res.json();
            setAdoptedAreas(data);
        } catch (err) {
            console.error("Failed to fetch adopted areas:", err);
        }
    };

    const handleEdit = async (area, updatedAreaData) => {
        const response = await fetch(`${apiEndpoint}/adopt-area/${area.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Token': sessionToken,
            },
            body: JSON.stringify(updatedAreaData),
        });

        const result = await response.json();
        showSnackbar(result.message, result.success ? 'success' : 'error');
        await fetchAdoptedAreas();
    };

    const handleDelete = async (area) => {
        if (!window.confirm('Are you sure you want to delete this area?')) return;

        const response = await fetch(`${apiEndpoint}/adopt-area/${area.id}/`, {
            method: 'DELETE',
            headers: {
                'X-Session-Token': sessionToken,
            },
        });
        const result = await response.json();
        showSnackbar(result.message, result.success ? 'success' : 'error');
        await fetchAdoptedAreas();
    };

    useEffect(() => {
        fetchAdoptedAreas();
    }, []);

    return (
        <Box sx={{ flex: 1, position: 'relative' }}>
            <MapContainer center={mapCenter} zoom={3} style={{ height: '100vh', width: '100%' }}>
                <MapCursorManager />
                <ClickCapture />
                <HomeButton />
                <GpsButton />
                <MapUpdater />
                <BoundsUpdater />

                {userLocation && (
                    <Marker key={userLocation.toString()} position={userLocation} icon={gpsLocationIcon} />
                )}

                <LayersControl style={{ top: '20px', position: 'absolute', zIndex: 1001 }}>
                    <BaseLayer checked name="OpenStreetMap">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                    </BaseLayer>
                    <BaseLayer name="OpenTopoMap">
                        <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution="&copy; OpenTopoMap contributors" />
                    </BaseLayer>
                    <BaseLayer name="ESRI World Imagery">
                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="&copy; ESRI" />
                    </BaseLayer>
                </LayersControl>

                {adoptedAreas.map(area => {
                    const coords = area.location?.coordinates;
                    if (!Array.isArray(coords) || coords.length !== 2) return null;

                    const [lng, lat] = coords;
                    if (typeof lat !== 'number' || typeof lng !== 'number') return null;

                    return (
                        <Marker key={area.id} position={[lat, lng]}>
                            <Popup>
                                <div style={{ fontSize: '12px', lineHeight: '1.1' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{area.area_name}</div>
                                    <div>{area.adoptee_name}</div>
                                    <div>{area.city}, {area.state}, {area.country}</div>
                                    <div>{area.note}</div>
                                    {user?.email === area.email && (
                                        <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            <Button size="small" variant="outlined" onClick={() => console.log('create event')}>
                                                Create Event
                                            </Button>
                                            <Button size="small" variant="outlined" onClick={() => handleEdit(area)}>
                                                Edit Area
                                            </Button>
                                            <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(area)}>
                                                Delete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
            {isDataLoaded && <CollapsibleTable />}
        </Box>
    );
}

export default MapView;
