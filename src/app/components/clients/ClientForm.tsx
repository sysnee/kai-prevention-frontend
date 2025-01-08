import React, { useEffect, useState } from 'react';
import { X, Save, User, Send, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { QuestionnaireAnswersModal } from './QuestionnaireAnswersModal';
import toast from 'react-hot-toast';
import { useTheme } from '@mui/material';
import BirthdateInput from './BirthdateInput';
import { Button, Typography } from '@mui/material';
import { clientSchema, type ClientSchema } from '../../../lib/schemas/client'
import { z } from 'zod'

interface Client {
  id?: string
  name: string
  birthdate: string
  gender: 'male' | 'female' | 'other'
  cpf: string
  phone: string
  email: string
  zipcode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  questionnaires?: Array<any>
}

interface ClientFormProps {
  client?: any
  onSubmit: (data: any) => Promise<void>
  onCancel?: () => void
  readOnly?: boolean
  formErrors?: {
    cpf?: string
    email?: string
  }
  isSubmitting?: boolean
}

export function ClientForm({
  client,
  onSubmit,
  onCancel,
  readOnly = false,
  formErrors = {},
  isSubmitting = false
}: ClientFormProps) {
  const theme = useTheme();
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<any>(null);

  const formatCEP = (cep: string) => {
    return cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };


  const formatPhone = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const phoneFormatted = client?.phone ? formatPhone(client.phone) : '';
  const cpfFormatted = client?.cpf ? formatCPF(client.cpf) : '';
  const zipcodeFormatted = client?.zipcode ? formatCEP(client.zipcode) : '';

  const [formData, setFormData] = useState<Client>({
    // Personal Information
    name: client?.name || '',
    birthdate: client?.birthdate || '',
    gender: (client?.gender || 'other') as 'male' | 'female' | 'other',
    cpf: cpfFormatted,

    // Contact Information
    phone: phoneFormatted,
    email: client?.email || '',
    zipcode: zipcodeFormatted,
    street: client?.street || '',
    number: client?.number || '',
    complement: client?.complement || '',
    neighborhood: client?.neighborhood || '',
    city: client?.city || '',
    state: client?.state || '',
  });


  const handleResendQuestionnaire = async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Link do questionário reenviado com sucesso');
    } catch (error) {
      toast.error('Erro ao reenviar questionário');
    }
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;

    const zipcode = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      zipcode: formatCEP(zipcode)
    }));

    if (zipcode.length === 8) {
      setIsLoadingCep(true);
      setCepError('');

      try {
        const response = await fetch(`https://viacep.com.br/ws/${zipcode}/json/`);
        const data = await response.json();

        if (data.erro) {
          setCepError('CEP não encontrado');
          return;
        }

        setFormData(prev => ({
          ...prev,
          city: data.localidade,
          state: data.uf,
        }));
      } catch (error) {
        setCepError('Erro ao buscar CEP');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (readOnly) return;

    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const removeFormatting = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedData = {
      ...formData,
      zipcode: removeFormatting(formData.zipcode),
      cpf: removeFormatting(formData.cpf),
      phone: removeFormatting(formData.phone),
    }

    console.log(cleanedData)
    await onSubmit(cleanedData)
  }

  const renderQuestionnaireHistory = () => {
    if (!client?.questionnaires?.length) return null;

    return (
      <div className="col-span-2">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Histórico de Questionários</h3>
            <button
              type="button"
              onClick={() => handleResendQuestionnaire(formData.email)}
              className="px-4 py-2 bg-kai-primary text-white rounded-lg hover:bg-kai-primary/90 flex items-center text-sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Reenviar Questionário
            </button>
          </div>

          <div className="space-y-4">
            {client.questionnaires.map((questionnaire: any) => (
              <div
                key={questionnaire.id}
                className={`p-4 rounded-lg border ${questionnaire.status === 'completed'
                  ? 'border-green-200 bg-green-50'
                  : 'border-amber-200 bg-amber-50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {questionnaire.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {questionnaire.status === 'completed' ? 'Questionário Preenchido' : 'Questionário Pendente'}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {questionnaire.date}
                      </div>
                    </div>
                  </div>
                  {questionnaire.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => setSelectedQuestionnaire(questionnaire)}
                      className="px-3 py-1 text-sm text-kai-primary bg-white rounded-md hover:bg-kai-primary/10"
                    >
                      Ver Respostas
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: theme.palette.background.default
        }}
      >
        <div className="p-6 flex justify-between items-center"
          style={{
            borderBottom: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
          }}
        >
          <h2 className="text-xl font-semibold">
            {readOnly ? 'Detalhes do Cliente' : client ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-kai-primary hover:bg-kai-primary/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Informações Pessoais */}
              <div className="col-span-2 p-4 rounded-lg"
                style={{
                  border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                }}
              >
                <h3 className="text-lg font-medium mb-4">Informações Pessoais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                  </div>

                  <div>
                    <BirthdateInput
                      value={formData.birthdate}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, birthdate: value }))
                      }
                      readOnly={readOnly}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Gênero
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      disabled={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                        backgroundColor: theme.palette.mode == 'light' ? 'white' : '#3b3b3b',
                      }}
                    >
                      <option value="">Selecione</option>
                      <option value="male">Masculino</option>
                      <option value="female">Feminino</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      required
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: formErrors.cpf
                          ? "1px solid #dc2626"
                          : theme.palette.mode === 'light'
                            ? "1px solid rgba(229,231,235,255)"
                            : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                    {formErrors.cpf && <p className="mt-1 text-sm text-red-600">{formErrors.cpf}</p>}
                  </div>
                </div>
              </div>

              {/* Contato e Endereço */}
              <div className="col-span-2 p-4 rounded-lg"
                style={{
                  border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                }}
              >
                <h3 className="text-lg font-medium mb-4">Contato</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: formErrors.email
                          ? "1px solid #dc2626"
                          : theme.palette.mode === 'light'
                            ? "1px solid rgba(229,231,235,255)"
                            : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.zipcode}
                      onChange={handleCEPChange}
                      required
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                    {cepError && <p className="mt-1 text-sm text-red-600">{cepError}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      required
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Rua
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complement"
                      value={formData.complement}
                      onChange={handleChange}
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      required
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-mediummb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      readOnly={readOnly}
                      className={`w-full px-3 py-2 rounded-md ${readOnly ? '' : 'focus:ring-2 focus:ring-kai-primary focus:border-transparent'
                        }`}
                      style={{
                        border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Histórico de Questionários */}
              {renderQuestionnaireHistory()}
            </div>
          </div>

          <div className="p-6"
            style={{
              borderTop: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
            }}
          >
            <div className="flex justify-end space-x-3">
              <Button
                onClick={onCancel}
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === 'light' ? "#fff" : "#0b0e14",
                  border: "1px solid #e5e7eb"
                })}
                className="text-kai-primary transition-colors hover:bg-kai-primary/10"
              >
                <Typography>
                  {readOnly ? 'Fechar' : 'Cancelar'}
                </Typography>
              </Button>
              {!readOnly && (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-kai-primary hover:bg-kai-primary/70"
                  style={{
                    color: theme.palette.mode === 'light' ? '#fff' : '#000'
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
      {selectedQuestionnaire && (
        <QuestionnaireAnswersModal
          questionnaire={selectedQuestionnaire}
          onClose={() => setSelectedQuestionnaire(null)}
        />
      )}
    </div>
  );
}


