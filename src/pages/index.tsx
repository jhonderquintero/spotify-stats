import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

interface IHomeProps {
  clientId: string;
  clientSecret: string;
}

const spotifyDefault = {
  authEndpoint: 'https://accounts.spotify.com/authorize',
  redirectUri: 'http://localhost:3000',
  responseType: 'code',
  scope: 'user-read-private user-read-email user-read-playback-state ',
  showDialog: 'true',
};

const Home: NextPage<IHomeProps> = ({ clientId, clientSecret }) => {
  const { query, replace } = useRouter();
  const [, setAccesToken] = useState('');
  const { authEndpoint, redirectUri, responseType, scope, showDialog } =
    spotifyDefault;

  const handleSpotifyLogin = () => {
    const authUrl = new URL(authEndpoint);
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', responseType);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('show_dialog', showDialog);
    window.location.href = authUrl.href;
  };

  const fetchAccesToken = async (code: string) => {
    // const authOptions = {
    //   url: 'https://accounts.spotify.com/api/token',
    //   body: new URLSearchParams({
    //     code,
    //     redirect_uri: redirectUri,
    //     grant_type: 'authorization_code',
    //   }),
    //   headers: {
    //     Authorization:
    //       'Basic ' +
    //       new Buffer(clientId + ':' + clientSecret).toString('base64'),
    //   },
    //   json: true,
    // };
    // const response = await fetch(authOptions.url, {
    //   method: 'POST',
    //   headers: {
    //     ...authOptions.headers,
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   body: authOptions.body,
    // });
    const response = await fetch('/api/spotify/getAccessToken', {
      method: 'POST',
      body: JSON.stringify({
        redirectUri: redirectUri,
        spotifyCode: code,
      }),
    });
    console.log('RESPONSE', response);
    // setAccesToken(response);
    // return (await response.json())['access_token']
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
        fetchAccesToken(spotifyCode);
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
        <div>
          <h1>Spotify</h1>
        </div>
        <button onClick={handleSpotifyLogin}>Login</button>
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
