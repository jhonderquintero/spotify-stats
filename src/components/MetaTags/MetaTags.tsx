import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export const MetaTags = () => {
  const router = useRouter();

  const [isPageLoaded, setIsPageLoad] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    setIsPageLoad(true);

    // Remove query from url
    const pathname = router.asPath.split('?')[0];

    const locale = router.locale;
    setUrl(window.location.origin + `/${locale}` + pathname);
  }, [router]);

  return (
    <Head>
      <title>Spotify Stats</title>
      <meta
        name="description"
        content="Information and analytics for your spotify account."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta charSet="UTF-8" />
      <meta property="og:title" content="Spotify Stats." />
      <meta
        property="og:description"
        content="Information and analytics for your spotify account."
      />
      <meta
        property="og:image"
        content="https://cdn.dribbble.com/users/797505/screenshots/5407591/spotify_analytics.png"
      />
      {isPageLoaded && (
        <>
          <link rel="alternate" href={url} hrefLang={router.locale} />
          <link rel="canonical" href={url} />
        </>
      )}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
