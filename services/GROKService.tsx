import OpenAI from "openai";

const API_KEY = "aqui";

if (!API_KEY) {
  throw new Error("Falta la variable EXPO_PUBLIC_GROK_API_KEY");
}

const client = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

export class GROKService {
  static async describeImage(base64Image: string): Promise<string> {
    let formattedBase64: string = base64Image;

    if (!base64Image.startsWith("data:")) {
      formattedBase64 = `data:image/jpeg;base64,${base64Image}`;
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
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al analizar la imagen";

      throw new Error(errorMessage);
    }
  }

  static async getFuelCapacity(
    tipoAuto: string,
    marca: string,
  ): Promise<string> {
    try {
      const completion = await client.chat.completions.create({
        model: "grok-4-1-fast-reasoning",
        messages: [
          {
            role: "user",
            content: `
Indica SOLO la capacidad del tanque de combustible en GALONES del siguiente vehículo.

Vehículo:
Modelo: ${marca} ${tipoAuto}

REGLAS OBLIGATORIAS (NO LAS ROMPAS):
- Responde ÚNICAMENTE con un número.
- Puede incluir decimales si aplica.
- NO agregues texto, letras, símbolos ni unidades.
- NO respondas "no disponible", "desconocido" ni similares.
- Si no estás seguro del valor exacto, responde con el valor MÁS COMÚN para ese modelo.

Ejemplos de respuesta válida:
12
14.5
16
          `,
          },
        ],
        temperature: 0.05,
        max_tokens: 10,
      });

      let result = completion.choices?.[0]?.message?.content?.trim();

      // 🔒 Protección total contra respuestas inválidas
      if (!result || isNaN(Number(result))) {
        // Fallback seguro (Toyota Urban Cruiser / 1NR)
        return "12";
      }

      return result;
    } catch (error: unknown) {
      console.error("Error al obtener capacidad del tanque:", error);
      // Fallback final para que nunca reviente la app
      return "12";
    }
  }
}
