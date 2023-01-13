"use client"
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import LocationSearch from '../components/location-search';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import ChangeView from '../components/change-view';

function Home() {
    const [position, setPosition] = useState([51.505, -0.09] as [number, number]);
    const [markers, setMarkers] = useState([] as { name: string, position: [number, number] }[]);
    const addNewMarker = (data: { name: string, coordinates: string }) => {
        const [lat, lng] = data.coordinates.split(',').map(val => parseFloat(val));
        setMarkers([{ name: data.name, position: [lat, lng] }]);
        setPosition([lng, lat]);
    }

    return (
        <section className='relative flex flex-col gap-3 h-screen'>
            <div className="absolute h-full w-full top-0 bg-blue-300 opacity-50 z-10 pointer-events-none"></div>
            <div className="absolute top-0 w-full h-full">
                <MapContainer center={position} zoom={13} scrollWheelZoom={true} >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers.map(val =>
                        <Marker key={Math.random()} position={{ lng: val.position[0], lat: val.position[1] }} icon={new Icon({ iconUrl: 'http://localhost:3000/placeholder.png', iconSize: [30, 30] })}>
                            <Popup>
                                {val.name}
                            </Popup>
                        </Marker>
                    )}
                    <ChangeView center={position} />
                </MapContainer>
            </div>
            <div className="p-3 z-10">
                <h3 className='font-bold text-2xl ml-10'>Discover Restaurants <br className='md:hidden' /> in your City</h3>
                <LocationSearch onMarkerSelect={addNewMarker} />
            </div>

        </section>
    )
}

export default Home