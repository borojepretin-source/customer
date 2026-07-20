export enum PrinterStatus {
  NOT_DETECTED = 'NOT_DETECTED',
  READY = 'READY',
  PRINTING = 'PRINTING',
  ERROR = 'ERROR',
}

export interface IPrintService {
  checkPrinterStatus(): Promise<PrinterStatus>;
  printPhoto(params: { imageBytes: Uint8Array; jobName?: string }): Promise<boolean>;
  getAvailablePrinters(): Promise<any[]>;
}

/**
 * TODO: Implement using window.print() or Web Print APIs inside the UI layer.
 */
export class PrintService implements IPrintService {
  async checkPrinterStatus(): Promise<PrinterStatus> {
    // TODO: Detect printer status (stub/mock on web client)
    throw new Error('Method not implemented in interface-only service. Implement using window.print() or client print options.');
  }

  async printPhoto(params: { imageBytes: Uint8Array; jobName?: string }): Promise<boolean> {
    // TODO: Open printable canvas/document and invoke window.print()
    throw new Error('Method not implemented in interface-only service. Implement using window.print() or client print options.');
  }

  async getAvailablePrinters(): Promise<any[]> {
    // TODO: Query list of printers if client supports native print extension
    throw new Error('Method not implemented in interface-only service. Implement using window.print() or client print options.');
  }
}
