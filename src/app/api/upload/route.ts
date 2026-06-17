import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Check if Cloudinary credentials are set up
const isCloudinaryConfigured = !!(
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!isCloudinaryConfigured) {
      console.warn(
        "Cloudinary is not configured. Falling back to local base64 storage."
      );
      const base64Data = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Data}`;
      
      return NextResponse.json({
        url: dataUrl,
        fallback: true,
        message: "Fallback base64 generated."
      });
    }

    // Upload using Cloudinary stream
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "sambeng-website",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as { secure_url: string });
            }
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      fallback: false
    });
  } catch (error: any) {
    console.error("Error in upload API handler:", error);
    return NextResponse.json(
      { error: error.message || "File upload failed" },
      { status: 500 }
    );
  }
}
