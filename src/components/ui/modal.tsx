import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    "relative z-10 w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200",
                    className
                )}
                style={{
                    background: 'var(--card-bg-solid)',
                    borderColor: 'var(--card-border)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                }}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'default'
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = 'default'
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{message}</p>
            <div className="flex gap-3 justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    {cancelText}
                </button>
                <button
                    onClick={handleConfirm}
                    className={cn(
                        "px-4 py-2 rounded-xl font-medium text-white transition-colors",
                        variant === 'danger'
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-primary hover:bg-primary/90"
                    )}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    )
}
