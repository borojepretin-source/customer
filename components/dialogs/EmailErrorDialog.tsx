import Modal from '../ui/Modal';
import PrimaryButton from '../ui/PrimaryButton';
import SecondaryButton from '../ui/SecondaryButton';
import Typography from '../ui/Typography';
import { MailX } from 'lucide-react';

interface EmailErrorDialogProps {
  open: boolean;
  onRetry: () => void;
  onSkip: () => void;
  error: string;
}

export default function EmailErrorDialog({ open, onRetry, onSkip, error }: EmailErrorDialogProps) {
  return (
    <Modal open={open} persistent title="Gagal Mengirim Email" onClose={onSkip}>
      <div className="flex flex-col items-center gap-5 text-center p-2">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/30 text-red-500"
        >
          <MailX size={32} />
        </div>
        <div className="space-y-2">
          <Typography variant="body" className="text-white/95">
            Maaf, pengiriman email gagal dilakukan.
          </Typography>
          <Typography variant="caption" className="text-red-400 block max-h-24 overflow-y-auto px-2 py-1 bg-red-950/20 rounded border border-red-500/10 select-text">
            {error}
          </Typography>
          <Typography variant="caption" className="text-white/40 block mt-2">
            Anda dapat mencoba mengirim ulang atau melewati langkah ini.
          </Typography>
        </div>
        <div className="flex flex-col gap-2.5 w-full mt-2">
          <PrimaryButton size="md" fullWidth onClick={onRetry}>
            COBA LAGI
          </PrimaryButton>
          <SecondaryButton size="sm" fullWidth onClick={onSkip}>
            LEWATI & CETAK FOTO
          </SecondaryButton>
        </div>
      </div>
    </Modal>
  );
}
