/**
 * Mise en page minimale de la page racine "/".
 * Le vrai site se trouve dans /fr et /en (voir app/[locale]).
 */
export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
