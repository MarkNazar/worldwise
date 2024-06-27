import styles from "./Map.module.css";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useEffect, useState } from "react";
import { useCitiesContext } from "../hooks/useCitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";

import Button from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";

const flagemojiToPNG = (flag) => {
  var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join("");
  return (
    <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
  );
};

function Map() {
  const { lat, lng } = useUrlPosition();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCitiesContext();
  const navigate = useNavigate();
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  useEffect(() => {
    if (lat && lng) {
      setMapPosition([parseFloat(lat), parseFloat(lng)]);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Locate Me"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities &&
          cities.map((city) => {
            const cityPosition = [city.position.lat, city.position.lng];
            return (
              <Marker
                key={city.id}
                position={cityPosition ? cityPosition : mapPosition}
              >
                <Popup>
                  <span>{flagemojiToPNG(city.emoji)}</span>
                  <span>{city.cityName}</span>
                </Popup>
              </Marker>
            );
          })}
        <ChangeCenter position={lat && lng ? [lat, lng] : mapPosition} />
        <MapClick />
      </MapContainer>
    </div>
  );

  function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
    return null;
  }

  function MapClick() {
    useMapEvents({
      click: (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        navigate(`form?lat=${lat}&lng=${lng}`);
      },
    });
    return null;
  }
}

export default Map;
