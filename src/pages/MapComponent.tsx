import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

// Definimos la forma de los datos del hospital
interface Hospital {
  name: string;
  address: string;
  location: google.maps.LatLngLiteral;
}

// Definimos los props del componente
interface MapComponentProps {
  className?: string; // Añadimos una prop opcional para evitar la interface vacía
}

// Definimos las librerías fuera del componente para evitar que se creen de nuevo en cada renderizado.
const libraries: ("places")[] = ['places'];

const MapComponent: React.FC<MapComponentProps> = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  // Cambiamos a un array para almacenar múltiples hospitales
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cargamos el script de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY,
    libraries,
    language: 'es', // Establecemos el idioma a español
    region: 'BO', // Establecemos la región a Bolivia para resultados más relevantes localmente
  });

  const mapContainerStyle = {
    width: '100%',
    height: '250px',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border:'none',
  };

  const defaultCenter = {
    lat: -17.7833, // Por defecto a Santa Cruz de la Sierra, Bolivia
    lng: -63.1812,
  };

  // Opciones del mapa memoizadas
  const mapOptions = useMemo(() => ({
    mapId: 'YOUR_MAP_ID', // *** IMPORTANTE: Reemplaza con tu ID de mapa real ***
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
  }), []);


  // Callback para cuando el mapa se carga
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Callback para cuando el mapa se descarga
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Obtenemos la ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          /* console.log('Ubicación del usuario obtenida:', position.coords); */
        },
        (err) => {
          let errorMessage = "Error desconocido al obtener la ubicación.";
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "Permiso de geolocalización denegado por el usuario. Por favor, habilítalo en la configuración de tu navegador.";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Información de ubicación no disponible. Intenta de nuevo más tarde.";
              break;
            case err.TIMEOUT:
              errorMessage = "Tiempo de espera agotado al obtener la ubicación. La conexión podría ser lenta.";
              break;
            default:
              errorMessage = `Error al obtener la ubicación del usuario: ${err.message}`;
          }
          setError(errorMessage);
          console.error("Error al obtener la ubicación del usuario:", err);
        }
      );
    } else {
      setError("La geolocalización no es compatible con su navegador. No se puede obtener la ubicación.");
      console.warn("Geolocalización no soportada.");
    }
  }, []);

  // Buscamos los hospitales cercanos una vez que la ubicación del usuario esté disponible y el mapa cargado
  useEffect(() => {
    if (!isLoaded || loadError || !userLocation) { // Aseguramos que userLocation esté disponible
      if (loadError) console.error("Error de carga del script de Google Maps:", loadError);
      return;
    }

    const timer = setTimeout(() => {
      if (!mapRef.current) {
        console.error("mapRef.current es nulo al intentar inicializar PlacesService.");
        return;
      }

      const service = new google.maps.places.PlacesService(mapRef.current);

      const request: google.maps.places.PlaceSearchRequest = {
        location: userLocation,
        radius: 4000, // 5 km en metros
        type: 'hospital',
        };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          const foundHospitals: Hospital[] = results.map(place => ({
            name: place.name || 'Hospital Desconocido',
            address: place.vicinity || 'Dirección Desconocida',
            location: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            },
          }));
          setNearbyHospitals(foundHospitals);
          setError(null);

          if (mapRef.current) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(userLocation); // Incluye la ubicación del usuario en los límites

            foundHospitals.forEach(hospital => {
              bounds.extend(hospital.location); // Incluye cada hospital en los límites
            });
            mapRef.current.fitBounds(bounds); // Ajusta el mapa para mostrar todos los marcadores
          }
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setError("No se encontraron hospitales en un radio de 6km de tu ubicación.");
          setNearbyHospitals([]); // Limpiamos los hospitales si no se encuentran
        } else {
          let serviceErrorMessage = `Error del servicio de Lugares: ${status}.`;
          if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            serviceErrorMessage += " Límite de consulta excedido. Verifica tu cuota de API.";
          } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
            serviceErrorMessage += " Solicitud denegada. Verifica las restricciones de tu API Key o la habilitación de la API de Places.";
          }
          setError(serviceErrorMessage);
          setNearbyHospitals([]); // Limpiamos los hospitales si hay un error
          console.error("Error del servicio de Lugares:", status, results);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoaded, loadError, userLocation]);

  if (loadError) return (
    <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
      Error al cargar los mapas: {loadError.message}. Por favor, verifica tu conexión a internet o la configuración de tu API Key.
    </div>
  );
  if (!isLoaded) return (
    <div className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
      <div className="animate-pulse">Cargando Mapas...</div>
    </div>
  );

  return (
    <div className="w-full">
      {error && (
        <div className="text-white bg-red-500 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {!userLocation && !error && (
        <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg text-center mb-4">
          <p className="text-cyan-800 font-medium">Esperando ubicación del usuario...</p>
          <p className="text-cyan-600 text-sm mt-1">Asegúrate de conceder permisos de geolocalización a tu navegador.</p>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden shadow-lg">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || defaultCenter}
          zoom={userLocation ? 14 : 10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {userLocation && (
            <MarkerF
              position={userLocation}
              title={'Tu Ubicación'}
            />
          )}
          {nearbyHospitals.map((hospital, index) => (
            <MarkerF
              key={index}
              position={hospital.location}
              title={hospital.name}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/hospitals.png',
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />
          ))}
        </GoogleMap>
      </div>

      {nearbyHospitals.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Se encontraron {nearbyHospitals.length} hospitales cercanos
        </div>
      )}
    </div>
  );
};

export default MapComponent;