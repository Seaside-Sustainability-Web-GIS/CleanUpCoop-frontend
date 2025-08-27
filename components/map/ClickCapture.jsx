import { useMapEvents } from 'react-leaflet';
import useMapStore from "../../src/store/useMapStore.js";
import useUIStore from "../../src/store/useUIStore.js";
import { reverseGeocode } from '../../src/utils/reverseGeocode.js';

function ClickCapture() {
    const isSelecting = useMapStore((s) => s.isSelecting);
    const setIsSelecting = useMapStore((s) => s.setIsSelecting);
    const hideSnackbar = useUIStore((s) => s.hideSnackbar);
    const selectTarget = useMapStore((s) => s.selectTarget);

    useMapEvents({
        async click(e) {
            if (!isSelecting || !selectTarget) return;

            const { lat, lng } = e.latlng;
            setIsSelecting(false);
            hideSnackbar();

            try {
                const info = await reverseGeocode(lat, lng);
                selectTarget(lat, lng, info);
            } catch (err) {
                console.error("Reverse geocode failed:", err);
                selectTarget(lat, lng, {});
            }
        }
    });

    return null;
}

export default ClickCapture;
