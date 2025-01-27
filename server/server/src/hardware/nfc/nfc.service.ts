import { Injectable, Logger } from '@nestjs/common';
import EventEmitter from 'events';
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
    //start the scanner
    this.errorHandlerService = new ErrorHandlerService();
  }

  async startScanner() {
    try {
    } catch (error) {
      console.log('Error starting the scanner: ', error);
      this.logger.error('Error starting the scanner', error);
      //handleerror for scannner start
    }
  }

  async 
}
