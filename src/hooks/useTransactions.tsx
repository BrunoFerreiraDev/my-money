import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from '../services/api';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>//pega os campos do Transaction menos id e createdAt

interface TransactionProviderProps {
    children: ReactNode;
}

interface TransactionContextData {
    transactions: Transaction[];
    createTransaction: (createTransaction: TransactionInput) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextData>(
    {} as TransactionContextData
);

export function TransactionsProvider({ children }: TransactionProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    useEffect(() => {
        api.get('transactions')
            //@ts-ignore
            .then((response) => setTransactions(response.data.transactions))

    }, []);

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date()
        })
        //@ts-ignore
        const { transaction } = response.data

        setTransactions([
            ...transactions,
            transaction
        ])
    }

    return (
        <TransactionContext.Provider value={{ transactions, createTransaction }} >
            {children}
        </TransactionContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionContext)

    return context;
}