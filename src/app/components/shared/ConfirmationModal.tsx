import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from '@mui/material'
import { AlertTriangle } from 'lucide-react'
import { useTheme } from '@mui/material/styles'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  itemName: string
  itemType: string
  isDeleting?: boolean
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão',
  itemName,
  itemType,
  isDeleting = false
}: ConfirmationModalProps) {
  const theme = useTheme()

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 2
          }}>
          <Box
            className="bg-kai-primary/10"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              borderRadius: '50%',
              padding: 2
            }}>
            <AlertTriangle size={28} className="text-kai-primary" />
          </Box>
        </Box>
        <Typography variant='h6' align='center' sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant='body2' align='center' sx={{ color: theme.palette.text.secondary }}>
          Tem certeza que deseja excluir o {itemType}{' '}
          <span
            style={{
              fontWeight: 'bold',
              color: theme.palette.text.primary
            }}>
            {itemName}
          </span>
          ? Esta ação não poderá ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            padding: 1,
            gap: 1
          }}>
          <Button
            onClick={onClose}
            disabled={isDeleting}
            sx={(theme) => ({
              backgroundColor: theme.palette.mode === 'light' ? "#fff" : "#0b0e14",
              border: "1px solid #e5e7eb"
            })}
            className="text-kai-primary transition-colors hover:bg-kai-primary/10"
          >
            <Typography>Cancelar</Typography>
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-kai-primary hover:bg-kai-primary/70"
          >
            <Typography sx={(theme) => ({
              color: theme.palette.mode === 'light' ? '#fff' : '#000'
            })}>
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Typography>
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
