"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogHeader,
    AlertDialogTrigger, AlertDialogFooter, AlertDialogCancel
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
    children: React.ReactNode;
    onConfirm: () => void;
}

export function ConfirmModal({children, onConfirm}: ConfirmModalProps) {

  return (
    <AlertDialog>
        <AlertDialogTrigger>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
                This action cannot be undone.
            </AlertDialogDescription>
            <AlertDialogFooter>
                <AlertDialogAction onClick={onConfirm}>
                    Confirm
                </AlertDialogAction>
                <AlertDialogCancel>
                    Cancel
                </AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}
