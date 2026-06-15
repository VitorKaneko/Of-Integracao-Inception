import { FastifyRequest, FastifyReply } from 'fastify';

export async function verifyToken(req: FastifyRequest, reply: FastifyReply) {
  try {
    const token = req.cookies?.token;
    if (token && !req.headers.authorization) {
      req.headers.authorization = `Bearer ${token}`;
    }
    await req.jwtVerify();
  } catch {
    return reply.status(401).send({ error: 'Não autorizado.' });
  }
}