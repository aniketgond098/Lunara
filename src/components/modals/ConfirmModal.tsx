import React from 'react';
import { Modal } from '../ui/Modal';
import { AlertTriangle, Trash2, RotateCcw } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title: string;
  subtitle?: string;
  itemName?: string;
  message: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  icon?: 'trash' | 'alert' | 'reset';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  subtitle = 'CELESTIAL CONFIRMATION',
  itemName,
  message,
  confirmText,
  confirmLabel,
  cancelText,
  cancelLabel,
  isDestructive = true,
  icon = 'trash',
}) => {
  const handleDismiss = () => {
    if (typeof onClose === 'function') {
      onClose();
    } else if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    handleDismiss();
  };

  const effectiveConfirmText = confirmLabel || confirmText || 'CONFIRM';
  const effectiveCancelText = cancelLabel || cancelText || 'CANCEL';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleDismiss}
      title={title}
      subtitle={subtitle}
      maxWidth="sm"
    >
      <div className="space-y-4 text-xs font-sans">
        <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#090d22] border border-[#a78bfa]/20">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isDestructive
                ? 'bg-rose-950/60 border border-rose-500/40 text-rose-400'
                : 'bg-amber-950/60 border border-amber-500/40 text-amber-400'
            }`}
          >
            {icon === 'reset' ? (
              <RotateCcw className="w-5 h-5" />
            ) : icon === 'trash' ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1 min-w-0">
            {itemName && (
              <div className="text-white font-bold text-sm truncate font-['Cinzel',serif]">
                {itemName}
              </div>
            )}
            <p className="text-slate-300 leading-relaxed text-xs">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#a78bfa]/20">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2 rounded-xl bg-[#0f1430] hover:bg-[#1a214d] text-slate-300 text-xs transition-colors cursor-pointer border border-[#a78bfa]/25"
          >
            {effectiveCancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-['Cinzel',serif] ${
              isDestructive
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            }`}
          >
            {effectiveConfirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
