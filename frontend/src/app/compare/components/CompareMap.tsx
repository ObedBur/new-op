'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { CompareProduct } from '@/features/compare/compare.service';
import Link from 'next/link';
import { getMockCoordinates } from './utils'; // Helper we will create

interface CompareMapProps {
  products: CompareProduct[];
  bestPrice: number;
}

const CompareMap: React.FC<CompareMapProps> = ({ products, bestPrice }) => {
  const [center, setCenter] = useState<[number, number]>([-1.6705, 29.2285]); // Default Goma center

  useEffect(() => {
    const validProducts = products.filter(p => p.coordinates || getMockCoordinates(p.city));
    if (validProducts.length > 0) {
      const p = validProducts[0];
      const coords = p.coordinates || getMockCoordinates(p.city);
      if (coords) {
         setCenter([coords.lat, coords.lng]);
      }
    }
  }, [products]);

  // Leaflet needs window to be defined
  if (typeof window === 'undefined') return null;

  return (
    <div className="h-[400px] sm:h-[500px] w-full rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm relative z-0 mb-12">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {products.map((product, i) => {
          // If no coordinates provided, generate mock ones based on city
          const coords = product.coordinates || getMockCoordinates(product.city, i);
          if (!coords) return null;
          
          const isBest = product.price === bestPrice;
          const isClosed = product.isShopOpen === false;
          
          return (
            <Marker 
              key={product.id} 
              position={[coords.lat, coords.lng]}
            >
              <Popup className="rounded-xl border-none shadow-xl">
                <div className="p-1 min-w-[150px]">
                  <p className="font-bold text-[13px] mb-1 leading-tight">{product.user.boutiqueName || product.user.fullName}</p>
                  <p className="text-gray-500 text-[10px] mb-2">{product.name}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[#2D5A27] font-black text-lg">{product.displayPrice || `${product.price} $`}</p>
                    {isBest && <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">Le - cher</span>}
                  </div>
                  
                  {isClosed && <p className="text-red-500 text-[10px] font-bold mb-2">Boutique fermée</p>}
                  
                  <Link href={`/products/${product.id}`} className="block w-full text-center bg-[#2D5A27] hover:bg-[#1e3f1a] text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors">
                    Voir l'offre
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default CompareMap;
