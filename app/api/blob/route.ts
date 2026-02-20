import { type NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";

/** Allowed pathname prefixes for private blob access (prevents path traversal). */
const ALLOWED_PREFIXES = ["uploads/", "generated/"];

/**
 * GET /api/blob?pathname=... — Streams a private blob to the client.
 * Used when the Blob store has private access; the direct blob URL is not
 * reachable, so we fetch via get() and stream the response.
 */
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname");

  if (!pathname || typeof pathname !== "string") {
    return NextResponse.json(
      { error: "Missing pathname" },
      { status: 400 },
    );
  }

  // Restrict to our upload/generated paths only
  const allowed = ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!allowed || pathname.includes("..")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await get(pathname, { access: "private" });

  if (!result || result.statusCode !== 200) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Suggest filename for downloads (e.g. generated/foo.jpg -> foo.jpg)
  const filename = pathname.split("/").pop() ?? "image.jpg";

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, max-age=86400",
    },
  });
}
