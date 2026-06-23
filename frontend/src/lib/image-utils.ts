/**
 * Nettoie et normalise une URL d'image produit.
 * Gère les URLs Unsplash, les chemins locaux et les fallbacks.
 */
export function getProductImageUrl(url?: string | null): string {
  if (!url) return '/shopping-cart.png';
  
  // Si c'est une URL Unsplash avec des paramètres, les nettoyer pour compatibilité Vercel
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      // On garde seulement le chemin, sans les query params qui bloquent l'optimizer
      // et on ajoute les params recommandés par Unsplash pour les CDN
      return `${parsed.origin}${parsed.pathname}?auto=format&fit=crop&w=800&q=80`;
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Retourne une URL d'avatar par défaut si celle fournie est vide ou invalide.
 */
export function getAvatarUrl(url?: string | null, name?: string): string {
  if (url && url.startsWith('http')) return url;
  const displayName = name || 'Vendeur';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=E67E22&color=fff&size=64&bold=true`;
}
