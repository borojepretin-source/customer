export enum CameraType {
  FRONT = 'FRONT',
  BACK = 'BACK',
  USB_EXTERNAL = 'USB_EXTERNAL',
}

export interface ICameraService {
  getAvailableCameras(): Promise<any[]>;
  checkUvcCameraConnected(): Promise<boolean>;
  initCamera(type: CameraType): Promise<any>;
  capturePhoto(): Promise<Uint8Array | null>;
  dispose(): Promise<void>;
  isUvcConnected: boolean;
}

/**
 * TODO: Implement using MediaDevices API (getUserMedia) and HTML5 video streams.
 */
export class CameraService implements ICameraService {
  isUvcConnected: boolean = false;

  async getAvailableCameras(): Promise<any[]> {
    // TODO: Implement camera listing using navigator.mediaDevices.enumerateDevices()
    throw new Error('Method not implemented in interface-only service. Implement using MediaDevices API.');
  }

  async checkUvcCameraConnected(): Promise<boolean> {
    // TODO: Implement checking for external USB camera connections
    throw new Error('Method not implemented in interface-only service. Implement using MediaDevices API.');
  }

  async initCamera(type: CameraType): Promise<any> {
    // TODO: Bind the camera source to video stream via navigator.mediaDevices.getUserMedia()
    throw new Error('Method not implemented in interface-only service. Implement using MediaDevices API.');
  }

  async capturePhoto(): Promise<Uint8Array | null> {
    // TODO: Capture frame from video element onto dummy canvas and retrieve jpeg data
    throw new Error('Method not implemented in interface-only service. Implement using MediaDevices API.');
  }

  async dispose(): Promise<void> {
    // TODO: Stop all media tracks to free up the webcam hardware resource
    throw new Error('Method not implemented in interface-only service. Implement using MediaDevices API.');
  }
}
