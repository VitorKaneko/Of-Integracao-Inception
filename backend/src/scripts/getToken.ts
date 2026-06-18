import { google } from 'googleapis';
import http from 'node:http';
import { URL } from 'node:url';
import 'dotenv/config';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:5555/oauth2callback';

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/drive'],
});

console.log('\n🔗 Abra esta URL no navegador e autorize:\n');
console.log(authUrl);
console.log('\nAguardando autorização...\n');

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith('/oauth2callback')) return;

  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get('code');

  if (!code) {
    res.end('Erro: código não encontrado.');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.end(' Autorizado! Pode fechar esta aba e voltar ao terminal.');

    console.log('\n SUCESSO! Adicione esta linha ao seu .env:\n');
    console.log(`GOOGLE_REFRESH_TOKEN="${tokens.refresh_token}"`);
    console.log('\n');

    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Erro ao obter token:', err);
    res.end('Erro ao obter token.');
  }
});

server.listen(5555, () => {
  console.log('Servidor temporário rodando na porta 5555...');
});