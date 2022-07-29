import { NextApiRequest, NextApiResponse } from "next";
import { apiUrls } from "../../../api/apiUrls";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "DELETE") {
      const { faktaId } = req.query;
      if (typeof faktaId !== "string")
        throw new Error("Required path param faktaId is missing");
      await fetch(apiUrls.deleteFakta(faktaId), {
        method: "DELETE",
      });
      res.status(200).send("");
    }
  } catch (e: unknown) {
    console.log(e);
    res.status(200).json({ error: 500 } as any);
  }
}
