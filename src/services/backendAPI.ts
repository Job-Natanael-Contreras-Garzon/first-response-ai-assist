
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
    // IMPORTANTE: Reemplaza 'https://your-backend-url.com' con tu URL real
    // Ejemplo: 'https://api.tudominio.com' o 'http://localhost:3000'
    this.baseUrl = 'https://your-backend-url.com'; // ← CAMBIAR AQUÍ
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
    
    // Cuerpo Extraño en el Ojo
    if (lowerText.includes('ojo') || lowerText.includes('cuerpo extraño') || lowerText.includes('basura en el ojo')) {
      return {
        response: '¿Hay algo visible flotando en el ojo?',
        instructions: [
          'No frotar el ojo',
          'Intentar parpadear varias veces',
          'Si no se va, enjuagar con agua limpia o suero salino',
          'Si hay dolor fuerte, visión borrosa o sangrado: NO tocar más, cubrir con gasa y llamar emergencias'
        ],
        severity: 'medium'
      };
    }
    
    // Astillas o Espinas Superficiales
    if (lowerText.includes('astilla') || lowerText.includes('espina') || lowerText.includes('pincho')) {
      return {
        response: '¿La astilla está parcialmente afuera y es pequeña?',
        instructions: [
          'Lava la zona con agua y jabón',
          'Usa pinzas limpias para extraer si está superficial',
          'Lava nuevamente y cubre con apósito',
          'Si está muy profunda, NO intentar extraer - cubrir y buscar atención médica'
        ],
        severity: 'low'
      };
    }

    // Intoxicación por Alimentos
    if (lowerText.includes('intoxicación') || lowerText.includes('vómito') || lowerText.includes('diarrea') || lowerText.includes('comida mala')) {
      return {
        response: '¿Hay vómito, diarrea o dolor abdominal leve?',
        instructions: [
          'Hidratación con agua o suero oral en sorbos pequeños',
          'Reposo absoluto',
          'Observar si mejora en pocas horas',
          'Si hay fiebre alta, sangre en vómito/diarrea o dolor intenso: llamar emergencias'
        ],
        severity: 'medium',
        shouldCallEmergency: false
      };
    }

    // Dolor Abdominal
    if (lowerText.includes('dolor abdominal') || lowerText.includes('dolor estómago') || lowerText.includes('dolor barriga')) {
      return {
        response: '¿Es dolor leve, sin fiebre ni vómitos?',
        instructions: [
          'Reposar en posición cómoda',
          'No comer ni tomar nada por 1 hora',
          'Observar si mejora',
          'Si hay dolor agudo persistente, fiebre o vómito: llamar emergencias'
        ],
        severity: 'medium'
      };
    }

    // Dolor en el Pecho
    if (lowerText.includes('dolor pecho') || lowerText.includes('pecho duele') || lowerText.includes('infarto')) {
      if (lowerText.includes('opresivo') || lowerText.includes('sudor') || lowerText.includes('náuseas') || lowerText.includes('falta aire')) {
        return {
          response: 'EMERGENCIA: Síntomas de posible infarto detectados.',
          instructions: [
            'Sentar o acostar en posición cómoda',
            'Aflojar ropa ajustada',
            'Si tiene nitroglicerina prescrita, administrar',
            'NO dejar solo/a a la persona',
            'Prepararse para RCP si pierde conciencia'
          ],
          severity: 'critical',
          shouldCallEmergency: true
        };
      } else {
        return {
          response: '¿Es dolor punzante que ocurre al moverse o respirar hondo?',
          instructions: [
            'Puede ser dolor muscular',
            'Reposar y observar',
            'Si empeora o aparecen otros síntomas, buscar atención médica'
          ],
          severity: 'low'
        };
      }
    }

    // Crisis de Ansiedad
    if (lowerText.includes('ansiedad') || lowerText.includes('pánico') || lowerText.includes('respiración rápida') || lowerText.includes('palpitaciones')) {
      return {
        response: '¿La persona respira rápido, con miedo o palpitaciones?',
        instructions: [
          'Hablar con voz calmada y tranquilizadora',
          'Guiar respiración: "Inhala contando hasta 4, exhala contando hasta 4"',
          'Permanecer cerca hasta que se calme',
          'Si hay dolor en pecho, desmayo o confusión: llamar emergencias'
        ],
        severity: 'medium'
      };
    }

    // Atragantamiento
    if (lowerText.includes('asfixia') || lowerText.includes('atragant') || lowerText.includes('no puede respirar') || lowerText.includes('ahogo')) {
      return {
        response: 'EMERGENCIA CRÍTICA: Atragantamiento detectado.',
        instructions: [
          'Preguntar: "¿Te estás atragantando?" Si no puede responder, actuar inmediatamente',
          'Colocarse detrás de la persona',
          'Rodear abdomen con brazos',
          'Colocar puño sobre ombligo, otra mano encima',
          'Realizar compresiones rápidas hacia adentro y arriba (Maniobra de Heimlich)',
          'Repetir hasta que expulse el objeto o pierda conciencia'
        ],
        severity: 'critical',
        shouldCallEmergency: true
      };
    }

    // RCP - Paro Cardíaco
    if (lowerText.includes('no responde') || lowerText.includes('inconsciente') || lowerText.includes('no respira') || lowerText.includes('rcp')) {
      return {
        response: 'EMERGENCIA CRÍTICA: Posible paro cardiorrespiratorio.',
        instructions: [
          'Verificar respuesta: golpear hombros y gritar "¿Estás bien?"',
          'Si no responde y no respira: llamar emergencias inmediatamente',
          'Iniciar RCP: colocar manos en centro del pecho',
          'Brazos rectos, presionar fuerte y rápido: 100-120 compresiones por minuto',
          'Permitir retroceso completo del pecho entre compresiones',
          'NO detenerse hasta que llegue ayuda profesional'
        ],
        severity: 'critical',
        shouldCallEmergency: true
      };
    }

    // Quemaduras
    if (lowerText.includes('quemadura') || lowerText.includes('quemé') || lowerText.includes('fuego') || lowerText.includes('caliente')) {
      if (lowerText.includes('ampolla') || lowerText.includes('húmeda') || lowerText.includes('grande')) {
        return {
          response: 'Quemadura de segundo grado detectada.',
          instructions: [
            'Enfriar con agua a temperatura ambiente por 10-15 minutos',
            'Cubrir con gasa estéril sin apretar',
            'NO romper las ampollas',
            'NO aplicar cremas, pasta dental ni remedios caseros',
            'Si la zona es grande o en partes sensibles: llamar emergencias'
          ],
          severity: 'medium'
        };
      } else {
        return {
          response: 'Quemadura superficial identificada.',
          instructions: [
            'Enfriar con agua corriente (no helada) por 10-20 minutos',
            'NO usar hielo, manteca ni pasta dental',
            'Secar con suavidad y cubrir con gasa estéril',
            'Puede tomar analgésico si ya ha usado antes'
          ],
          severity: 'low'
        };
      }
    }

    // Fracturas
    if (lowerText.includes('fractura') || lowerText.includes('hueso roto') || lowerText.includes('no puedo mover') || lowerText.includes('deformidad')) {
      return {
        response: 'Posible fractura detectada.',
        instructions: [
          'NO mover la zona afectada',
          'Inmovilizar con férula improvisada si sabe cómo hacerlo',
          'Aplicar hielo envuelto en tela',
          'Controlar dolor sin mover el hueso',
          'Buscar atención médica urgente'
        ],
        severity: 'high',
        shouldCallEmergency: true
      };
    }

    // Hemorragia Severa
    if (lowerText.includes('mucha sangre') || lowerText.includes('sangrado abundante') || lowerText.includes('no para de sangrar')) {
      return {
        response: 'EMERGENCIA: Hemorragia severa detectada.',
        instructions: [
          'Presionar con fuerza usando tela limpia o gasa',
          'NO retirar el apósito si se empapa, añadir más encima',
          'Elevar la zona herida por encima del corazón si es posible',
          'Mantener presión constante',
          'Llamar emergencias inmediatamente'
        ],
        severity: 'critical',
        shouldCallEmergency: true
      };
    }

    // Heridas con objeto incrustado
    if (lowerText.includes('disparo') || lowerText.includes('bala') || lowerText.includes('objeto clavado') || lowerText.includes('cuchillo')) {
      return {
        response: 'EMERGENCIA CRÍTICA: Trauma penetrante detectado.',
        instructions: [
          'NO retirar el objeto incrustado',
          'Estabilizar el objeto con vendajes alrededor',
          'Controlar sangrado alrededor del objeto sin presionar sobre él',
          'Mantener a la persona calmada y acostada',
          'Vigilar signos vitales constantemente'
        ],
        severity: 'critical',
        shouldCallEmergency: true
      };
    }

    // Respuesta por defecto para casos no específicos
    return {
      response: 'He registrado tu emergencia. Para brindarte la mejor ayuda, necesito más información específica.',
      instructions: [
        'Mantén la calma y respira profundamente',
        'Evalúa si hay peligro inmediato',
        'Describe síntomas específicos: dolor, sangrado, dificultad para respirar',
        'Indica si la persona está consciente y puede hablar'
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
