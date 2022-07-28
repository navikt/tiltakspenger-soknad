// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import mockFakta from "../../i18n/mockFakta.json";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "PUT") {
    updateFakta(res, req.body);
  } else if (req.method === "GET") {
    getFakta(res);
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
