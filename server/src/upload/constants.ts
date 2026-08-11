export const UPLOAD_PURPOSES = [
  'closet_item',
  'chat_attachment',
  'avatar',
  'other',
] as const;
export type UploadPurpose = (typeof UPLOAD_PURPOSES)[number];

export const ALLOWED_IMAGE_FORMATS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'heic',
] as const;

// Cloudinary's raw upload API has no signed "max file size" parameter — size
// is enforced after the fact in UploadService.confirmUpload by checking the
// `bytes` Cloudinary reports back and deleting the asset if it's over.
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
