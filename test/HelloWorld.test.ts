import { expect } from "chai";
import { ethers } from "hardhat";

describe("HelloWorld", function () {
  it("Deve retornar a mensagem inicial correta", async function () {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy();
    await hello.waitForDeployment();

    expect(await hello.getMessage()).to.equal("Hello, Hardhat!");
  });

  it("Deve atualizar a mensagem", async function () {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy();
    await hello.waitForDeployment();

    const tx = await hello.setMessage("Oi, Hardhat!");
    await tx.wait();

    expect(await hello.getMessage()).to.equal("Oi, Hardhat!");
  });
});
