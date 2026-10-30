/**
 * Mise en page minimale de la page racine "/".
 * Le vrai site se trouve dans /fr et /en (voir app/[locale]).
 */
export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      {/* Fond sombre : pas de flash blanc avant l'intro du site */}
      <body style={{ margin: 0, background: '#0E1210', color: '#A3F7C6' }}>{children}</body>
    </html>
  );
}
