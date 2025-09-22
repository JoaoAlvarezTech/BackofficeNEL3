import React, { createContext, useContext, useState, useEffect } from 'react';

interface AnticipationActivity {
  id: string;
  amount: number;
  title: string;
  category: string;
  patientName: string;
  date: string;
  receiveInDays: number;
  status: 'available' | 'in_progress' | 'completed' | 'cancelled';
  submittedDate?: string;
  completedDate?: string;
  receivedAmount?: number;
  serviceCost?: number;
  anticipationFee?: string;
}

interface AnticipationContextType {
  activities: AnticipationActivity[];
  addActivity: (activity: Omit<AnticipationActivity, 'id' | 'status'>) => void;
  submitAnticipation: (activityId: string) => Promise<boolean>;
  completeAnticipation: (activityId: string) => Promise<boolean>;
  cancelAnticipation: (activityId: string) => Promise<boolean>;
  getAvailableActivities: () => AnticipationActivity[];
  getInProgressActivities: () => AnticipationActivity[];
  getCompletedActivities: () => AnticipationActivity[];
  getTotalAvailable: () => number;
  getTotalInProgress: () => number;
  getTotalCompleted: () => number;
  calculateAnticipationDetails: (amount: number, days: number) => {
    grossValue: number;
    serviceCost: number;
    anticipationFee: string;
    anticipatedValue: number;
    totalCost: number;
  };
}

const AnticipationContext = createContext<AnticipationContextType | undefined>(undefined);

export const useAnticipation = () => {
  const context = useContext(AnticipationContext);
  if (!context) {
    throw new Error('useAnticipation must be used within an AnticipationProvider');
  }
  return context;
};

interface AnticipationProviderProps {
  children: React.ReactNode;
}

export const AnticipationProvider: React.FC<AnticipationProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<AnticipationActivity[]>(() => {
    const savedActivities = localStorage.getItem('anticipation_activities');
    return savedActivities ? JSON.parse(savedActivities) : [
      {
        id: "1",
        amount: 800,
        title: "Consulta Cardiológica",
        category: "Cardiologia",
        patientName: "Maria Silva",
        date: "30/10/2024",
        receiveInDays: 30,
        status: 'available'
      },
      {
        id: "2",
        amount: 1200,
        title: "Exame Laboratorial",
        category: "Laboratório",
        patientName: "João Santos",
        date: "25/10/2024",
        receiveInDays: 45,
        status: 'available'
      },
      {
        id: "3",
        amount: 2500,
        title: "Procedimento Cirúrgico",
        category: "Cirurgia",
        patientName: "Ana Costa",
        date: "20/10/2024",
        receiveInDays: 60,
        status: 'available'
      },
      {
        id: "4",
        amount: 650,
        title: "Consulta de Retorno",
        category: "Cardiologia",
        patientName: "Pedro Lima",
        date: "06/10/2024",
        receiveInDays: 30,
        status: 'available'
      }
    ];
  });

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('anticipation_activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity: Omit<AnticipationActivity, 'id' | 'status'>) => {
    const newActivity: AnticipationActivity = {
      ...activity,
      id: Date.now().toString(),
      status: 'available'
    };

    setActivities(prev => [newActivity, ...prev]);
  };

  const submitAnticipation = async (activityId: string): Promise<boolean> => {
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { 
              ...activity, 
              status: 'in_progress',
              submittedDate: new Date().toLocaleDateString('pt-BR')
            }
          : activity
      ));

      return true;
    } catch (error) {
      console.error('Erro ao submeter antecipação:', error);
      return false;
    }
  };

  const completeAnticipation = async (activityId: string): Promise<boolean> => {
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const activity = activities.find(a => a.id === activityId);
      if (!activity) return false;

      const details = calculateAnticipationDetails(activity.amount, activity.receiveInDays);

      setActivities(prev => prev.map(a => 
        a.id === activityId 
          ? { 
              ...a, 
              status: 'completed',
              completedDate: new Date().toLocaleDateString('pt-BR'),
              receivedAmount: details.anticipatedValue,
              serviceCost: details.serviceCost,
              anticipationFee: details.anticipationFee
            }
          : a
      ));

      return true;
    } catch (error) {
      console.error('Erro ao completar antecipação:', error);
      return false;
    }
  };

  const cancelAnticipation = async (activityId: string): Promise<boolean> => {
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, status: 'cancelled' }
          : activity
      ));

      return true;
    } catch (error) {
      console.error('Erro ao cancelar antecipação:', error);
      return false;
    }
  };

  const getAvailableActivities = () => {
    return activities.filter(activity => activity.status === 'available');
  };

  const getInProgressActivities = () => {
    return activities.filter(activity => activity.status === 'in_progress');
  };

  const getCompletedActivities = () => {
    return activities.filter(activity => activity.status === 'completed');
  };

  const getTotalAvailable = () => {
    return getAvailableActivities().reduce((sum, activity) => sum + activity.amount, 0);
  };

  const getTotalInProgress = () => {
    return getInProgressActivities().reduce((sum, activity) => sum + activity.amount, 0);
  };

  const getTotalCompleted = () => {
    return getCompletedActivities().reduce((sum, activity) => sum + (activity.receivedAmount || 0), 0);
  };

  const calculateAnticipationDetails = (amount: number, days: number) => {
    const grossValue = amount;
    const serviceCost = Math.round(grossValue * 0.03); // 3% service cost
    const anticipationFee = "3% a.m.";
    const anticipatedValue = grossValue - serviceCost;
    const totalCost = serviceCost;

    return {
      grossValue,
      serviceCost,
      anticipationFee,
      anticipatedValue,
      totalCost
    };
  };

  const value: AnticipationContextType = {
    activities,
    addActivity,
    submitAnticipation,
    completeAnticipation,
    cancelAnticipation,
    getAvailableActivities,
    getInProgressActivities,
    getCompletedActivities,
    getTotalAvailable,
    getTotalInProgress,
    getTotalCompleted,
    calculateAnticipationDetails
  };

  return (
    <AnticipationContext.Provider value={value}>
      {children}
    </AnticipationContext.Provider>
  );
};
