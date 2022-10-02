import type { NextApiRequest, NextApiResponse } from 'next';

const fetchAccesToken = async (refreshToken: string) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
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
  refreshToken?: string;
  scope: string;
  tokenType: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FetchAccesTokenDTO>
) {
  const { refreshToken } = JSON.parse(req.body);

  const {
    access_token: accesToken,
    expires_in: expiresIn,
    scope,
    token_type: tokenType,
  } = await fetchAccesToken(refreshToken);

  res.status(200).json({
    key: accesToken,
    expiresIn,
    refreshToken,
    scope,
    tokenType,
  });
}
