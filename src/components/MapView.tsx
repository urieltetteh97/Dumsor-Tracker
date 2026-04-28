/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { format } from 'date-fns';

// Fix for default marker icons in Leaflet + React
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Report {
  id: string;
  location: string;
  region: string;
  type?: 'OUTAGE' | 'UNEXPECTED_ON';
  description: string;
  timestamp: any;
  coordinates: { lat: number, lng: number };
}

export default function MapView() {
  const [reports, setReports] = useState<Report[]>([]);
  const center: [number, number] = [7.9465, -1.0232]; // Center of Ghana

  const outageIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const onIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  useEffect(() => {
    const path = 'reports';
    const q = query(collection(db, path), orderBy('timestamp', 'desc'), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Report[];
      setReports(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full h-full">
      <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            icon={report.type === 'UNEXPECTED_ON' ? onIcon : outageIcon}
            position={[
              report.coordinates?.lat || 5.6037, 
              report.coordinates?.lng || -0.1870
            ]}
          >
            <Popup>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${report.type === 'UNEXPECTED_ON' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <p className="font-bold text-neutral-900">{report.location}</p>
                </div>
                <p className="text-xs text-neutral-500 mb-2">{report.region}</p>
                <p className="text-sm text-neutral-700">{report.description}</p>
                <p className="text-[10px] text-neutral-400 mt-2 italic">
                  {report.timestamp?.toDate() ? format(report.timestamp.toDate(), "MMM d, h:mm a") : 'Just now'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
