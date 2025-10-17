/* @private */

import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

import type { GravatarOptions } from '@/types/options';

export async function resizeAndCropImage(
  file: File,
  name: string,
  size: number,
  extension: string,
): Promise<File> {
  const image = await loadImage(file);

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;

  const ctx = canvas.getContext('2d');

  const minEdge = Math.min(image.width, image.height);

  const sx = (image.width - minEdge) / 2;
  const sy = (image.height - minEdge) / 2;
  const sWidth = minEdge;
  const sHeight = minEdge;

  ctx?.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, size, size);

  const resizedImageBlob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, `image/${extension}`),
  );

  return new File([resizedImageBlob as BlobPart], `${name}.${extension}`, {
    type: `image/${extension}`,
  });
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      image.src = e.target?.result as string;
    };

    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);

    reader.readAsDataURL(file);
  });
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Generate a Gravatar URL for an email address
 * @param email - Email address
 * @param options - Gravatar options
 * @returns Gravatar URL or null if email is invalid
 */
export function getGravatarUrl(email?: string | null, options?: GravatarOptions): string | null {
  if (!email) return null;

  try {
    // Normalize email: trim and lowercase
    const normalizedEmail = email.trim().toLowerCase();
    // sha256 expects Uint8Array, so encode string to Uint8Array
    const encoder = new TextEncoder();
    const emailBytes = encoder.encode(normalizedEmail);
    const hash = bytesToHex(sha256(emailBytes));
    const extension = options?.jpg ? '.jpg' : '';
    let url = `https://gravatar.com/avatar/${hash}${extension}`;

    const params = new URLSearchParams();

    // Add size parameter
    if (options?.size) {
      params.append('s', Math.min(Math.max(options.size, 1), 2048).toString());
    }

    // Add default image parameter
    if (options?.d) {
      params.append('d', options.d);
    }

    // Add force default parameter
    if (options?.forceDefault) {
      params.append('f', 'y');
    }

    // Append parameters if any
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  } catch (error) {
    console.error('Error generating Gravatar URL:', error);
    return null;
  }
}
