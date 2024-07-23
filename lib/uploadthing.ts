import {
  generateUploadButton,
  generateUploadDropzone,
  generateUploader
} from "@uploadthing/react";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";
 
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
// Not sure if this is needed. Latest docs dont show it as a requirement to get started.
export const Uploader = generateUploader<OurFileRouter>();