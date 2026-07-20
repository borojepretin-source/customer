import Modal from '../ui/Modal';
import PrimaryButton from '../ui/PrimaryButton';
import Typography from '../ui/Typography';
import { MailCheck } from 'lucide-react';

interface EmailSuccessDialogProps {
  open: boolean;
  onConfirm: () => void;
  email: string;
}

export default function EmailSuccessDialog({
  open,
  onConfirm,
  email,
}: EmailSuccessDialogProps) {
  return (
    <Modal
      open={open}
      persistent
      title="Email Terkirim!"
      onClose={onConfirm}
    >
      <div className="flex flex-col items-center text-center px-2 py-3">

        {/* Icon */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-green-100 border border-green-300 mb-6">
          <MailCheck size={38} className="text-green-600" />
        </div>

        {/* Title */}
        <Typography
          variant="label"
          className="text-2xl font-bold text-black mb-3"
        >
          Email Berhasil Dikirim 🎉
        </Typography>

        {/* Description */}
        <Typography
          variant="body"
          className="text-black/70 leading-relaxed max-w-sm"
        >
          Foto hasil sesi Anda telah berhasil dikirim ke alamat email berikut:
        </Typography>

        {/* Email */}
        <Typography
          variant="body"
          className="mt-4 text-[#E6007A] font-bold text-lg break-all"
        >
          {email}
        </Typography>

        {/* Footer text */}
        <Typography
          variant="caption"
          className="mt-4 text-black/50 leading-relaxed max-w-sm"
        >
          Silakan periksa folder <b>Inbox</b>.
          Jika belum ditemukan, cek juga folder <b>Spam</b> atau <b>Promotions</b>.
        </Typography>

        {/* Button */}
        <PrimaryButton
          size="md"
          fullWidth
          onClick={onConfirm}
          className="mt-8"
        >
          OK, LANJUT
        </PrimaryButton>
      </div>
    </Modal>
  );
}