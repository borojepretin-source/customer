import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppConstants } from '../constants/app_constants';
import { SettingsModel } from '../models/settings_model';
import { withRetry, withTimeout } from '../utils/firestore_helpers';

export class SettingsRepository {
  private readonly firestore: Firestore;

  constructor(firestore?: Firestore) {
    this.firestore = firestore || db;
  }

  private get configRef() {
    return doc(this.firestore, AppConstants.colSettings, AppConstants.settingsDocId);
  }

  private get deviceStatusRef() {
    return doc(this.firestore, AppConstants.colSettings, 'device_status');
  }

  /**
   * Fetch settings once. Returns defaults if Firestore is unavailable.
   */
  async getSettings(): Promise<SettingsModel> {
    try {
      const docSnap = await withRetry(
        () => withTimeout(getDoc(this.configRef), 6000, 'Koneksi ke server timeout.'),
        3,
        '[SettingsRepo]'
      );
      if (!docSnap.exists()) return SettingsModel.defaults;
      return SettingsModel.fromFirestore(docSnap.id, docSnap.data());
    } catch (e) {
      console.warn('[SettingsRepo] Failed to fetch settings, using defaults:', e);
      return SettingsModel.defaults;
    }
  }

  /**
   * Real-time stream of settings. Emits defaults if Firestore fails.
   */
  watchSettings(
    onNext: (settings: SettingsModel) => void,
    onError?: (error: Error) => void
  ): () => void {
    return onSnapshot(
      this.configRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          onNext(SettingsModel.defaults);
        } else {
          onNext(SettingsModel.fromFirestore(docSnap.id, docSnap.data()));
        }
      },
      (error) => {
        console.warn('[SettingsRepo.watchSettings] Error, using defaults:', error);
        onNext(SettingsModel.defaults);
        if (onError) onError(error);
      }
    );
  }

  /**
   * Update the status of hardware devices in Firestore.
   */
  async updateDeviceStatus(params: {
    usbCameraConnected: boolean;
    frontCameraReady: boolean;
    firebaseConnected?: boolean;
    internetAvailable?: boolean;
    printerReady?: boolean;
  }): Promise<void> {
    const {
      usbCameraConnected,
      frontCameraReady,
      firebaseConnected,
      internetAvailable,
      printerReady,
    } = params;

    const data: Record<string, any> = {
      usb_camera_connected: usbCameraConnected,
      front_camera_ready: frontCameraReady,
      last_updated: serverTimestamp(),
    };

    if (firebaseConnected !== undefined) data.firebase_connected = firebaseConnected;
    if (internetAvailable !== undefined) data.internet_available = internetAvailable;
    if (printerReady !== undefined) data.printer_ready = printerReady;

    try {
      await withRetry(
        () =>
          withTimeout(
            setDoc(this.deviceStatusRef, data, { merge: true }),
            8000,
            'Koneksi ke server timeout.'
          ),
        3,
        '[SettingsRepo.updateDeviceStatus]'
      );
    } catch (e) {
      console.error('[SettingsRepo.updateDeviceStatus] final failure suppressed:', e);
    }
  }
}
