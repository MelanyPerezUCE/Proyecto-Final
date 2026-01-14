// src/services/GROKService.ts
import OpenAI from "openai";

const API_KEY =
  "xai-6qfq2wRN098OA2mo4F548CxAHfAytEpv2LcOgCGb3gubTHbWQXt3DUDEnwwR9N0dfmFXhubkcx4REzzc";

if (!API_KEY) {
  throw new Error("Falta la variable EXPO_PUBLIC_GROK_API_KEY");
}

const client = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true, // Necesario en React Native / Expo
});

export class GROKService {
  static async describeImage(base64Image: string): Promise<string> {
    let formattedBase64: string = base64Image;

    if (!base64Image.startsWith("data:")) {
      formattedBase64 = `data:image/jpeg;base64,${base64Image}`;
      // Si usas PNG cambia a: `data:image/png;base64,${base64Image}`
    }

    try {
      const completion = await client.chat.completions.create({
        model: "grok-2-vision-latest",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extrae SOLO el texto de la placa patente del vehículo en la imagen.

Devuelve ÚNICAMENTE las letras y números exactamente como aparecen, sin guiones, sin puntos, sin espacios ni ningún otro carácter.

Ejemplos de respuesta correcta:
- ABC1234
- GHI5678
- PCD89A
- 123ABC

Si no se puede leer claramente la placa, responde SOLO con:
"No legible"

No agregues ninguna explicación, país, color, descripción del vehículo ni nada más.
Respuesta máxima 10 caracteres.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: formattedBase64,
                  detail: "high",
                },
              },
            ],
          },
        ],
        temperature: 0.15,
        max_tokens: 140,
      });

      const description = completion.choices?.[0]?.message?.content;

      if (!description) {
        throw new Error("No se recibió descripción válida de Grok");
      }

      return description.trim();
    } catch (error: unknown) {
      console.error("Error Grok Vision:", error);

      // Manejo más seguro del error
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al analizar la imagen";

      throw new Error(errorMessage);
    }
  }
}
