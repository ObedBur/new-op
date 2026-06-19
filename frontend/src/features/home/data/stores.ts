
import { Store } from '../types';

export const FEATURED_STORES: Store[] = [
  { 
    id: 1, 
    name: "Kivu Tech Pro", 
    category: "High-Tech", 
    location: "Centre-Ville", 
    rating: 4.9, 
    reviews: 120, 
    verified: true, 
    avatar: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=200",
    previews: [
      { image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300" },
      { image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=200" },
      { image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200" }
    ]
  },
  { 
    id: 2, 
    name: "Quincaillerie Alpha", 
    category: "Construction", 
    location: "Birere", 
    rating: 4.7, 
    reviews: 85, 
    verified: true, 
    avatar: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=200",
    previews: [
      { image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300" },
      { image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=200" },
      { image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=200" }
    ]
  },
  { 
    id: 3, 
    name: "Ets Maman Sifa", 
    category: "Alimentation", 
    location: "Virunga", 
    rating: 4.8, 
    reviews: 210, 
    verified: true, 
    avatar: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=200",
    previews: [
      { image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=300" },
      { image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=200" },
      { image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=200" }
    ]
  },
  { 
    id: 4, 
    name: "Style Goma 243", 
    category: "Mode", 
    location: "Katindo", 
    rating: 4.6, 
    reviews: 42, 
    verified: false, 
    avatar: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=200",
    previews: [
      { image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=300" },
      { image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200" },
      { image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200" }
    ]
  },
];
