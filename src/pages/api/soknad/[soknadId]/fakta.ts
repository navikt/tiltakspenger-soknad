import { NextApiRequest, NextApiResponse } from "next";
import { apiUrls } from "../../../../api/apiUrls";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { soknadId } = req.query;
      if (typeof soknadId !== "string")
        throw new Error("Required path param missing");
      const response = await fetch(apiUrls.getFakta(soknadId), {
        method: "GET",
        headers: {
          Acccept: "application/json",
          Referer: "soknadtiltakspenger",
        },
      });
      const body = await response.json();
      res.json(body);
    } else {
      throw new Error("Method not allowed");
    }
  } catch (e: unknown) {
    console.log(e);
    res.status(500).json({ error: 500 } as any);
  }
}
