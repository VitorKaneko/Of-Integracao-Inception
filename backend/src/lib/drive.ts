import { google } from 'googleapis';
import { Readable } from 'stream';
import 'dotenv/config';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function criarPastaNoDrive(nomeProjeto: string): Promise<string> {
  const res = await drive.files.create({
    requestBody: {
      name: nomeProjeto,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    fields: 'id',
  });

  return res.data.id!;
}

export async function buscarPastaDoProjeto(nomeProjeto: string): Promise<string | null> {
  const res = await drive.files.list({
    q: `name='${nomeProjeto}' and mimeType='application/vnd.google-apps.folder' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id, name)',
  });

  return res.data.files?.[0]?.id ?? null;
}

export async function uploadArquivo(
  nomeArquivo: string,
  mimeType: string,
  buffer: Buffer,
  idPastaProjeto: string
): Promise<{ id: string; link: string }> {
  const stream = Readable.from(buffer);

  const res = await drive.files.create({
    requestBody: {
      name: nomeArquivo,
      parents: [idPastaProjeto],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: 'id, webViewLink',
  });

  await drive.permissions.create({
    fileId: res.data.id!,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  return {
    id: res.data.id!,
    link: res.data.webViewLink!,
  };
}