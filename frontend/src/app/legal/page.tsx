export default function LegalPage() {
  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl">
      <h1 className="text-4xl font-display font-black mb-8 text-foreground">
        Mentions Légales & Cookies
      </h1>
      
      <div className="prose dark:prose-invert prose-slate">
        <h2 className="font-display font-bold text-xl mb-4">1. Utilisation des cookies</h2>
        <p className="text-foreground/80 mb-6">
          WapiBei utilise des cookies pour améliorer votre expérience utilisateur, 
          analyser notre trafic et personnaliser les contenus publicitaires. 
          En naviguant sur notre plateforme, vous consentez à cette utilisation.
        </p>

        <h2 className="font-display font-bold text-xl mb-4">2. Gestion de vos données</h2>
        <p className="text-foreground/80 mb-6">
          Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles 
          à tout moment en nous contactant via notre centre d'assistance.
        </p>
      </div>
    </div>
  );
}