import multer from 'multer';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Request } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
});

class CustomCloudinaryStorage implements multer.StorageEngine {
  _handleFile(req: Request, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void): void {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'vehicle-rental', format: 'jpeg' },
      (error, result) => {
        if (error) return cb(error);
        if (!result) return cb(new Error("Cloudinary upload failed"));
        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
        });
      }
    );
    file.stream.pipe(stream);
  }

  _removeFile(req: Request, file: Express.Multer.File, cb: (error: Error | null) => void): void {
    cloudinary.uploader.destroy(file.filename, (error) => {
      if (error) cb(error);
      else cb(null);
    });
  }
}

const storage = new CustomCloudinaryStorage();
export const upload = multer({ storage });
