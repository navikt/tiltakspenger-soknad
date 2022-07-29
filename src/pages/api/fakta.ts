// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import mockFakta from "../../i18n/mockFakta.json";
import { apiUrls } from "../../api/apiUrls";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "PUT") {
      updateFakta(res, req.body);
    } else if (req.method === "POST") {
      await postFakta(res, req.body);
    } else if (req.method === "GET") {
      getFakta(res);
    }
  } catch (e: unknown) {
    console.log(e);
    res.status(200).json({ error: 500 } as any);
  }
}

interface FaktumEgenskaper {
  faktumId: number;
  key: string;
  soknadId: number;
  systemEgenskap: number;
  value: string;
}

interface UpdateFaktaPayload {
  faktumEgenskaper: FaktumEgenskaper[];
  faktumId: number;
  key: string;
  parrentFaktum: null | number;
  properties: Record<string, string | number | null>;
  soknadId: number;
  type: string;
  value: null | string | number;
}

const updateFakta = (
  res: NextApiResponse<Data>,
  payload: UpdateFaktaPayload
) => {
  res.status(200).json(mockFakta as any);
};
const getFakta = (res: NextApiResponse<Data>) => {
  res.status(200).json(mockFakta as any);
};

const postFakta = async (res: NextApiResponse<Data>, payload: any) => {
  const response = await fetch(apiUrls.postFakta, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
  res.status(200).json(response);
};
