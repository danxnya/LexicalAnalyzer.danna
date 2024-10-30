// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const POST = async (request: NextRequest) => {
  const data = await request.formData();
  const file = data.get('file') as Blob;

  if (!file) return NextResponse.json({ message: 'No file provided' }, { status: 400 });

  // Obtener el nombre del archivo original
  const fileEntry = data.get('file') as File; // Cambiar a tipo File
  const fileName = fileEntry?.name || 'uploaded_file';
  const fileExtension = path.extname(fileName);
  const filePath = path.join(process.cwd(), 'uploads', `${fileName}`);

  // Convertir el Blob a un Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Guardar el archivo en la ruta con el nombre y extensión originales
  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ message: 'File uploaded successfully' });
};
