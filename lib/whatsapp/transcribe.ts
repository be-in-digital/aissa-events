import "server-only";

import { getActiveAccessToken } from "./token-store";

/**
 * Transcription des messages vocaux WhatsApp via Vercel AI Gateway (Whisper).
 *
 * Pourquoi pas `experimental_transcribe` du `ai` SDK : en v6 il faut un objet
 * provider, le string "openai/whisper-1" n'est pas résolu directement. On
 * appelle l'endpoint OpenAI-compatible du Gateway en multipart/form-data,
 * c'est stable et explicite.
 *
 * Flow :
 *  1. GET `/{media_id}` → URL de download du média (auth Meta).
 *  2. GET de cette URL → bytes audio (ogg/opus typiquement).
 *  3. POST multipart à AI Gateway → texte transcrit.
 */

function graphVersion(): string {
  return process.env.NEXT_PUBLIC_META_GRAPH_API_VERSION || "v21.0";
}

interface MetaMediaResponse {
  url?: string;
  mime_type?: string;
  file_size?: number;
  id?: string;
  error?: { message?: string };
}

async function fetchAudioBytes(
  mediaId: string,
  accessToken: string,
): Promise<{ bytes: Uint8Array; mimeType: string }> {
  const metaUrl = `https://graph.facebook.com/${graphVersion()}/${mediaId}`;
  const metaRes = await fetch(metaUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const meta = (await metaRes.json()) as MetaMediaResponse;
  if (!metaRes.ok || !meta.url) {
    throw new Error(
      `Meta media lookup failed: ${meta.error?.message || `HTTP ${metaRes.status}`}`,
    );
  }

  const audioRes = await fetch(meta.url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!audioRes.ok) {
    throw new Error(`Audio download failed: HTTP ${audioRes.status}`);
  }
  const buf = new Uint8Array(await audioRes.arrayBuffer());
  return { bytes: buf, mimeType: meta.mime_type || "audio/ogg" };
}

interface WhisperResponse {
  text?: string;
  error?: { message?: string };
}

async function whisperTranscribe(
  bytes: Uint8Array,
  mimeType: string,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY manquant.");
  }

  // WhatsApp envoie audio/ogg; codecs=opus typiquement.
  const extension = mimeType.includes("mp3")
    ? "mp3"
    : mimeType.includes("mp4")
      ? "m4a"
      : mimeType.includes("wav")
        ? "wav"
        : "ogg";

  const blob = new Blob([new Uint8Array(bytes)], { type: mimeType });
  const form = new FormData();
  form.append("file", blob, `audio.${extension}`);
  form.append("model", "whisper-1");
  form.append("language", "fr");
  form.append("response_format", "json");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  const json = (await res.json()) as WhisperResponse;
  if (!res.ok || !json.text) {
    throw new Error(
      `Whisper transcription failed: ${json.error?.message || `HTTP ${res.status}`}`,
    );
  }
  return json.text.trim();
}

export async function transcribeWhatsAppAudio(mediaId: string): Promise<string> {
  const active = await getActiveAccessToken();
  if (!active) {
    throw new Error("Aucun compte WhatsApp connecté pour download audio.");
  }

  const { bytes, mimeType } = await fetchAudioBytes(mediaId, active.accessToken);
  return whisperTranscribe(bytes, mimeType);
}
