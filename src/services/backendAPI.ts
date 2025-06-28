
export interface ChatRequest {
  text: string;
  sesion_id: string;
}

export interface ChatResponse {
  response: string;
  instructions?: string[];
  shouldCallEmergency?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

class BackendAPIService {
  private baseUrl: string;
  private sessionId: string;

  constructor() {
    // Reemplaza con tu URL real
    this.baseUrl = 'https://your-backend-url.com';
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMessage(text: string): Promise<ChatResponse> {
    try {
      console.log('Enviando mensaje al backend:', { text, sesion_id: this.sessionId });
      
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sesion_id: this.sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta del backend:', data);
      
      return data;
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error);
      // Fallback a análisis local si falla el backend
      return this.getFallbackResponse(text);
    }
  }

  private getFallbackResponse(text: string): ChatResponse {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('ojo') || lowerText.includes('cuerpo extraño')) {
      return {
        response: '¿Hay algo visible flotando en el ojo?',
        instructions: [
          'No frotar el ojo',
          'Intentar parpadear varias veces',
          'Si no se va, enjuagar con agua limpia o suero salino'
        ],
        severity: 'medium'
      };
    }
    
    if (lowerText.includes('corte') || lowerText.includes('sangre')) {
      return {
        response: 'Veo que hay una herida con sangrado. Te voy a guiar paso a paso.',
        instructions: [
          'Mantén la calma y evalúa la situación',
          'Aplica presión directa sobre la herida con un paño limpio',
          'Eleva la parte lesionada por encima del corazón si es posible'
        ],
        shouldCallEmergency: true,
        severity: 'high'
      };
    }

    return {
      response: 'Entiendo tu situación. ¿Puedes describir más detalles sobre lo que está pasando?',
      instructions: [
        'Mantén la calma',
        'Evalúa si la persona está consciente',
        'Observa si hay sangrado visible'
      ],
      severity: 'medium'
    };
  }

  getSessionId(): string {
    return this.sessionId;
  }

  resetSession(): void {
    this.sessionId = this.generateSessionId();
  }
}

export const backendAPI = new BackendAPIService();
