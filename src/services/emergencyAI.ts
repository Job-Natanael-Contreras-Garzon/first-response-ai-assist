
export interface EmergencyAnalysis {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  firstAid: string[];
  callAmbulance: boolean;
  additionalQuestions?: string[];
}

export class EmergencyAIService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async analyzeEmergency(description: string): Promise<EmergencyAnalysis> {
    // Simulación de análisis de IA - en producción usarías una API real
    console.log('Analizando emergencia:', description);
    
    const lowerDesc = description.toLowerCase();
    
    // Análisis básico por palabras clave
    if (lowerDesc.includes('corte') || lowerDesc.includes('sangre') || lowerDesc.includes('herida')) {
      return {
        severity: 'medium',
        category: 'Trauma/Herida',
        firstAid: [
          '1. Mantén la calma y evalúa la situación',
          '2. Aplica presión directa sobre la herida con un paño limpio',
          '3. Eleva la parte lesionada por encima del corazón si es posible',
          '4. No remuevas objetos incrustados en la herida',
          '5. Mantén la presión hasta que llegue ayuda médica'
        ],
        callAmbulance: true
      };
    }
    
    if (lowerDesc.includes('dolor pecho') || lowerDesc.includes('corazón') || lowerDesc.includes('infarto')) {
      return {
        severity: 'critical',
        category: 'Emergencia Cardíaca',
        firstAid: [
          '1. Llama inmediatamente a emergencias',
          '2. Ayuda a la persona a sentarse en posición cómoda',
          '3. Afloja la ropa ajustada',
          '4. Si la persona está consciente, dale aspirina si no es alérgica',
          '5. Prepárate para realizar RCP si la persona pierde el conocimiento'
        ],
        callAmbulance: true
      };
    }
    
    if (lowerDesc.includes('quemadura') || lowerDesc.includes('fuego') || lowerDesc.includes('calor')) {
      return {
        severity: 'medium',
        category: 'Quemadura',
        firstAid: [
          '1. Aleja a la persona de la fuente de calor',
          '2. Enfría la quemadura con agua fría durante 10-20 minutos',
          '3. No uses hielo, mantequilla o remedios caseros',
          '4. Cubre la quemadura con un paño limpio y húmedo',
          '5. No rompas las ampollas que puedan formarse'
        ],
        callAmbulance: lowerDesc.includes('grave') || lowerDesc.includes('extensa')
      };
    }
    
    if (lowerDesc.includes('caída') || lowerDesc.includes('golpe') || lowerDesc.includes('fractura')) {
      return {
        severity: 'medium',
        category: 'Trauma/Lesión',
        firstAid: [
          '1. No muevas a la persona a menos que esté en peligro inmediato',
          '2. Evalúa si está consciente y puede mover extremidades',
          '3. Inmoviliza la zona lesionada',
          '4. Aplica hielo envuelto en un paño sobre la zona afectada',
          '5. Mantén a la persona calmada y cómoda'
        ],
        callAmbulance: true,
        additionalQuestions: [
          '¿Puede mover los brazos y piernas?',
          '¿Siente dolor en el cuello o espalda?',
          '¿Perdió el conocimiento en algún momento?'
        ]
      };
    }
    
    // Caso general
    return {
      severity: 'medium',
      category: 'Emergencia General',
      firstAid: [
        '1. Mantén la calma y evalúa la situación',
        '2. Asegura que el área sea segura',
        '3. Verifica si la persona está consciente y respirando',
        '4. No muevas a la persona a menos que sea necesario',
        '5. Mantente con la persona hasta que llegue ayuda'
      ],
      callAmbulance: true,
      additionalQuestions: [
        '¿Puedes describir más detalles sobre lo que pasó?',
        '¿La persona está consciente?',
        '¿Hay algún sangrado visible?'
      ]
    };
  }

  async askFollowUpQuestion(originalDescription: string, newInfo: string): Promise<EmergencyAnalysis> {
    const combinedDescription = `${originalDescription} ${newInfo}`;
    return this.analyzeEmergency(combinedDescription);
  }
}

export const emergencyAI = new EmergencyAIService();
