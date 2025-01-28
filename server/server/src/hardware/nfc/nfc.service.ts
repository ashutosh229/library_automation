import { Injectable, Logger } from '@nestjs/common';
import { promisify } from 'util';
import { EventEmitter } from 'events';
import { Observable } from 'rxjs';
import { ErrorHandlerService } from 'src/common/errors/errors.service';
const pcsclite = require('pcsclite');

@Injectable()
export class NFCService {
  private pcsc: any;
  private eventEmitter: EventEmitter;
  private readonly logger = new Logger(NFCService.name);

  private readonly errorHandlerService: ErrorHandlerService;

  constructor() {
    this.pcsc = pcsclite();
    this.eventEmitter = new EventEmitter();
    this.startScanner();
    this.errorHandlerService = new ErrorHandlerService();
  }

  async startScanner() {
    try {
      this.logger.log('startScanner method called');
      this.pcsc.on('reader', async (reader) => {
        this.logger.log(`Reader detected: ${reader.name}`);
        await this.handleReader(reader);
      });

      this.pcsc.on('error', (err) => {
        this.logger.error('PCSC error:', err.message);
        this.handleScannerError(err);
      });

      this.logger.log('NFC Service started');
    } catch (err) {
      console.error('Error starting scanner:', err);
      this.logger.error('Error starting scanner:', err);
      this.handleScannerError(err);
    }
  }

  private async handleReader(reader) {
    this.logger.log(`Handling reader: ${reader.name}`);

    reader.on('error', (err: any) => {
      console.error(`Error(${reader.name}):`, err.message);
      this.logger.error(`Error(${reader.name}):`, err.message);
    });

    reader.on('status', async (status: any) => {
      this.logger.log(
        `Reader status(${reader.name}): ${JSON.stringify(status)}`,
      );

      const changes = reader.state ^ status.state;
      if (changes) {
        if (
          changes & reader.SCARD_STATE_PRESENT &&
          status.state & reader.SCARD_STATE_PRESENT
        ) {
          await this.handleCardInsertion(reader);
        } else if (
          changes & reader.SCARD_STATE_EMPTY &&
          status.state & reader.SCARD_STATE_EMPTY
        ) {
          this.logger.log(`Card removed from ${reader.name}`);
        }
      }
    });

    reader.on('end', () => {
      this.logger.log(`Reader removed: ${reader.name}`);
      this.handleCardRemoval(reader);
    });
  }

  private async handleCardInsertion(reader: any) {
    try {
      this.logger.log(`Handling card insertion for ${reader.name}`);
      const protocol = await promisify(reader.connect.bind(reader))({
        share_mode: reader.SCARD_SHARE_SHARED,
      });

      this.logger.log(`Protocol(${reader.name}): ${protocol}`);

      const uid = await this.getCardUID(reader, protocol);
      this.logger.log(`UID(${reader.name}): ${uid}`);

      this.eventEmitter.emit('cardDetected', uid);

      await promisify(reader.disconnect.bind(reader))(reader.SCARD_LEAVE_CARD);
      this.logger.log(`Disconnected from ${reader.name}.`);
    } catch (err) {
      console.error(`Error handling card insertion:`, err.message);
      this.logger.error(`Error handling card insertion: ${err.message}`);
      this.handleScannerError(err);
    }
  }

  private async getCardUID(reader, protocol) {
    const proto = isNaN(parseInt(protocol, 10)) ? 2 : protocol;
    const apdu = Buffer.from([0x00, 0xa4, 0x08, 0x0c, 0x02, 0x3f, 0x04]);
    const data = await promisify(reader.transmit.bind(reader))(apdu, 40, proto);

    const RB = Buffer.from([0x00, 0xb0, 0x00, 0x00, 0x24]);
    const response = await promisify(reader.transmit.bind(reader))(
      RB,
      40,
      proto,
    );

    const uid = response.slice(9, 17).toString('ascii');
    this.logger.log(`Card UID(${reader.name}): ${uid}`);

    return uid;
  }

  private async handleCardRemoval(reader: any) {
    try {
      this.logger.log(`Handling card removal from ${reader.name}`);
      this.eventEmitter.emit('cardRemoved', reader.name);
    } catch (err) {
      console.error(`Error handling card removal:`, err.message);
      this.logger.error(`Error handling card removal: ${err.message}`);
      this.handleScannerError(err);
    }
  }

  private async handleScannerError(error: any) {
    if (
      error.message.includes('SCardTransmit error') ||
      error.message.includes('SCardConnect error')
    ) {
      this.logger.error('SCard error detected:', error.message);
      // this.restartNFCService();
    } else {
      this.logger.error('General scanner error:', error.message);
    }
  }

  private restartNFCService() {
    this.logger.log('Restarting NFC service...');
    this.pcsc.close();
    this.logger.log('PC/SC closed successfully.');

    this.pcsc = pcsclite();
    this.startScanner();
  }

  onCardDetected(): Observable<string> {
    return new Observable<string>((observer) => {
      this.eventEmitter.on('cardDetected', (cardUid: string) => {
        this.logger.log(`Card detected: ${cardUid}`);
        observer.next(cardUid);
      });
    });
  }

  onCardRemoved(): Observable<string> {
    return new Observable<string>((observer) => {
      this.eventEmitter.on('cardRemoved', (readerName: string) => {
        this.logger.log(`Card removed: ${readerName}`);
        observer.next(readerName);
      });
    });
  }
}
