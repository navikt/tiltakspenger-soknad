import { NextApiRequest, NextApiResponse } from "next";
import { apiUrls } from "../../api/apiUrls";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const response = await fetch(apiUrls.soknad, {
        method: "POST",
        headers: {
          // Is this actually used in sendsoknad-boot or just in the mock-backend?
          Referer: "soknadtiltakspenger",
        },
      }).then((response) => response.json());
      res.json(response);
    } else {
      throw new Error("Method not allowed");
    }
  } catch (e: unknown) {
    console.log(e);
    res.status(500).json({ error: 500 } as any);
  }
}
