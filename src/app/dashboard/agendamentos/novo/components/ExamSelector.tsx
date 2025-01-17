import React, { useState } from 'react';
import { Search, AlertCircle, Info, AlertTriangleIcon } from 'lucide-react';
import { examsList } from '@/app/data/exams';
import { useTheme } from '@mui/material';

interface ExamSelectorProps {
  selectedExam: any;
  onExamSelect: (exam: any) => void;
}

export function ExamSelector({ selectedExam, onExamSelect }: ExamSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const theme = useTheme();

  const categories = Array.from(new Set(examsList.map(exam => exam.category)));

  const filteredExams = examsList.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || exam.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar exames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent"
            style={{
              border: theme.palette.mode === 'light' ? "1px solid #e5e7eb" : "1px solid #333b4d"
            }}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <div className="flex-shrink-0">
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-3 py-2 rounded-lg focus:ring-2 focus:ring-kai-primary focus:border-transparent"
            style={{
              border: theme.palette.mode === 'light' ? "1px solid #e5e7eb" : "1px solid #333b4d"
            }}
          >
            <option value="">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExams.map((exam) => (
          <button
            key={exam.id}
            data-testid="exam-option"
            onClick={() => onExamSelect(exam)}
            className={`text-left p-4 rounded-xl transition-all ${selectedExam?.id === exam.id
              ? 'ring-2 ring-kai-primary bg-kai-primary/10'
              : theme.palette.mode === 'light' ? 'border-gray-200 bg-white hover:bg-kai-primary/10' :
                'border-gray-200 hover:bg-kai-primary/10'
              }`}
            style={{
              border: theme.palette.mode === 'light' ? "1px solid #e5e7eb" : "1px solid #333b4d"
            }}
          >
            <div className="flex items-start">
              {/* <img
                src={exam.image}
                alt={exam.name}
                className="w-20 h-20 object-cover rounded-lg"
              /> */}
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-gray-500">{exam.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {exam.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <AlertTriangleIcon className="w-4 h-4 mr-1 text-kai-primary" />
                    Requer preparação prévia
                  </div>
                  <span className="font-medium text-kai-primary">
                    R$ ---,--
                  </span>
                </div>
              </div>
            </div>
            {exam.preparation && (
              <div
                className="mt-3 flex items-start text-sm text-gray-500 rounded-lg p-3"
                style={{
                  border: theme.palette.mode === 'light' ? "1px solid #e5e7eb" : "1px solid #333b4d",
                  backgroundColor: theme.palette.mode === 'light' ? "#f9fafb" : "#111827"
                }}
              >
                <AlertCircle className="w-5 h-5 text-kai-primary mr-2 flex-shrink-0" />
                <p>Modalidades: {exam.duration}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum exame encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar seus filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
}