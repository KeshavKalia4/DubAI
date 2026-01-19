/**
 * useConfirmDialog Hook
 *
 * Custom hook for managing confirmation dialog state.
 * Eliminates repetitive state + handler pairs for dialogs.
 *
 * @example
 * const deleteDialog = useConfirmDialog(() => {
 *   deleteItem(id);
 * });
 *
 * // In JSX:
 * <button onClick={deleteDialog.open}>Delete</button>
 * <ConfirmDialog
 *   open={deleteDialog.isOpen}
 *   onConfirm={deleteDialog.confirm}
 *   onCancel={deleteDialog.cancel}
 * />
 */

'use client';

import { useState } from 'react';

export interface UseConfirmDialogReturn {
  /** Whether the dialog is currently open */
  isOpen: boolean;
  /** Open the dialog (optionally stop event propagation) */
  open: (e?: React.MouseEvent) => void;
  /** Confirm the action and close the dialog */
  confirm: () => void;
  /** Cancel the action and close the dialog */
  cancel: () => void;
}

/**
 * Hook for managing confirmation dialog state
 *
 * @param onConfirm - Callback to execute when user confirms
 * @param onCancel - Optional callback to execute when user cancels
 * @returns Dialog state and handlers
 */
export function useConfirmDialog(
  onConfirm: () => void,
  onCancel?: () => void
): UseConfirmDialogReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(true);
  };

  const confirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const cancel = () => {
    onCancel?.();
    setIsOpen(false);
  };

  return { isOpen, open, confirm, cancel };
}
