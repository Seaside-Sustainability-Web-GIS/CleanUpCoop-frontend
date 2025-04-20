import {useEffect} from 'react';
import {
    MapContainer,
    TileLayer,
    LayersControl,
    useMap,
    Marker,
    useMapEvents, Popup,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../src/App.css';
import {Box, Button, IconButton} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import useStore from '../src/store/useStore';
import CollapsibleTable from './CollapsableTable.jsx';
import {useAuthStore} from "../src/store/useAuthStore.js";

const apiEndpoint = 'https://seaside-backend-oh06.onrender.com/api';
const sessionToken = useAuthStore.getState().sessionToken;
const showSnackbar = useStore.getState().showSnackbar;

const gpsLocationIcon = L.divIcon({
    className: 'gps-location-icon',
    iconSize: [16, 16],
    html: `<div class="gps-marker"></div>`,
});

function BoundsUpdater() {
  const map = useMap()
  // grab your bounds from Zustand ([ [south, west], [north, east] ] or null)
  const bounds = useStore(state => state.bounds)

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds)
    }
  }, [map, bounds])

  return null
}

function ClickCapture() {
    const isSelecting = useStore((state) => state.isSelecting);
    const setSelectedPoint = useStore((state) => state.setSelectedPoint);
    const setIsSelecting = useStore((state) => state.setIsSelecting);
    const hideSnackbar = useStore((state) => state.hideSnackbar);
    const setLocationMetadata = useStore((state) => state.setLocationMetadata);

    useMapEvents({
        async click(e) {
            if (!isSelecting) return;

            const {lat, lng} = e.latlng;
            setSelectedPoint([lng, lat]);
            setIsSelecting(false);
            hideSnackbar();

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                );
                const data = await response.json();
                const {address} = data;

                const locationInfo = {
                    city: address.city || address.town || address.village || '',
                    state: address.state || '',
                    country: address.country || '',
                };

                setLocationMetadata(locationInfo);
            } catch (err) {
                console.error('Reverse geocode failed:', err);
            }
        },
    });

    return null;
}

function MapCursorManager() {
    const isSelecting = useStore((state) => state.isSelecting);

    useEffect(() => {
        const mapContainer = document.querySelector('.leaflet-container');
        if (!mapContainer) return;

        mapContainer.style.cursor = isSelecting ? 'crosshair' : '';

        return () => {
            if (mapContainer) {
                mapContainer.style.cursor = '';
            }
        };
    }, [isSelecting]);

    return null;
}

function HomeButton() {
    const map = useMap();
    const defaultCenter = useStore((state) => state.defaultCenter);

    const handleHomeClick = () => {
        map.setView(defaultCenter, 3);
    };

    return (
        <IconButton
            onClick={handleHomeClick}
            sx={{
                position: 'absolute',
                top: 85,
                left: 9,
                zIndex: 1000,
                width: '36px',
                height: '36px',
                padding: '4px',
                backgroundColor: 'white',
                border: 'grey 1px solid',
                '&:hover': {backgroundColor: '#f0f0f0'},
            }}
        >
            <HomeIcon/>
        </IconButton>
    );
}

function GpsButton() {
    const map = useMap();
    const setUserLocation = useStore((state) => state.setUserLocation);

    const handleGpsClick = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
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
                '&:hover': {backgroundColor: '#f0f0f0'},
            }}
        >
            <GpsFixedIcon/>
        </IconButton>
    );
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
    const {BaseLayer} = LayersControl;
    const mapCenter = useStore((state) => state.mapCenter);
    const userLocation = useStore((state) => state.userLocation);
    const isDataLoaded = useStore((state) => state.isDataLoaded);
    const adoptedAreas = useStore((state) => state.adoptedAreas);
    const setAdoptedAreas = useStore((state) => state.setAdoptedAreas);
    const user = useAuthStore.getState().user;
    const bounds = useStore((state) => state.bounds);


    const handleEdit = async (area) => {
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

    const fetchAdoptedAreas = async () => {
        try {
            const res = await fetch(`${apiEndpoint}/adopted-area-layer/`);
            const data = await res.json();
            setAdoptedAreas(data);
        } catch (err) {
            console.error("Failed to fetch adopted areas:", err);
        }
    };

    // ✅ Single useEffect
    useEffect(() => {
        fetchAdoptedAreas();
    }, []);


    return (
        <Box sx={{flex: 1, position: 'relative'}}>
            <MapContainer center={mapCenter} zoom={3} style={{ height: '100vh', width: '100%'}}>
                <MapCursorManager/>
                <HomeButton/>
                <GpsButton/>
                <MapUpdater/>
                <BoundsUpdater/>
                <ClickCapture/>
                {userLocation && (
                    <Marker key={userLocation.toString()} position={userLocation} icon={gpsLocationIcon}/>
                )}
                <LayersControl
                    style={{top: '20px', position: 'absolute', zIndex: 1001}}
                >
                    <BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                    </BaseLayer>
                    <BaseLayer name="OpenTopoMap">
                        <TileLayer
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenTopoMap contributors"
                        />
                    </BaseLayer>
                    <BaseLayer name="ESRI World Imagery">
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution="&copy; ESRI"
                        />
                    </BaseLayer>
                </LayersControl>
                {adoptedAreas.map(area => (
                    <Marker key={area.id} position={[area.lat, area.lng]}>
                        <Popup>
                            <div style={{fontSize: '12px', lineHeight: '1.1', margin: 0, padding: 0}}>
                                <div style={{fontWeight: 'bold', fontSize: '13px'}}>
                                    {area.area_name}
                                </div>
                                <div>{area.adoptee_name}</div>
                                <div>{area.city}, {area.state}, {area.country}</div>
                                <div>{area.note}</div>

                                {user?.email === area.email && (
                                    <div style={{marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap'}}>
                                        <Button size="small" variant="outlined"
                                                onClick={() => handleCreateEvent(area)}>
                                            Create Event
                                        </Button>
                                        <Button size="small" variant="outlined" onClick={() => handleEdit(area)}>
                                            Edit Area
                                        </Button>
                                        <Button size="small" variant="outlined" color="error"
                                                onClick={() => handleDelete(area)}>
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {isDataLoaded && <CollapsibleTable/>}
        </Box>
    );
}

export default MapView;
