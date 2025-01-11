import React from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from '@mui/material';
import { WORKFLOW_STAGES } from '../WorkflowBoard';
import { stages } from '@/app/constants';

interface TimelineSectionProps {
  currentStage: string;
}

function StatusIcon({ icon: Icon }) {
  return (
    <Icon className={`w-5 h-5 text-white`} />
  )
}

export function TimelineSection({ currentStage }: TimelineSectionProps) {
  const theme = useTheme();

  const currentIndex = stages.findIndex(stage => stage.id === currentStage);

  return (
    <div
      style={{
        color: theme.palette.text.primary
      }}
    >
      <h3 className="text-lg font-medium mb-4">Linha do Tempo</h3>
      <div className="relative">
        {/* Linha de progresso base */}
        <div className={`absolute top-4 left-0 w-full h-0.5 
         ${theme.palette.mode === 'light' ? 'bg-gray-300' : 'bg-gray-500'}`}>

        </div>

        {/* Linha de progresso preenchida */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-blue-600 transition-all duration-500"
        />

        {/* Estágios */}
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const isActive = index <= currentIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${isActive ? theme.palette.mode === 'dark' ? 'bg-kai-primary' : 'bg-kai-primary' :
                      theme.palette.mode === 'dark' ? 'bg-gray-500' : 'bg-gray-200'}
                  `}
                >
                  {/* <Icon className="w-4 h-4 text-white" /> */}
                  <StatusIcon icon={WORKFLOW_STAGES.find(st => st.id === stage.id).icon} />
                </div>
                <span className={`
                  mt-2 text-xs font-medium
                  ${theme.palette.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  {stage.label}
                </span>
                <span className={`mt-1 text-xs
                  ${theme.palette.mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  {/* {stage.time} */}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}