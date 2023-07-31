import { Injectable } from '@nestjs/common';
import { TransactionDTO } from './entities/transaction.dto';
import { KafkaService } from '../shared/kafka/kafka.service';
import { TransactionPresenter } from './entities/transaction.presenter';
import { APPROVED, REJECTED } from './entities/transaction-status';

@Injectable()
export class TransactionService {
  private static MIN_VALID_TRANSACTION = 1000;
  constructor(private readonly kafkaService: KafkaService) {}

  processNewTransaction(transaction: TransactionDTO) {
    const transactionStatus =
      transaction.value > TransactionService.MIN_VALID_TRANSACTION
        ? REJECTED
        : APPROVED;

    this.kafkaService.sendMessage(
      'transactions-processed',
      new TransactionPresenter(
        transaction.transactionExternalId,
        transactionStatus,
      ),
    );
  }
}
