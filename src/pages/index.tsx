import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import img from '../../public/assets/images/spotify-home.png';

interface IHomeProps {
  clientId: string;
  clientSecret: string;
}

const spotifyDefault = {
  authEndpoint: 'https://accounts.spotify.com/authorize',
  redirectUri: 'http://localhost:3000',
  responseType: 'code',
  scope: 'user-read-private user-read-email user-read-playback-state',
  showDialog: 'true',
};

const HomepageContainer = styled.div`
  background-image: url(${img.src});
  width: 100vw;
  height: 100vh;
  color: white;
`;

const Home: NextPage<IHomeProps> = ({ clientId }) => {
  const { query, replace } = useRouter();
  const [spotifyTokenData, setSpotifyTokenData] = useState<any>({});
  const { authEndpoint, redirectUri, responseType, scope, showDialog } =
    spotifyDefault;

  const openSpotifyAuthGate = () => {
    const authUrl = new URL(authEndpoint);
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', responseType);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('show_dialog', showDialog);
    window.location.href = authUrl.href;
  };

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

  return (
    <div>
      <Head>
        <title>Spotify Stats</title>
        <meta name="description" content="spotify stats web-application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HomepageContainer>
          <button onClick={openSpotifyAuthGate}>Login</button>
          <button onClick={refreshToken}>Refresh token</button>
          <h1>Spotify</h1>
        </HomepageContainer>
      </main>
    </div>
  );
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

export default Home;
