import { expect } from "chai";
import { ethers } from "hardhat";
import { ContaCorrente } from "../typechain-types";

describe("ContaCorrente", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    const ContaCorrenteFactory = await ethers.getContractFactory("ContaCorrente");
    const conta = (await ContaCorrenteFactory.deploy()) as unknown as ContaCorrente;

    await conta.waitForDeployment(); // garante que o deploy terminou

    return { conta, owner, user1, user2 };
  }

  it("Deve aceitar deposito via depositar()", async () => {
    const { conta, user1 } = await deployFixture();

    await conta.connect(user1).depositar({ value: ethers.parseEther("1") });

    expect(await conta.connect(user1).consultarSaldo()).to.equal(
      ethers.parseEther("1")
    );
  });

  it("Deve permitir transferir saldo interno para outro usuario", async () => {
    const { conta, user1, user2 } = await deployFixture();

    await conta.connect(user1).depositar({ value: ethers.parseEther("1") });
    await conta.connect(user1).transferir(user2.address, ethers.parseEther("0.4"));

    expect(await conta.connect(user1).consultarSaldo()).to.equal(
      ethers.parseEther("0.6")
    );
    expect(await conta.connect(user2).consultarSaldo()).to.equal(
      ethers.parseEther("0.4")
    );
  });

  it("Deve permitir sacar para si mesmo", async () => {
    const { conta, user1 } = await deployFixture();

    await conta.connect(user1).depositar({ value: ethers.parseEther("1") });
    await conta.connect(user1).sacar(ethers.parseEther("0.5"));

    expect(await conta.connect(user1).consultarSaldo()).to.equal(
      ethers.parseEther("0.5")
    );
  });

  it("Nao deve permitir saque maior que saldo", async () => {
    const { conta, user1 } = await deployFixture();

    await conta.connect(user1).depositar({ value: ethers.parseEther("0.2") });

    await expect(
      conta.connect(user1).sacar(ethers.parseEther("1"))
    ).to.be.revertedWith("Saldo insuficiente");
  });

  it("Nao deve permitir transferir interno maior que saldo", async () => {
    const { conta, user1, user2 } = await deployFixture();

    await conta.connect(user1).depositar({ value: ethers.parseEther("0.2") });

    await expect(
      conta.connect(user1).transferir(user2.address, ethers.parseEther("1"))
    ).to.be.revertedWith("Saldo insuficiente");
  });
});
