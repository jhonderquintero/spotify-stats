import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import type { NextPage } from 'next';
import Image from 'next/image';

interface ILoginPageProps {
  clientId: string;
  clientSecret: string;
}

export const spotifyDefault = {
  authEndpoint: 'https://accounts.spotify.com/authorize',
  redirectUri: 'http://localhost:3000',
  responseType: 'code',
  scope: 'user-read-private user-read-email user-read-playback-state',
  showDialog: 'true',
};

const LoginPage: NextPage<ILoginPageProps> = ({ clientId }) => {
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

  return (
    <div>
      <Image
        src="/assets/svg/spotify-analytics-title.svg"
        height={300}
        width={300}
        alt="svg"
      />
      <button onClick={openSpotifyAuthGate}>Login</button>
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

export default LoginPage;
