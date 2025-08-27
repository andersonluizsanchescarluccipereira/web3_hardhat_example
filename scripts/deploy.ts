import { ethers } from "hardhat";

async function main() {
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const hello = await HelloWorld.deploy();

  await hello.waitForDeployment();
  console.log("HelloWorld deployed to:", await hello.getAddress());

  // Ler a mensagem inicial
  console.log("Mensagem inicial:", await hello.getMessage());

  // Alterar a mensagem
  const tx = await hello.setMessage("Oi, Hardhat!");
  await tx.wait();

  console.log("Mensagem alterada:", await hello.getMessage());
  // Pega a factory do contrato
  const ContaCorrente = await ethers.getContractFactory("ContaCorrente");

  // Faz o deploy
  const conta = await ContaCorrente.deploy();
  await conta.deploymentTransaction()?.wait();

  console.log("✅ ContaCorrente deployado em:", conta.target);

  // Só para validar: checar saldo do contrato
  const saldoContrato = await conta.saldoDoContrato();
  console.log("💰 Saldo inicial do contrato:", saldoContrato.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
