import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface ListTransactionDTO {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): ListTransactionDTO {
    const balance = this.getBalance();
    const { transactions } = this;

    const list = {
      transactions,
      balance,
    };

    return list;
  }

  public getBalance(): Balance {
    if (this.transactions.length > 0) {
      const balanceIncome = this.transactions
        .filter(t => t.type === 'income')
        .reduce(
          (previous, current) => {
            return new Transaction({
              title: previous.title,
              value: previous.value + current.value,
              type: 'income',
            });
          },
          {
            title: '',
            value: 0,
            type: 'income',
          },
        );

      const balanceOutcome = this.transactions
        .filter(t => t.type === 'outcome')
        .reduce(
          (previous, current) => {
            return new Transaction({
              title: previous.title,
              value: previous.value + current.value,
              type: 'outcome',
            });
          },
          {
            title: '',
            value: 0,
            type: 'outcome',
          },
        );

      const balanceTotal = balanceIncome.value - balanceOutcome.value;

      const balance = {
        income: balanceIncome.value,
        outcome: balanceOutcome.value,
        total: balanceTotal,
      };

      return balance;
    }
    return { income: 0, outcome: 0, total: 0 };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
