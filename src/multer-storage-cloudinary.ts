import { v2 as cloudinary, MetadataFieldApiResponse } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage to accept multiple image formats
export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wunmi_store' as string, // Folder to store images
    format: async (req: any, file: MetadataFieldApiResponse) => {
      // Optional: dynamically set the format based on the uploaded file's mimetype
      const allowedFormats = ['jpeg', 'png', 'jpg', 'gif', 'webp'];
      const mimeType = file.mimetype.split('/')[1];
      return allowedFormats.includes(mimeType) ? mimeType : 'png'; // Fallback to 'png'
    },
    public_id: (req: Request, file: { originalname: string }) => file.originalname, // Custom file name
  },
} as any); // Explicitly cast to `any` if there are type conflicts

// Create the upload middleware with specified file filter
const upload = multer({
  storage,
  fileFilter: (req, file, cb: multer.FileFilterCallback) => {
    // Accept common image formats only
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export default upload;
