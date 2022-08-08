// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  example: string;
};

const fetchAccesToken = async (redirectUri: string, spotifyCode: string) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    body: new URLSearchParams({
      code: spotifyCode,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
    headers: {
      Authorization:
        'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64'),
    },
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { redirectUri, spotifyCode } = JSON.parse(req.body);

  const response = await fetchAccesToken(redirectUri, spotifyCode);
  console.log('🚀 ~ file: getAccessToken.ts ~ line 44 ~ response', response);
  res.status(200).json({ example: 'Example data' });
}
