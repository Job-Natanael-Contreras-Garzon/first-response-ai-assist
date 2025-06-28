export interface ChatRequest {
  text: string;
  session_id: string; // Cambié de sesion_id a session_id según tu modelo
}

export interface ChatResponse {
  response: string;
}

class BackendAPIService {
  private baseUrl: string;
  private sessionId: string;

  constructor() {
    // Usar variable de entorno para la URL de la API
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    this.baseUrl = `${apiBase}/chat`;
    this.sessionId = this.generateSessionId();
    
    console.log('🔧 Backend API configurado:', {
      baseUrl: this.baseUrl,
      sessionId: this.sessionId
    });
  }

  private generateSessionId(): string {
    // Usar un ID más simple y consistente como en tu ejemplo
    return 'userAdmin'; // Puedes personalizarlo o usar: `user_${Date.now()}`
  }

  async sendMessage(text: string): Promise<ChatResponse> {
    try {
      console.log('📤 Enviando mensaje al backend:', { 
        text, 
        session_id: this.sessionId,
        endpoint: this.baseUrl 
      });
      
      const requestBody = {
        text,
        session_id: this.sessionId
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 Respuesta del backend:', data);
      
      // Retornar directamente la respuesta del backend
      return data;
    } catch (error) {
      console.error('❌ Error al comunicarse con el backend:', error);
      
      // Si es un error de CORS o de conexión, mostrar un mensaje más específico
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Error de conexión: Verifique que el servidor backend esté ejecutándose y configurado para CORS');
      }
      
      // En caso de otros errores, relanzar la excepción
      throw new Error(`No se pudo conectar con el servicio de emergencias: ${error}`);
    }
  }

  resetSession(): void {
    this.sessionId = this.generateSessionId();
  }

  // Función para probar la conectividad con el backend
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Probando conectividad con el backend...');
      const response = await this.sendMessage('test connection');
      console.log('✅ Conectividad exitosa:', response);
      return true;
    } catch (error) {
      console.error('❌ Error de conectividad:', error);
      return false;
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

export const backendAPI = new BackendAPIService();
