// Servicio simple para OpenRouter con Mistral
class AIService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    console.log('✅ Servicio de IA inicializado con OpenRouter + Mistral');
    this.isInitialized = true;
  }

  async sendMessage(message) {
    await this.initialize();

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content: "Eres TecIA, un asistente virtual amigable y conversacional. Puedes hablar sobre cualquier tema de manera natural y relajada. Si te preguntan sobre TecUnify, puedes ayudar con información sobre espacios tecnológicos, laboratorios, reservas y servicios. Pero también puedes conversar libremente sobre otros temas si el usuario lo desea. Mantén un tono amigable, casual y útil."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        
        // Si la respuesta está vacía o es muy corta, generar una respuesta de fallback más natural
        if (!content || content.trim().length < 3) {
          return '¡Hola! 😊 Soy TecIA, tu asistente virtual. Puedo ayudarte con información sobre TecUnify (laboratorios, reservas, horarios, etc.) o simplemente podemos conversar sobre lo que quieras. ¿Qué te gustaría saber o de qué te gustaría hablar?';
        }
        
        return content;
      } else {
        throw new Error('No se pudo obtener respuesta de la IA');
      }
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw new Error(`Error de IA: ${error.message}`);
    }
  }

  getCurrentModelInfo() {
    return {
      name: 'Mistral 7B (OpenRouter)',
      available: true,
      provider: 'OpenRouter'
    };
  }
}

export const aiService = new AIService();