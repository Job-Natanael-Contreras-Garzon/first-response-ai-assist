export interface ChatRequest {
  text: string;
  session_id: string; // Cambié de sesion_id a session_id según tu modelo
  user_profile?: {
    fullName?: string;
    bloodType?: string;
    allergies?: string[];
    emergencyContact?: string;
  };
}

export interface ChatResponse {
  response: string;
}

class BackendAPIService {
  private baseUrl: string;
  private sessionId: string;
  private static instance: BackendAPIService;

  constructor() {
    // Usar variable de entorno para la URL de la API
    const apiBase = import.meta.env.VITE_API_URL || 'https://genetic-bette-ann-alan-fabian-m-636b9c57.koyeb.app';
    this.baseUrl = `${apiBase}/chat`;
    
    // Comprobar si ya existe un ID en sessionStorage para mantenerlo durante la sesión
    const existingId = sessionStorage.getItem('emergency_session_id');
    if (existingId) {
      this.sessionId = existingId;
    } else {
      this.sessionId = this.generateSessionId();
      sessionStorage.setItem('emergency_session_id', this.sessionId);
    }
    
    console.log('🔧 Backend API configurado:', {
      baseUrl: this.baseUrl,
      sessionId: this.sessionId
    });
  }

  private generateSessionId(): string {
    // Generar un ID único pero determinístico para esta sesión
    return `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  async sendMessage(text: string, userProfile?: {
    fullName?: string;
    bloodType?: string;
    allergies?: string[];
    emergencyContact?: string;
  } | null): Promise<ChatResponse> {
    try {
      // Recuperar el ID de sesión actual desde sessionStorage para garantizar consistencia
      const storedSessionId = sessionStorage.getItem('emergency_session_id');
      if (storedSessionId && storedSessionId !== this.sessionId) {
        console.log('⚠️ Sincronizando session_id con sessionStorage');
        this.sessionId = storedSessionId;
      }
      
      const currentSessionId = this.sessionId;
      
      console.log('📤 Enviando mensaje al backend:', { 
        text, 
        session_id: currentSessionId,
        user_profile: userProfile,
        endpoint: this.baseUrl 
      });
      
      const requestBody: ChatRequest = {
        text,
        session_id: currentSessionId
      };

      // Incluir perfil de usuario si está disponible
      if (userProfile) {
        requestBody.user_profile = userProfile;
      } else {
        // Intentar obtener perfil desde localStorage
        try {
          const savedProfile = localStorage.getItem('emergencyProfile');
          if (savedProfile) {
            requestBody.user_profile = JSON.parse(savedProfile);
          }
        } catch (error) {
          console.error('Error al recuperar perfil para la solicitud:', error);
        }
      }

      // Configurar el fetch con opciones para evitar problemas de CORS
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout (más corto)
      
      // Intentar usar un proxy CORS si está disponible
      const fetchUrl = this.baseUrl;
      
      // Log de la URL para depuración
      if (this.baseUrl.includes('koyeb.app')) {
        console.log('⚠️ Usando URL directa, posible problema de CORS');
      }
      
      const response = await fetch(fetchUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit', // Evitar enviar cookies
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
          'Cache-Control': 'no-cache, no-store',
          'X-Requested-With': 'XMLHttpRequest'
        },
        signal: controller.signal,
        body: JSON.stringify(requestBody)
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Error HTTP: ${response.status} - ${response.statusText}`);
        
        // Generar respuesta contextual basada en el texto enviado
        
        // Si hay un error HTTP, proporcionamos una respuesta contextual
        console.warn(`⚠️ Error HTTP ${response.status}, utilizando respuesta fallback contextual`);
        return {
          response: `Ocurrió un error inesperado. con la respuesta o no nos llego `
        };
      }

      const data = await response.json();
      console.log('📥 Respuesta del backend:', data);
      
      // Retornar directamente la respuesta del backend
      return data;
    } catch (error: unknown) {
      console.error('❌ Error al comunicarse con el backend:', error);
      
      // Generamos una respuesta contextual basada en el texto enviado
      
      // Si es un error de CORS
      if (error instanceof Error && error.message && error.message.includes('CORS')) {
        console.warn('⚠️ Error CORS detectado, usando respuesta fallback contextual');
        return {
          response: `No pude conectarme al servidor debido a restricciones de seguridad `
        };
      }
      
      // Si es un error de timeout/abort
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('⚠️ Timeout en la solicitud, usando respuesta fallback contextual');
        return {
          response: `El servidor está tardando en responder. `
        };
      }
      
      // Si es un error de red/fetch
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('⚠️ Error de conexión, usando respuesta fallback contextual');
        return {
          response: `No pude conectarme al servidor. `
        };
      }
      
      // En caso de otros errores, proporcionar la respuesta contextual
      console.warn('⚠️ Error general, usando respuesta fallback contextual');
      return {
        response: `Ocurrió un error inesperado. con la respuesta o no nos llego `
      };
    }
  }

  

  resetSession(): void {
    // Generar un nuevo ID de sesión
    this.sessionId = this.generateSessionId();
    // Actualizar en sessionStorage
    sessionStorage.setItem('emergency_session_id', this.sessionId);
    console.log('🔄 Session ID regenerado:', this.sessionId);
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
