"use server";

import { db } from "@/db";
import { noteAttachments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function uploadAttachment(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const file = formData.get("file") as File;
    const noteId = formData.get("noteId") as string;

    if (!file || !noteId) {
      throw new Error("Missing required fields");
    }

    // Create uploads directory if it doesn't exist
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, ".gitkeep"), "");

    // Generate unique filename
    const filename = `${uuidv4()}-${file.name}`;
    const filePath = join(UPLOAD_DIR, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create attachment record
    const [attachment] = await db
      .insert(noteAttachments)
      .values({
        note_id: parseInt(noteId),
        filename,
        original_filename: file.name,
        mime_type: file.type,
        size: file.size,
        url: `/uploads/${filename}`,
      })
      .returning();

    revalidatePath(`/language/${noteId}`);
    return attachment;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function deleteAttachment(attachmentId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const [attachment] = await db
      .delete(noteAttachments)
      .where(eq(noteAttachments.id, parseInt(attachmentId)))
      .returning();

    if (attachment) {
      // Delete file from filesystem
      const filePath = join(UPLOAD_DIR, attachment.filename);
      await writeFile(filePath, "").catch(() => {}); // Ignore error if file doesn't exist
    }

    revalidatePath(`/language/${attachment.note_id}`);
    return attachment;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

export async function getAttachments(noteId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return await db
    .select()
    .from(noteAttachments)
    .where(eq(noteAttachments.note_id, noteId));
}
