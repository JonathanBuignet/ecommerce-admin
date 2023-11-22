import { mongooseConnect } from '@/lib/mongoose';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import multiparty from 'multiparty';
import { isAdminRequest } from './auth/[...nextauth]';
const bucketName = 'john-next-ecommerce';

export default async function handle(req, res) {
  await mongooseConnect();
  // await isAdminRequest(req, res);

  //? Package pour upload des images
  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  //? Client pour se connecter a AWS
  const client = new S3Client({
    region: 'eu-west-3',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  //? Envoi de chaque fichier sur AWS / créé un nom unique en gardant son ext
  //? récupérer un lien fourni par AWS
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() + '.' + ext;
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: 'public-read',
        ContentType: mime.lookup(file.path),
      })
    );
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }
  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
