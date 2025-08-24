import {useMap} from 'react-leaflet';
import {IconButton} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import useMapStore from "../../src/store/useMapStore.js";

function HomeButton() {
    const map = useMap();
    const defaultCenter = useMapStore((state) => state.defaultCenter);

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

export default HomeButton;
