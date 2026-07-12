// Mock coordinates for cities in the region
const cityCoordinates: Record<string, {lat: number, lng: number}> = {
  'Goma': { lat: -1.6705, lng: 29.2285 },
  'Bukavu': { lat: -2.5083, lng: 28.8608 },
  'Kigali': { lat: -1.9441, lng: 30.0619 },
  'Kinshasa': { lat: -4.4419, lng: 15.2663 },
  'Lubumbashi': { lat: -11.6609, lng: 27.4794 },
};

export const getMockCoordinates = (city: string | null | undefined, index: number = 0) => {
  if (!city) return { lat: -1.6705 + (index * 0.005), lng: 29.2285 + (index * 0.005) };
  
  // Try to find an exact match
  const match = Object.entries(cityCoordinates).find(([key]) => city.toLowerCase().includes(key.toLowerCase()));
  
  if (match) {
    // Add some random scatter so markers don't overlap exactly
    const scatterLat = (Math.random() - 0.5) * 0.05;
    const scatterLng = (Math.random() - 0.5) * 0.05;
    return {
      lat: match[1].lat + scatterLat,
      lng: match[1].lng + scatterLng
    };
  }
  
  // Default to Goma with some scatter if city not found
  const scatterLat = (Math.random() - 0.5) * 0.05;
  const scatterLng = (Math.random() - 0.5) * 0.05;
  return { lat: -1.6705 + scatterLat, lng: 29.2285 + scatterLng };
};
