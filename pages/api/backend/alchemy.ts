import type { NextApiRequest, NextApiResponse } from "next";
import {
  Alchemy,
  AssetTransfersCategory,
  Network,
  SortingOrder,
} from "alchemy-sdk";

type Data = {
  cid?: string;
  reason?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "GET") {
    // Post object to the IPFS
    try {
      const alchemy = new Alchemy({
        apiKey: process.env.ALCHEMY_API_KEY,
        network: Network.MATIC_MUMBAI,
      });

      const type: string = req.query.type as string;

      switch (type) {
        case "transactions":
          const toAddress: string = req.query.toAddress as string;
          if (!toAddress) {
            return res.status(400).json({ reason: "bad request" });
          }

          const resp = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            toAddress: toAddress,
            excludeZeroValue: true,
            order: SortingOrder.DESCENDING,
            category: [
              AssetTransfersCategory.ERC20,
              AssetTransfersCategory.ERC1155,
              AssetTransfersCategory.ERC721,
              AssetTransfersCategory.EXTERNAL,
            ],
          });

          return res
            .status(200)
            .json({ transfers: resp.transfers } as unknown as Data);
          break;
        case "balance":
          const address = req.query.address as string;
          if (!address) {
            return res.status(400).json({ reason: "bad request" });
          }
          const balanceResp = await alchemy.core.getBalance(address, "latest");
          return res.status(200).json(balanceResp as unknown as Data);
          break;
        default:
          return res.status(400).json({ reason: "bad request" });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ reason: "something went wrong." });
    }
  } else {
    res.status(400).json({ reason: "bad request" });
  }
};
