import React, { useState } from 'react';
import { X, Upload, Save } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import api from '@/lib/api';

interface MedicalPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    doctorName: string;
    crm: string;
    phone?: string;
    fileUrl?: string;
  }) => void;
}

export function MedicalPrescriptionModal({ isOpen, onClose, onSave }: MedicalPrescriptionModalProps) {
  const [formData, setFormData] = useState({
    doctorName: '',
    crm: '',
    phone: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('fileName', selectedFile.name);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        body: formData,
        // Não defina o cabeçalho 'Content-Type', o navegador fará isso automaticamente
      });
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileUrl = await handleUpload();
    if (fileUrl) {
      onSave({
        ...formData,
        fileUrl,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="rounded-lg p-6 max-w-md w-full mx-4"
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Pedido Médico</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Médico
            </label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kai-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              CRM
            </label>
            <input
              type="text"
              name="crm"
              value={formData.crm}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kai-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Telefone (opcional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kai-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Upload do Pedido
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-500" />
                <div className="flex justify-center text-sm">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer border rounded-md font-medium text-kai-primary hover:text-kai-primary/90 focus-within:outline-none"
                  >
                    <span className="text-gray-400">Upload do arquivo</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only text-gray-500"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400">PDF, PNG, JPG até 10MB</p>
              </div>
            </div>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Arquivo selecionado: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-kai-primary border hover:bg-kai-primary/10 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-kai-primary rounded-md hover:bg-kai-primary/70 flex items-center"
              style={{
                color: theme.palette.mode === 'light' ? '#fff' : '#000'
              }}
              disabled={isUploading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isUploading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}