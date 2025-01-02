import React, { useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import { Patient, PatientSelector } from './PatientSelector'
import { Button, Stack } from '@mui/material'
import { UserPlus, Users } from 'lucide-react'
import { useTheme } from '@mui/material';

interface PatientFormProps {
  onSubmit: (data: any) => void;
  mode?: 'create' | 'select'
}

interface AddressData {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
  number: string;
}

interface PatientFormData {
  id?: string;
  name: string;
  birthDate: string;
  gender: string;
  cpf: string;
  email: string;
  phone: string;
  address?: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

export function PatientForm({ onSubmit, mode = 'select' }: PatientFormProps) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '',
    cpf: '',
    email: '',
    phone: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    }
  });
  const [done, setDone] = useState(false)

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  const [currentMode, setCurrentMode] = useState<'create' | 'select'>(mode)
  const [showForm, setShowForm] = useState(mode === 'create')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatCEP = (cep: string) => {
    return cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');

    // Update the CEP field with formatted value
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        cep: formatCEP(cep)
      }
    }));

    // Only proceed with API call if CEP has 8 digits
    if (cep.length === 8) {
      setIsLoadingCep(true);
      setCepError('');

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          setCepError('CEP não encontrado');
          return;
        }

        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            complement: data.complemento || prev.address.complement
          }
        }));
      } catch (error) {
        setCepError('Erro ao buscar CEP');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true)
    onSubmit(formData);
  };

  const handleSelectPatient = (patient: Patient) => {
    // Converter dados do paciente existente para o formato esperado
    const formattedData: PatientFormData = {
      id: patient.id,
      name: patient.name,
      birthDate: patient.birthdate,
      gender: patient.gender,
      cpf: patient.cpf,
      email: patient.email,
      phone: patient.phone,
      address: {
        cep: patient.zipcode,
        street: patient.street,
        number: patient.number,
        complement: patient.complement,
        neighborhood: patient.neighborhood,
        city: patient.city,
        state: patient.state
      }
    }
    onSubmit(formattedData)
  }

  const handleCreateNew = () => {
    setCurrentMode('create')
    setShowForm(true)
  }

  const handleSwitchToSelect = () => {
    setCurrentMode('select')
    setShowForm(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-lg shadow p-6 space-y-6"
        style={{
          border: theme.palette.mode === 'light' ? "1px solid #e5e7eb" : "1px solid #333b4d",
          backgroundColor: theme.palette.mode === 'light' ? "#fff" : "#111827"
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-kai-primary/10 rounded-lg">
              <User className="w-6 h-6 text-kai-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-500">
                {currentMode === 'create' ? 'Novo Paciente' : 'Selecionar Paciente'}
              </h3>
              <p className="text-sm text-gray-500">
                {currentMode === 'create'
                  ? 'Preencha os dados do novo paciente'
                  : 'Selecione um paciente existente ou cadastre um novo'
                }
              </p>
            </div>
          </div>

          <Stack direction="row" spacing={1}>
            <Button
              className={`${currentMode === 'select' ? `bg-kai-primary hover:bg-kai-primary/70 ${theme.palette.mode === 'light' ? 'text-white' : 'text-black'}` : 'text-gray-400 hover:bg-kai-primary/10'}`}
              style={{
                border: theme.palette.mode === 'light' ? "1px solid #e5e7eb" : "1px solid #333b4d",
              }}
              onClick={handleSwitchToSelect}
              startIcon={<Users />}
            >
              Selecionar
            </Button>
            <Button
              className={`${currentMode === 'create' ? `bg-kai-primary hover:bg-kai-primary/70 ${theme.palette.mode === 'light' ? 'text-white' : 'text-black'}` : 'text-gray-400 hover:bg-kai-primary/10'}`}
              style={{
                border: theme.palette.mode === 'light' ? "1px solid #e5e7eb" : "1px solid #333b4d",
              }}
              onClick={handleCreateNew}
              startIcon={<UserPlus />}
            >
              Novo
            </Button>
          </Stack>
        </div>

        {currentMode === 'select' ? (
          <PatientSelector
            onSelectPatient={handleSelectPatient}
            onCreateNew={handleCreateNew}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gênero
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-2">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Endereço</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address.cep"
                        value={formData.address.cep}
                        onChange={handleCEPChange}
                        maxLength={9}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="00000-000"
                      />
                      {isLoadingCep && (
                        <div className="absolute right-2 top-2">
                          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    {cepError && (
                      <p className="mt-1 text-sm text-red-600">{cepError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      name="address.number"
                      value={formData.address.number}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rua
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="address.complement"
                      value={formData.address.complement}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      name="address.neighborhood"
                      value={formData.address.neighborhood}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-kai-primary hover:bg-kai-primary/70"
                style={{
                  color: theme.palette.mode === 'light' ? "#fff" : "#000"
                }}
                disabled={done}
              >
                {done ? 'Salvo!' : 'Salvar'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}