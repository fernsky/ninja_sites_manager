import { exec } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { promisify } from "util";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export interface AudioProcessingResult {
  processedBuffer: Buffer;
  cleanup: () => Promise<void>;
}

export async function processM4AAudio(
  inputBuffer: Buffer,
): Promise<AudioProcessingResult> {
  const tempDir = os.tmpdir();
  const timestamp = Date.now();
  const inputPath = path.join(tempDir, `input_${timestamp}.m4a`);
  const outputPath = path.join(tempDir, `output_${timestamp}.m4a`);

  try {
    // Write input buffer to temporary file
    await writeFile(inputPath, inputBuffer);

    // Process audio with FFmpeg
    await execAsync(
      `ffmpeg -i ${inputPath} -c:a aac -b:a 64k -movflags +faststart ${outputPath}`,
      {
        maxBuffer: 1024 * 1024 * 30, // 30MB buffer
        timeout: 30000, // 30 seconds timeout
      },
    );

    // Read processed file
    const processedBuffer = await import("fs/promises").then((fs) =>
      fs.readFile(outputPath),
    );

    // Return processed buffer and cleanup function
    return {
      processedBuffer,
      cleanup: async () => {
        try {
          await Promise.all([
            unlink(inputPath).catch(() => {}),
            unlink(outputPath).catch(() => {}),
          ]);
        } catch (error) {
          console.error("Error cleaning up temporary files:", error);
        }
      },
    };
  } catch (error) {
    // Add more detailed error logging
    console.error("FFmpeg processing error details:", {
      error: error instanceof Error ? error.message : "Unknown error",
      inputSize: inputBuffer.length,
      timestamp,
    });

    // Cleanup on error
    try {
      await Promise.all([
        unlink(inputPath).catch(() => {}),
        unlink(outputPath).catch(() => {}),
      ]);
    } catch {}
    throw new Error(
      `Failed to process audio: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
