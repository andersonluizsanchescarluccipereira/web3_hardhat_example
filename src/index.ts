import Fastify from "fastify";
import cors from "@fastify/cors";
import * as dotenv from "dotenv";
dotenv.config();

import { getSigner } from "../blockchain/provider";
import { deployContaCorrente } from "../blockchain/deploy";
import { depositar, consultarSaldo, transferir } from "../blockchain/contaCorrente";
import { ContaCorrente } from "../typechain-types";

const fastify = Fastify();
fastify.register(cors);

let conta: ContaCorrente;
let signer: ReturnType<typeof getSigner>;

// ---------------------
// Endpoint: Deploy
// ---------------------
fastify.post("/deploy", async (request, reply) => {
  signer = getSigner(process.env.PRIVATE_KEY!);
  conta = await deployContaCorrente(signer);
  return { address: conta.target };
});

// ---------------------
// Endpoint: Depositar
// ---------------------
fastify.post("/depositar", async (request, reply) => {
  const body = request.body as { amount?: string } | undefined;
  if (!body || !body.amount) {
    return reply.status(400).send({ error: "Amount não informado" });
  }

  await depositar(conta, signer, body.amount);
  return { success: true };
});

// ---------------------
// Endpoint: Consultar saldo
// ---------------------
fastify.get("/saldo/:address", async (request, reply) => {
  const params = request.params as { address?: string };
  if (!params.address) {
    return reply.status(400).send({ error: "Endereço não informado" });
  }

  const saldo = await consultarSaldo(conta, params.address);
  return { saldo: saldo.toString() };
});

// ---------------------
// Endpoint: Transferir
// ---------------------
fastify.post("/transferir", async (request, reply) => {
  const body = request.body as { to?: string; amount?: string } | undefined;
  if (!body || !body.to || !body.amount) {
    return reply.status(400).send({ error: "Dados incompletos" });
  }

  await transferir(conta, signer, body.to, body.amount);
  return { success: true };
});

// ---------------------
// Inicializa servidor
// ---------------------
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("🚀 Backend rodando na porta 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
