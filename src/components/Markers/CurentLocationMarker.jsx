import {  Marker } from "@react-google-maps/api"

export const CurrenLocationMarker = ({position}) =>{
    return <Marker scale position={position} icon={{url: '/Marker.svg', scaledSize: new window.google.maps.Size(30, 30),}} />
}