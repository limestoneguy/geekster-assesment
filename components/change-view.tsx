import { LatLngExpression } from 'leaflet';
import { useMap } from 'react-leaflet';

function ChangeView(data: { center: LatLngExpression }) {
    const map = useMap();
    map.setView(data.center);
    return (
        null
    )
}

export default ChangeView