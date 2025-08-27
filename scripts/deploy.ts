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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
