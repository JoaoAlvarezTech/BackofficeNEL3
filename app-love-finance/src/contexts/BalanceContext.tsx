import React, { createContext, useContext, useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'pix_sent' | 'pix_received' | 'anticipation' | 'receivable' | 'boleto_payment';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  beneficiary?: string;
  documentNumber?: string;
}

interface BalanceContextType {
  balance: number;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  getBalance: () => number;
  getTransactionHistory: () => Transaction[];
  resetBalance: () => void;
  simulatePixTransfer: (amount: number, recipient: string) => Promise<boolean>;
  simulatePixReceive: (amount: number, sender: string) => Promise<boolean>;
  simulateAnticipation: (amount: number, description: string) => Promise<boolean>;
  simulateReceivable: (amount: number, description: string) => Promise<boolean>;
  simulateBoletoPayment: (amount: number, beneficiary: string, documentNumber: string) => Promise<boolean>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

interface BalanceProviderProps {
  children: React.ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem('wallet_balance');
    return savedBalance ? parseFloat(savedBalance) : 1000.00;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('wallet_transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('wallet_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('wallet_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date()
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Atualizar saldo baseado no tipo de transação
    if (transaction.status === 'completed') {
      setBalance(prev => prev + transaction.amount);
    }
  };

  const getBalance = () => balance;

  const getTransactionHistory = () => transactions;

  const resetBalance = () => {
    setBalance(1000.00);
    setTransactions([]);
    localStorage.removeItem('wallet_balance');
    localStorage.removeItem('wallet_transactions');
  };

  const simulatePixTransfer = async (amount: number, recipient: string): Promise<boolean> => {
    if (balance < amount) {
      return false; // Saldo insuficiente
    }

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    addTransaction({
      type: 'pix_sent',
      amount: -amount, // Valor negativo para saída
      description: `PIX enviado - ${recipient}`,
      status: 'completed'
    });

    return true;
  };

  const simulatePixReceive = async (amount: number, sender: string): Promise<boolean> => {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    addTransaction({
      type: 'pix_received',
      amount: amount, // Valor positivo para entrada
      description: `PIX recebido - ${sender}`,
      status: 'completed'
    });

    return true;
  };

  const simulateAnticipation = async (amount: number, description: string): Promise<boolean> => {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    addTransaction({
      type: 'anticipation',
      amount: amount * 0.97, // 3% de taxa
      description: `Antecipação - ${description}`,
      status: 'completed'
    });

    return true;
  };

  const simulateReceivable = async (amount: number, description: string): Promise<boolean> => {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    addTransaction({
      type: 'receivable',
      amount: amount,
      description: `Recebível - ${description}`,
      status: 'completed'
    });

    return true;
  };

  const simulateBoletoPayment = async (amount: number, beneficiary: string, documentNumber: string): Promise<boolean> => {
    if (balance < amount) {
      return false; // Saldo insuficiente
    }

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    addTransaction({
      type: 'boleto_payment',
      amount: -amount, // Valor negativo para saída
      description: `Pagamento de Boleto - ${beneficiary}`,
      status: 'completed',
      beneficiary: beneficiary,
      documentNumber: documentNumber
    });

    return true;
  };

  const value: BalanceContextType = {
    balance,
    transactions,
    addTransaction,
    getBalance,
    getTransactionHistory,
    resetBalance,
    simulatePixTransfer,
    simulatePixReceive,
    simulateAnticipation,
    simulateReceivable,
    simulateBoletoPayment
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
};
