import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:7545");

export const getSigner = (privateKey: string) => {
  return new ethers.Wallet(privateKey, provider);
};