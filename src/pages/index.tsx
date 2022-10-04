import Cookies from 'js-cookie';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { spotifyDefault } from './login';

interface ILoginPageProps {
  clientId: string;
  clientSecret: string;
}

export const App: NextPage<ILoginPageProps> = ({ clientId }) => {
  const { query, replace } = useRouter();
  const [spotifyTokenData, setSpotifyTokenData] = useState<any>({});
  const { redirectUri } = spotifyDefault;

  const getAccesToken = async (code: string) => {
    const response = await fetch('/api/spotify/getAccessToken', {
      method: 'POST',
      body: JSON.stringify({
        redirectUri: redirectUri,
        spotifyCode: code,
      }),
    });
    const tokenData = await response.json();
    setSpotifyTokenData(tokenData);
  };

  const refreshToken = async () => {
    const response = await fetch('/api/spotify/getRefreshedToken', {
      method: 'POST',
      body: JSON.stringify({
        redirectUri: redirectUri,
        refreshToken: spotifyTokenData.refreshToken,
      }),
    });
    const refreshedTokenData = await response.json();
    setSpotifyTokenData(refreshedTokenData);
  };

  useEffect(() => {
    if (query.code) {
      const actualSpotifyCodeCookie = Cookies.get('spotify-code');
      let spotifyCode: string =
        typeof query.code === 'object' ? query.code[0] : query.code;
      if (
        !Cookies.get('spotify-code') ||
        actualSpotifyCodeCookie !== spotifyCode
      ) {
        Cookies.set('spotify-code', spotifyCode);
        getAccesToken(spotifyCode);
        replace(redirectUri);
      }
    }
  }, [query]);
  return <div>Index</div>;
};

export async function getStaticProps(): Promise<{
  props: {
    clientId: string;
    clientSecret: string;
  };
}> {
  const clientId = String(process.env.SPOTIFY_CLIENT_ID);
  const clientSecret = String(process.env.SPOTIFY_CLIENT_SECRET);
  return {
    props: {
      clientId,
      clientSecret,
    },
  };
}

export default App;
