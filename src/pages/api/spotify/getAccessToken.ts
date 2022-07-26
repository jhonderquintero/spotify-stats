import type { NextApiRequest, NextApiResponse } from 'next';

const fetchAccesToken = async (redirectUri: string, spotifyCode: string) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64'),
    },
    body: new URLSearchParams({
      code: spotifyCode,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
    json: true,
  };
  const response = await fetch(authOptions.url, {
    method: 'POST',
    headers: {
      ...authOptions.headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: authOptions.body,
  });
  return await response.json();
};

interface FetchAccesTokenDTO {
  key: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FetchAccesTokenDTO>
) {
  const { redirectUri, spotifyCode } = JSON.parse(req.body);

  const {
    access_token: accesToken,
    expires_in: expiresIn,
    refresh_token: refreshToken,
    scope,
    token_type: tokenType,
  } = await fetchAccesToken(redirectUri, spotifyCode);

  res.status(200).json({
    key: accesToken,
    expiresIn,
    refreshToken,
    scope,
    tokenType,
  });
}
