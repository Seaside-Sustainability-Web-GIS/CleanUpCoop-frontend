import { useMapEvents } from 'react-leaflet';
import useStore from '../../src/store/useStore';
import { reverseGeocode } from '../../src/utils/reverseGeocode.js';

function ClickCapture() {
    const isSelecting = useStore((s) => s.isSelecting);
    const setIsSelecting = useStore((s) => s.setIsSelecting);
    const hideSnackbar = useStore((s) => s.hideSnackbar);
    const selectTarget = useStore((s) => s.selectTarget);

    useMapEvents({
        async click(e) {
            if (!isSelecting || !selectTarget) return;

            const { lat, lng } = e.latlng;
            setIsSelecting(false);
            hideSnackbar();

            try {
                const info = await reverseGeocode(lat, lng);
                selectTarget(lat, lng, info);
                console.log('📍 ClickCapture firing selectTarget:', lat, lng, info);
            } catch (err) {
                console.error("Reverse geocode failed:", err);
                selectTarget(lat, lng, {});
            }
        }
    });

    return null;
}

export default ClickCapture;
