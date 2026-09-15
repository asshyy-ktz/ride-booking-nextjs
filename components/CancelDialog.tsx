"use client";

interface CancelDialogProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CancelDialog({
  open,
  onConfirm,
  onClose,
}: CancelDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">Cancel this ride?</h2>
        <p className="mt-1 text-sm text-gray-500">
          Your driver is already on the way. Cancelling now may include a
          small cancellation fee on future rides.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Keep ride
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Cancel ride
          </button>
        </div>
      </div>
    </div>
  );
}
