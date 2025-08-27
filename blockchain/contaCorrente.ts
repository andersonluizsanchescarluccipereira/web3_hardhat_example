import { ContaCorrente } from "../typechain-types";
import { ethers } from "ethers";

// Depositar ETH
export const depositar = async (conta: ContaCorrente, signer: ethers.Signer, amount: string) => {
  const tx = await conta.connect(signer).depositar({ value: ethers.parseEther(amount) });
  await tx.wait();
};

// Consultar saldo
export const consultarSaldo = async (conta: ContaCorrente, address: string) => {
  return await conta.saldoDe(address);
};

// Transferir saldo interno
export const transferir = async (conta: ContaCorrente, signer: ethers.Signer, to: string, amount: string) => {
  const tx = await conta.connect(signer).transferir(to, ethers.parseEther(amount));
  await tx.wait();
};