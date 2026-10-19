import { MAX_FILE_SIZE } from "@/lib/constants";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const ALLOWED_UPLOAD_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function resolveToken() {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ??
    process.env.BOOKWISE_READ_WRITE_TOKEN
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const contentType = request.headers.get("content-type") ?? "";
  
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as HandleUploadBody;
      const token = resolveToken();

      if (!token) {
        return NextResponse.json(
          { error: "Vercel Blob read-write token is not configured." },
          { status: 500 },
        );
      }

      const jsonResponse = await handleUpload({
        token,
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          const { userId } = await auth();

          if (!userId) {
            throw new Error("Unauthorized: User not authenticated");
          }

          const lowerPath = pathname.toLowerCase();
          const allowedContentTypes = lowerPath.endsWith(".pdf")
            ? ["application/pdf"]
            : lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg")
              ? ["image/jpeg"]
              : lowerPath.endsWith(".webp")
                ? ["image/webp"]
                : ["image/png"];

          return {
            allowedContentTypes,
            addRandomSuffix: true,
            maximumSizeInBytes: MAX_FILE_SIZE,
            tokenPayload: JSON.stringify({ userId }),
          };
        },
        onUploadCompleted: undefined,
      });
      return NextResponse.json(jsonResponse);
    }
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = resolveToken();
    if (!token) {
      return NextResponse.json(
        { error: "Vercel Blob read-write token is not configured." },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const pathname =
      url.searchParams.get("pathname") ??
      request.headers.get("x-vercel-blob-pathname") ??
      "";
    const explicitContentType =
      url.searchParams.get("contentType") ??
      request.headers.get("x-vercel-blob-content-type") ??
      contentType.split(";")[0];

    if (!pathname) {
      return NextResponse.json(
        { error: "pathname query param is required." },
        { status: 400 },
      );
    }

    const resolvedContentType = explicitContentType || "application/octet-stream";

    if (!ALLOWED_UPLOAD_TYPES.includes(resolvedContentType)) {
      return NextResponse.json(
        { error: `Content type ${resolvedContentType} is not allowed.` },
        { status: 400 },
      );
    }

    const contentLengthHeader = request.headers.get("content-length");
    const contentLength = contentLengthHeader
      ? Number(contentLengthHeader)
      : NaN;
    if (!Number.isNaN(contentLength) && contentLength > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.` },
        { status: 400 },
      );
    }

    const bodyBuffer = Buffer.from(await request.arrayBuffer());
    if (bodyBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: "Empty upload body." },
        { status: 400 },
      );
    }
    if (bodyBuffer.byteLength > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.` },
        { status: 400 },
      );
    }

    const blob = await put(pathname, bodyBuffer, {
      access: "private",
      contentType: resolvedContentType,
      addRandomSuffix: true,
      token,
    });

    return NextResponse.json(blob);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
