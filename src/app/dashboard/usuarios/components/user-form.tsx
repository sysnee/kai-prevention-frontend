import React, { useState } from 'react'
import { useTheme } from '@mui/system';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Stack,
  Box,
  FormHelperText
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { OTHER_PROFESSIONAL_ROLES, PROFESSIONAL_TYPES, User } from '@/app/types/user'
import { Role } from '@/app/types/permissions'
import { maskCPF, maskPhone } from '@/app/utils/format'

interface UserFormProps {
  user: User | null
  roles: Role[]
  onCancel: () => void
  onSubmit: (data: User) => Promise<void>
  readOnly?: boolean
  formErrors: { cpf?: string; email?: string }
}

const userFormSchema = z.object({
  fullName: z.string().min(1, 'Nome é obrigatório'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  gender: z.enum(['male', 'female', 'other']),
  cpf: z
    .string()
    .min(14, 'CPF inválido')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  phone: z
    .string()
    .min(15, 'Telefone inválido')
    .regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  status: z.enum(['active', 'inactive']),
  professionalType: z.string().optional(),
  isHealthcareProfessional: z.boolean().optional(),
  isOtherProfessional: z.boolean().optional(),
  registrationNumber: z.string().optional(),
  roleId: z.string().min(1, 'Função é obrigatória')
})

type UserFormData = z.infer<typeof userFormSchema>

export function UserForm({ user, roles, onCancel, onSubmit, readOnly = false, formErrors }: UserFormProps) {
  const [isHealthcareProfessional, setIsHealthcareProfessional] = useState(user?.isHealthcareProfessional ?? false)
  const [isOtherProfessional, setIsOtherProfessional] = useState(!user?.isHealthcareProfessional || false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      birthDate: user?.birthDate ?? '',
      gender: user?.gender ?? 'male',
      cpf: user?.cpf ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
      status: user?.status ?? 'active',
      isHealthcareProfessional: user?.isHealthcareProfessional ?? false,
      isOtherProfessional: !!user?.isHealthcareProfessional,
      professionalType: user?.professionalType,
      registrationNumber: user?.registrationNumber ?? '',
      roleId: String(user?.role?.id || '')
    },
    mode: 'onBlur'
  })

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      const baseUser = {
        fullName: data.fullName,
        birthDate: data.birthDate,
        gender: data.gender,
        cpf: data.cpf,
        phone: data.phone,
        email: data.email,
        status: data.status,
        roleId: +Number(data.roleId),
        isHealthcareProfessional,
        professionalType: data.professionalType,
        registrationNumber: data.registrationNumber
      }

      await onSubmit(baseUser)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  function handleProfessionalTypeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { checked, name } = e.target
    if (name === 'isHealthcareProfessional') {
      setIsHealthcareProfessional(checked)
      if (checked) {
        setIsOtherProfessional(false)
        setValue('professionalType', '')
        setValue('registrationNumber', '')
      }
    } else if (name === 'isOtherProfessional') {
      setIsOtherProfessional(checked)
      if (checked) {
        setIsHealthcareProfessional(false)
        setValue('professionalType', '')
        setValue('registrationNumber', '')
      }
    }
  }

  const theme = useTheme();

  return (
    <Dialog open onClose={onCancel} maxWidth='md' fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogTitle>
          {readOnly ? 'Visualizar Usuário' : user ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name='fullName'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label='Nome Completo'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      InputProps={{
                        readOnly: readOnly
                      }}
                    />
                  )}
                />

                <Controller
                  name='email'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label='Email'
                      fullWidth
                      error={!!error || !!formErrors.email}
                      helperText={error?.message || formErrors.email}
                      InputProps={{
                        readOnly: readOnly
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name='birthDate'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type='date'
                      label='Data de Nascimento'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!error}
                      helperText={error?.message}
                      InputProps={{
                        readOnly: readOnly
                      }}
                    />
                  )}
                />

                <Controller
                  name='gender'
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Gênero</InputLabel>
                      <Select
                        {...field}
                        disabled={readOnly}
                      >
                        <MenuItem value='male'>Masculino</MenuItem>
                        <MenuItem value='female'>Feminino</MenuItem>
                        <MenuItem value='other'>Outro</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name='cpf'
                  control={control}
                  render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      value={value}
                      onChange={e => {
                        const maskedValue = maskCPF(e.target.value)
                        onChange(maskedValue)
                      }}
                      label='CPF'
                      fullWidth
                      error={!!error || !!formErrors.cpf}
                      helperText={error?.message || formErrors.cpf}
                      inputProps={{ maxLength: 14 }}
                      InputProps={{
                        readOnly: readOnly
                      }}
                    />
                  )}
                />

                <Controller
                  name='phone'
                  control={control}
                  render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      value={value}
                      onChange={e => {
                        const maskedValue = maskPhone(e.target.value)
                        onChange(maskedValue)
                      }}
                      label='Telefone'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                      inputProps={{ maxLength: 15 }}
                      InputProps={{
                        readOnly: readOnly
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} readOnly={readOnly}>
                        <MenuItem value='active'>Ativo</MenuItem>
                        <MenuItem value='inactive'>Inativo</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name='roleId'
                  control={control}
                  rules={{ required: 'Função é obrigatória' }}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel>Função</InputLabel>
                      <Select
                        {...field}
                        value={field.value || ''}
                        onChange={e => field.onChange(String(e.target.value))}
                        disabled={readOnly}
                        data-testid="role-select"
                      >
                        {roles.map(role => (
                          <MenuItem key={role.id} value={String(role.id)}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isHealthcareProfessional}
                      onChange={handleProfessionalTypeChange}
                      name='isHealthcareProfessional'
                      disabled={readOnly}
                      data-testid="healthcare-checkbox"
                    />
                  }
                  label='Profissional de Saúde'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isOtherProfessional}
                      onChange={handleProfessionalTypeChange}
                      name='isOtherProfessional'
                      disabled={readOnly}
                      data-testid="other-professional-checkbox"
                    />
                  }
                  label='Outro Profissional'
                />
              </Box>

              {isHealthcareProfessional && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Controller
                    name='professionalType'
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Tipo de Profissional</InputLabel>
                        <Select
                          {...field}
                          value={field.value || ''}
                          defaultValue={field.value || ''}
                          onChange={e => field.onChange(e)}
                          disabled={readOnly}
                          data-testid="professional-type-select"
                        >
                          {PROFESSIONAL_TYPES.map(type => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Controller
                    name='registrationNumber'
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label='Número de Registro'
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        InputProps={{
                          readOnly: readOnly
                        }}
                      />
                    )}
                  />
                </Box>
              )}

              {isOtherProfessional && (
                <Controller
                  name='professionalType'
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Profissional</InputLabel>
                      <Select
                        {...field}
                        value={field.value || ''}
                        defaultValue={field.value || ''}
                        onChange={e => field.onChange(e)}
                        disabled={readOnly}
                        data-testid="professional-type-select"
                      >
                        {OTHER_PROFESSIONAL_ROLES.map(type => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onCancel}
            sx={(theme) => ({
              backgroundColor: theme.palette.mode === 'light' ? "#fff" : "#0b0e14",
              border: "1px solid #e5e7eb"
            })}
            className="text-kai-primary transition-colors hover:bg-kai-primary/10"
          >
            <span className="text-kai-primary">
              {readOnly ? 'Fechar' : 'Cancelar'}
            </span>
          </Button>
          {!readOnly && (
            <Button
              type='submit'
              className="bg-kai-primary hover:bg-kai-primary/70"
              disabled={isSubmitting}
            >
              <span style={{ color: theme.palette.mode === 'light' ? '#fff' : '#000' }}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </span>
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}
