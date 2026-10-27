import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AL MACTOUM BUSINESS AUTOMOBILE',
  robots: { index: false, follow: true },
  alternates: { canonical: '/fr/' },
};

/**
 * Page racine "/" : redirige vers /en/ si le navigateur est en anglais, sinon vers /fr/ (langue par défaut).
 * Fonctionne sans serveur (export statique).
 */
export default function RootRedirect() {
  const script = `(function(){var l=(navigator.languages&&navigator.languages[0])||navigator.language||'fr';location.replace(/^en/i.test(l)?'/en/':'/fr/'+location.hash);})();`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/fr/" />
      </noscript>
      <p style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <a href="/fr/">AL MACTOUM — Accéder au site</a> · <a href="/en/">English</a>
      </p>
    </>
  );
}
