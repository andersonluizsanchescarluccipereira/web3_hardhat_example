import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { provider } from "./provider";
import { ContaCorrente } from "../typechain-types";

export const deployContaCorrente = async (signer: ethers.Wallet): Promise<ContaCorrente> => {
  const artifactPath = path.join(__dirname, "../artifacts/contracts/ContaCorrente.sol/ContaCorrente.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
  const contract = (await factory.deploy()) as ContaCorrente;
  await contract.deploymentTransaction()?.wait();

  console.log("✅ ContaCorrente deployado em:", contract.target);
  return contract;
};
