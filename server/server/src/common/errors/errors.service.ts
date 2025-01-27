import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
  private readonly logger = new Logger(ErrorHandlerService.name);

  handleError(error: Error) {
    if (
      error.message.includes('Third argument must be an integer') ||
      error.message.includes('SCardGetStatusChange') ||
      error.message.includes(
        'The specified reader is not currently available for use',
      )
    ) {
      this.logger.error('Detected error condition, restarting application');
    } else {
      this.logger.error('error here');
    }
  }
}
