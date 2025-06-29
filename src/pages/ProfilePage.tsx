import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, User, Heart, Phone, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ProfilePageProps {
  onBack?: () => void;
  onProfileUpdate?: (profile: ProfileData | null) => void;
}

interface ProfileData {
  fullName: string;
  bloodType: string;
  allergies: string[];
  emergencyContact: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onProfileUpdate }) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    bloodType: '',
    allergies: [],
    emergencyContact: ''
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Ya no cargamos automáticamente los datos al montar, 
  // ahora lo haremos con un botón específico

  const handleSaveAll = () => {
    setIsSaving(true);
    try {
      // Guardar en localStorage
      localStorage.setItem('emergencyProfile', JSON.stringify(profileData));
      
      // Notificar al componente padre que el perfil ha cambiado
      if (onProfileUpdate) {
        onProfileUpdate(profileData);
      }
      
      // Simular tiempo de guardado para mejor UX
      setTimeout(() => {
        setIsSaving(false);
        toast.success('¡Toda la información guardada exitosamente!');
        console.log('Perfil completo guardado en localStorage:', profileData);
      }, 800);
    } catch (error) {
      console.error('Error al guardar perfil completo:', error);
      setIsSaving(false);
      toast.error('Error al guardar la información. Inténtalo de nuevo.');
    }
  };

  const addAllergy = () => {
    const allergyInput = newAllergy.trim();
    if (allergyInput) {
      // Separar múltiples alergias si contienen comas
      const allergiesArray = allergyInput.split(',').map(a => a.trim()).filter(a => a);
      
      // Filtrar duplicados y agregar solo los nuevos
      const newAllergies = allergiesArray.filter(
        a => !profileData.allergies.includes(a)
      );
      
      if (newAllergies.length > 0) {
        setProfileData(prev => ({
          ...prev,
          allergies: [...prev.allergies, ...newAllergies]
        }));
        toast.success(`Se ${newAllergies.length === 1 ? 'agregó una alergia' : `agregaron ${newAllergies.length} alergias`}`);
      }
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergyToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(allergy => allergy !== allergyToRemove)
    }));
  };
  
  const resetForm = () => {
    if (window.confirm("¿Estás seguro de que deseas borrar toda la información?")) {
      const emptyProfile = {
        fullName: '',
        bloodType: '',
        allergies: [],
        emergencyContact: ''
      };
      
      setProfileData(emptyProfile);
      setNewAllergy('');
      localStorage.removeItem('emergencyProfile');
      
      // Notificar al componente padre que el perfil se ha eliminado
      if (onProfileUpdate) {
        onProfileUpdate(null);
      }
      
      toast.info('Se ha borrado toda la información');
    }
  };

  // Manejador genérico de cambios en inputs para evitar re-renderizados innecesarios
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Actualizando ${name} a:`, value);
    
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para cargar datos desde localStorage manualmente
  const loadProfileData = () => {
    try {
      const savedProfile = localStorage.getItem('emergencyProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(parsedProfile);
        toast.success('¡Información cargada correctamente!', {
          duration: 3000,
          position: 'top-center',
          icon: '✅',
        });
        console.log('Perfil cargado manualmente desde localStorage:', parsedProfile);
        
        // Notificar al componente padre que el perfil se ha cargado
        if (onProfileUpdate) {
          onProfileUpdate(parsedProfile);
        }
      } else {
        toast.info('No hay información guardada previamente', {
          description: 'Completa los campos y presiona guardar para crear tu perfil',
          duration: 4000,
          position: 'top-center',
          icon: 'ℹ️',
        });
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      toast.error('Error al cargar la información. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para guardar campo individual
  const saveField = (field: keyof ProfileData, value: string | string[]) => {
    try {
      // Obtener datos actuales o inicializar objeto vacío
      let currentData = {};
      const savedProfile = localStorage.getItem('emergencyProfile');
      if (savedProfile) {
        currentData = JSON.parse(savedProfile);
      }

      // Actualizar solo el campo específico
      const updatedProfile = {
        ...currentData,
        [field]: value
      };

      // Guardar en localStorage
      localStorage.setItem('emergencyProfile', JSON.stringify(updatedProfile));
      
      // Notificar al componente padre
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile as ProfileData);
      }
      
      toast.success(`${getFieldLabel(field)} guardado`);
    } catch (error) {
      console.error(`Error al guardar ${field}:`, error);
      toast.error(`Error al guardar ${getFieldLabel(field)}`);
    }
  };
  
  // Función para obtener etiqueta legible de cada campo
  const getFieldLabel = (field: keyof ProfileData): string => {
    switch (field) {
      case 'fullName': return 'Nombre completo';
      case 'bloodType': return 'Grupo sanguíneo';
      case 'allergies': return 'Alergias';
      case 'emergencyContact': return 'Contacto de emergencia';
      default: return 'Campo';
    }
  };

  return (
    <div className="full-height bg-gradient-to-br from-sky-200 via-cyan-100 to-teal-100 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sticky top-0 z-10">
        <div className="flex items-center justify-between p-3 border-b border-cyan-200 bg-white/50 backdrop-blur-sm flex-shrink-0">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-800 hover:bg-white/70 flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-col items-center">
            <h1 className="text-base font-semibold text-slate-700">MI PERFIL</h1>
            <p className="text-xs text-slate-500">Guardar por campo o todo junto</p>
          </div>
          
          {/* Botón reset */}
          <Button
            onClick={resetForm}
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:text-rose-700 flex-shrink-0"
            disabled={!profileData.fullName && !profileData.bloodType && !profileData.emergencyContact && profileData.allergies.length === 0}
          >
            <AlertTriangle className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Indicador flotante para cargar datos */}
        <div className="bg-blue-500 text-white py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Pulsa "CARGAR DATOS" para ver información guardada
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Instrucción principal */}
        <div className="bg-amber-100 p-3 rounded-lg border border-amber-300 text-center text-sm">
          <p className="text-amber-800 font-bold">IMPORTANTE</p>
          <p className="text-amber-700">Para ver tu información guardada presiona "CARGAR DATOS" al final de la página</p>
        </div>
        
        {/* Instrucción secundaria */}
        <div className="bg-sky-50 p-2 rounded-lg border border-sky-200 text-center text-sm text-sky-700">
          <p>Información personal para emergencias</p>
        </div>

        {/* Nombre Completo */}
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-cyan-200">
          <div className="space-y-3">
            <label className="block text-slate-700 font-medium">
              Nombre Completo
            </label>
            <div className="flex gap-2">
              <Input
                name="fullName"
                placeholder="Ingresa tu nombre completo"
                value={profileData.fullName}
                onChange={handleInputChange}
                className="bg-white/80 border-slate-300"
              />
              <Button
                onClick={() => saveField('fullName', profileData.fullName)}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Grupo Sanguíneo */}
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-cyan-200">
          <div className="space-y-3">
            <label className="block text-slate-700 font-medium">
              <Heart className="inline h-4 w-4 mr-2 text-red-500" />
              Grupo Sanguíneo
            </label>
            <div className="flex gap-2">
              <Input
                name="bloodType"
                placeholder="Ej: O+, A-, B+, AB-"
                value={profileData.bloodType}
                onChange={handleInputChange}
                className="bg-white/80 border-slate-300"
              />
              <Button
                onClick={() => saveField('bloodType', profileData.bloodType)}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Alergias */}
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-cyan-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-slate-700 font-medium">
                <AlertTriangle className="inline h-4 w-4 mr-2 text-orange-500" />
                Alergias
              </label>
              <div className="text-sm text-slate-500">
                {profileData.allergies.length} registrada(s)
              </div>
            </div>
            
            {/* Lista de alergias */}
            {profileData.allergies.length > 0 ? (
              <div className="space-y-2">
                {profileData.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center justify-between bg-rose-50 px-3 py-2 rounded border border-rose-200">
                    <span className="text-slate-700">{allergy}</span>
                    <Button
                      onClick={() => removeAllergy(allergy)}
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700 text-xs h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No hay alergias registradas</p>
            )}
            
            {/* Agregar nueva alergia */}
            <div className="flex gap-2">
              <Input
                placeholder="Agregar alergia"
                value={newAllergy}
                onChange={(e) => {
                  console.log('Escribiendo alergia:', e.target.value);
                  setNewAllergy(e.target.value);
                }}
                className="bg-white/80 border-slate-300 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
              />
              <Button
                onClick={addAllergy}
                size="sm"
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                +
              </Button>
              <Button
                onClick={() => saveField('allergies', profileData.allergies)}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Contacto de Emergencia */}
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-cyan-200">
          <div className="space-y-3">
            <label className="block text-slate-700 font-medium">
              <Phone className="inline h-4 w-4 mr-2 text-green-600" />
              Contacto de Emergencia
            </label>
            <div className="flex gap-2">
              <Input
                name="emergencyContact"
                placeholder="Nombre y teléfono"
                value={profileData.emergencyContact}
                onChange={handleInputChange}
                className="bg-white/80 border-slate-300"
              />
              <Button
                onClick={() => saveField('emergencyContact', profileData.emergencyContact)}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Instrucción para cargar datos */}
        <div className="bg-sky-100 p-3 rounded-lg border border-sky-300 text-center mb-4">
          <p className="text-sky-800 font-semibold">
            Para cargar información guardada, haz clic en "CARGAR DATOS"
          </p>
        </div>
        
        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={loadProfileData}
            className="bg-blue-500 hover:bg-blue-600 text-white py-4 font-medium shadow-lg flex items-center justify-center animate-pulse transition-all hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            CARGAR DATOS
          </Button>

          <Button
            onClick={handleSaveAll}
            disabled={isSaving || (!profileData.fullName && !profileData.bloodType && !profileData.emergencyContact && profileData.allergies.length === 0)}
            className="bg-rose-500 hover:bg-rose-600 text-white py-3 font-medium shadow"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar todo'}
          </Button>
        </div>
        
        {/* Mensaje de ayuda */}
        <p className="text-center text-slate-500 text-sm mt-4">
          Guarda los campos individualmente con el botón verde o usa "Guardar todo"
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
