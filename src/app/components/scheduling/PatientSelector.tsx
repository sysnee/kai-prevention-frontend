'use client'

import { useState } from 'react'
import { Search, User, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
    Autocomplete,
    Button,
    TextField,
    Box,
    Typography,
    Stack,
    Avatar,
    CircularProgress
} from '@mui/material'
import api from '@/lib/api'

interface PatientSelectorProps {
    onSelectPatient: (patient: any) => void
    onCreateNew: () => void
}

export interface Patient {
    id: string;
    name: string;
    gender: string;
    email: string;
    phone: string;
    cpf: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
    birthdate: string;
    createdAt: string;
    updatedAt: string;
}


export function PatientSelector({ onSelectPatient, onCreateNew }: PatientSelectorProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<Patient | null>(null)

    const { data: patients = [], isLoading } = useQuery({
        queryKey: ['patients'],
        queryFn: async () => {
            const { data } = await api.get('clients')
            return Array.isArray(data) ? data : []
        }
    })

    return (
        <Stack spacing={2}>
            <Autocomplete
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={value}
                onChange={(_, newValue) => {
                    setValue(newValue)
                    if (newValue) {
                        onSelectPatient(newValue)
                    }
                }}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                getOptionLabel={(option) => option.name || ''}
                options={patients}
                loading={isLoading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Buscar paciente..."
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <Search className="h-4 w-4 text-gray-400 mr-2" />
                            ),
                            endAdornment: (
                                <>
                                    {isLoading ? (
                                        <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                renderOption={(props, option, state) => {
                    const { key, ...otherProps } = props

                    return (
                        <Box
                            component="li"
                            {...otherProps}
                            key={option.id}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                                    <User className="h-4 w-4" />
                                </Avatar>
                                <Box>
                                    <Typography variant="body1">
                                        {option.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {option.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )
                }}
                noOptionsText={
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Nenhum paciente encontrado
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Plus />}
                            onClick={() => {
                                setOpen(false)
                                onCreateNew()
                            }}
                            fullWidth
                        >
                            Cadastrar novo paciente
                        </Button>
                    </Box>
                }
            />

            <Button
                variant="outlined"
                startIcon={<Plus />}
                onClick={onCreateNew}
                fullWidth
            >
                Cadastrar novo paciente
            </Button>
        </Stack>
    )
} 