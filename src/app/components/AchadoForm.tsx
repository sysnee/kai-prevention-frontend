import { Check, Close } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  TextareaAutosize,
  Typography,
  useTheme,
  TextField,
  Autocomplete,
  Chip,
  FormLabel,
  CircularProgress
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Imagem } from "@/app/types/types";
import { humanBodyPositions } from "../constants/human-body-positions";
import { Severity } from '@/types/findings'

// Add this common style object for all Autocompletes
const autocompleteStyles = {
  backgroundColor: "transparent",
  '& .MuiOutlinedInput-root': {
    padding: '4px',
    '& .MuiInputBase-input': {
      padding: '7.5px 4px',
      lineHeight: '1.4',
    },
    '& .MuiAutocomplete-endAdornment': {
      '& .MuiButtonBase-root': {
        color: '#FF8046',
        border: 'none',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
          border: 'none'
        },
        '& .MuiSvgIcon-root': {
          fontSize: '1.2rem'
        },
        '&.Mui-disabled': {
          color: 'rgba(0, 0, 0, 0.26)',
          border: 'none',
          backgroundColor: 'transparent'
        }
      },
      '& .MuiAutocomplete-clearIndicator': {
        color: '#FF8046',
        border: 'none',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
          border: 'none'
        }
      }
    }
  },
  '& .MuiFormLabel-root': {
    transform: 'translate(14px, 14px) scale(1)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)',
    }
  }
};

export default function AchadoForm({
  onCancel,
  onSubmit,
  achadoToEdit,
  selectedImage,
  showCheckbox = true,
  isLoading
}: {
  onCancel: () => void,
  onSubmit: (formData: any) => void,
  achadoToEdit?: any,
  selectedImage?: Imagem | null,
  showCheckbox?: boolean,
  isLoading?: boolean
}) {

  const theme = useTheme();
  const [formData, setFormData] = useState<{
    id: string
    titulo: string
    laudoId: string
    imageId: string
    sistema: string
    orgao: string
    patologias: string[]
    patologiasDetalhes: Record<string, {
      descricao: string
      severidade: Severity
    }>
    observacoes: string
  }>({
    id: "",
    titulo: "",
    laudoId: "",
    imageId: "",
    sistema: "",
    orgao: "",
    patologias: [],
    patologiasDetalhes: {},
    observacoes: "",
  });

  const [availableOrgans, setAvailableOrgans] = useState<string[]>([]);
  const [availablePatologies, setAvailablePatologies] = useState<string[]>([]);
  const [filteredPatologies, setFilteredPatologies] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (achadoToEdit) {
      setFormData({
        id: achadoToEdit.id,
        titulo: achadoToEdit.titulo,
        laudoId: achadoToEdit.laudoId,
        imageId: achadoToEdit.imageId,
        sistema: achadoToEdit.sistema || "",
        orgao: achadoToEdit.orgao || "",
        patologias: achadoToEdit.patologias || [],
        patologiasDetalhes: achadoToEdit.patologiasDetalhes || {},
        observacoes: achadoToEdit.observacoes || "",
      });
    }
  }, [achadoToEdit]);

  // Update organs when sistema changes
  useEffect(() => {
    if (formData.sistema) {
      const organs = Object.keys(humanBodyPositions[formData.sistema as keyof typeof humanBodyPositions] || {});
      setAvailableOrgans(organs);
      setFormData(prev => ({ ...prev, orgao: "", patologias: [] }));
    }
  }, [formData.sistema]);

  // Update patologies when orgao changes
  useEffect(() => {
    if (formData.sistema && formData.orgao) {
      const patologies = humanBodyPositions[formData.sistema as keyof typeof humanBodyPositions]?.[formData.orgao]?.patologies || [];
      setAvailablePatologies(patologies);
      setFilteredPatologies(patologies);
      setFormData(prev => ({
        ...prev,
        patologias: [],
        patologiasDetalhes: {}
      }));
    }
  }, [formData.sistema, formData.orgao]);

  //Validações

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | string[]>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  function getFormTitle() {
    if (achadoToEdit) return achadoToEdit.titulo;

    const todasSeveridadesNenhuma = formData.patologias.length > 0 &&
      formData.patologias.every(patologia =>
        formData.patologiasDetalhes[patologia]?.severidade === Severity.NONE
      );

    // Usa plural se houver mais de uma patologia
    if (formData.patologias.length > 1) {
      return todasSeveridadesNenhuma ? "Novas Observações" : "Novos Achados";
    }
    return todasSeveridadesNenhuma ? "Nova Observação" : "Novo Achado";
  }

  function getButtonText() {
    if (achadoToEdit) return "Salvar alterações";

    const todasSeveridadesNenhuma = formData.patologias.length > 0 &&
      formData.patologias.every(patologia =>
        formData.patologiasDetalhes[patologia]?.severidade === Severity.NONE
      );

    // Usa plural se houver mais de uma patologia
    if (formData.patologias.length > 1) {
      return todasSeveridadesNenhuma ? "Salvar observações" : "Salvar achados";
    }
    return todasSeveridadesNenhuma ? "Salvar observação" : "Salvar achado";
  }

  return (
    <Box
      sx={(theme) => ({
        padding: "1.2em",
        border: theme.palette.mode === 'light' ? "none" : "1px solid hsla(220, 20%, 25%, 0.6)",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: theme.palette.mode === 'light' ? "#fff" : "transparent",
      })}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: "16px",
        }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {getFormTitle()}
        </Typography>

        {selectedImage ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FF804620',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '24px',
                height: '24px',
                overflow: 'hidden',
                borderRadius: '4px',
                border: '1px solid #FF8046',
              }}
            >
              <Image
                src={selectedImage.link}
                alt="Preview"
                fill
                style={{
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: '#FF8046',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Box
                component="span"
                sx={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#FF8046',
                }}
              />
              Imagem anexada
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="caption"
            sx={{
              backgroundColor: '#FFF3DC',
              color: '#FFB020',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Box
              component="span"
              sx={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#FFB020',
              }}
            />
            Sem imagem anexada
          </Typography>
        )}
      </Box>

      <Stack spacing={3}>
        <FormControl fullWidth>
          <Autocomplete
            id="sistema"
            options={Object.keys(humanBodyPositions)}
            value={formData.sistema}
            onChange={(_, newValue) => {
              setFormData(prev => ({
                ...prev,
                sistema: newValue || ''
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sistema"
                placeholder="Selecione o sistema"
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    '& input::placeholder': {
                      lineHeight: '1.4',
                      verticalAlign: 'middle'
                    }
                  }
                }}
              />
            )}
            sx={autocompleteStyles}
            filterOptions={(options, { inputValue }) => {
              const searchText = inputValue.toLowerCase();
              return options.filter(option =>
                option.toLowerCase().includes(searchText)
              ).sort((a, b) => {
                const aStartsWith = a.toLowerCase().startsWith(searchText);
                const bStartsWith = b.toLowerCase().startsWith(searchText);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.localeCompare(b);
              });
            }}
          />
        </FormControl>

        <FormControl fullWidth disabled={!formData.sistema}>
          <Autocomplete
            id="orgao"
            options={availableOrgans}
            value={formData.orgao}
            disabled={!formData.sistema}
            onChange={(_, newValue) => {
              setFormData(prev => ({
                ...prev,
                orgao: newValue || ''
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Órgão"
                placeholder="Selecione o órgão"
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    '& input::placeholder': {
                      lineHeight: '1.4',
                      verticalAlign: 'middle'
                    }
                  }
                }}
              />
            )}
            sx={autocompleteStyles}
            filterOptions={(options, { inputValue }) => {
              const searchText = inputValue.toLowerCase();
              return options.filter(option =>
                option.toLowerCase().includes(searchText)
              ).sort((a, b) => {
                const aStartsWith = a.toLowerCase().startsWith(searchText);
                const bStartsWith = b.toLowerCase().startsWith(searchText);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.localeCompare(b);
              });
            }}
          />
        </FormControl>

        <FormControl fullWidth disabled={!formData.orgao}>
          <FormLabel sx={{ fontSize: "11px", ml: "1em", mt: "-0.7em" }}>Patologias</FormLabel>
          <Autocomplete
            multiple
            id="patologias"
            options={availablePatologies}
            value={formData.patologias}
            disabled={!formData.orgao}
            onChange={(_, newValue) => {
              // Encontrar patologias que foram removidas
              const removedPatologias = formData.patologias.filter(p => !newValue.includes(p));

              // Criar novo objeto de detalhes sem as patologias removidas
              const newPatologiasDetalhes = { ...formData.patologiasDetalhes };
              removedPatologias.forEach(p => {
                delete newPatologiasDetalhes[p];
              });

              setFormData(prev => ({
                ...prev,
                patologias: newValue,
                patologiasDetalhes: newPatologiasDetalhes
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                // label={formData.patologias.length === 0 ? "Patologias" : undefined}
                placeholder="Selecione as patologias"
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    '& input': {
                      opacity: formData.patologias.length > 0 ? 0 : 1,
                      height: formData.patologias.length > 0 ? '0px' : 'auto',
                      padding: formData.patologias.length > 0 ? '0px' : '7.5px 4px',
                      '&::placeholder': {
                        lineHeight: '1.4',
                        verticalAlign: 'middle'
                      }
                    }
                  }
                }}
              />
            )}
            sx={{
              ...autocompleteStyles,
              '& .MuiOutlinedInput-root': {
                ...autocompleteStyles['& .MuiOutlinedInput-root'],
                '& .MuiChip-root': {
                  backgroundColor: 'transparent',
                  border: '1px solid #FF8046',
                  color: '#FF8046',
                  borderRadius: '16px',
                  '& .MuiChip-label': {
                    fontSize: '0.8125rem'
                  },
                  '& .MuiChip-deleteIcon': {
                    color: '#FF8046',
                    '&:hover': {
                      color: '#FF8046'
                    }
                  }
                }
              }
            }}
            filterOptions={(options, { inputValue }) => {
              const searchText = inputValue.toLowerCase();
              return options.filter(option =>
                option.toLowerCase().includes(searchText)
              ).sort((a, b) => {
                const aStartsWith = a.toLowerCase().startsWith(searchText);
                const bStartsWith = b.toLowerCase().startsWith(searchText);
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.localeCompare(b);
              });
            }}
          />
        </FormControl>

        {formData.patologias.map((patologia) => (
          <Box
            key={patologia}
            sx={{
              border: '1px solid rgba(229,231,235,255)',
              borderRadius: '8px',
              padding: '1em',
              marginBottom: '1em'
            }}
          >
            <FormLabel
              sx={{
                fontSize: "16px",
                fontWeight: 'bold',
                color: '#FF8046',
                display: 'block',
                marginBottom: '1em'
              }}
            >
              {patologia}
            </FormLabel>

            <FormControl fullWidth sx={{ marginBottom: '1em' }}>
              <FormLabel sx={{ fontSize: "14px", marginBottom: '0.5em' }}>
                Severidade
              </FormLabel>
              <RadioGroup
                row
                value={formData.patologiasDetalhes[patologia]?.severidade || Severity.NONE}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    patologiasDetalhes: {
                      ...prev.patologiasDetalhes,
                      [patologia]: {
                        descricao: prev.patologiasDetalhes[patologia]?.descricao || '',
                        severidade: e.target.value as Severity
                      }
                    }
                  }));
                }}
              >
                <FormControlLabel
                  value={Severity.NONE}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          color: '#FF8046'
                        }
                      }}
                    />
                  }
                  label="Nenhuma"
                />
                <FormControlLabel
                  value={Severity.LOW}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          color: '#FF8046'
                        }
                      }}
                    />
                  }
                  label="Leve"
                />
                <FormControlLabel
                  value={Severity.MEDIUM}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          color: '#FF8046'
                        }
                      }}
                    />
                  }
                  label="Moderada"
                />
                <FormControlLabel
                  value={Severity.HIGH}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          color: '#FF8046'
                        }
                      }}
                    />
                  }
                  label="Alta"
                />
                <FormControlLabel
                  value={Severity.SEVERE}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        '&.Mui-checked': {
                          color: '#FF8046'
                        }
                      }}
                    />
                  }
                  label="Grave"
                />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: "14px", marginBottom: '0.5em' }}>
                Detalhes e Recomendações
              </FormLabel>
              <TextareaAutosize
                value={formData.patologiasDetalhes[patologia]?.descricao || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    patologiasDetalhes: {
                      ...prev.patologiasDetalhes,
                      [patologia]: {
                        descricao: e.target.value,
                        severidade: prev.patologiasDetalhes[patologia]?.severidade || Severity.NONE
                      }
                    }
                  }));
                }}
                minRows={3}
                placeholder={`Descreva os detalhes específicos para ${patologia}`}
                style={{
                  width: "100%",
                  padding: ".5em",
                  borderRadius: "5px",
                  fontSize: "14px",
                  border: theme.palette.mode === 'light'
                    ? "1px solid rgba(229,231,235,255)"
                    : "1px solid hsla(220, 20%, 25%, 0.6)",
                  backgroundColor: theme.palette.background.default
                }}
              />
            </FormControl>
          </Box>
        ))}

        <FormControl fullWidth>
          <Typography variant="body1" gutterBottom>
            Detalhes e Recomendações Gerais
          </Typography>
          <TextareaAutosize
            name="observacoes"
            value={formData.observacoes}
            onChange={(e) => handleChange(e)}
            minRows={4}
            placeholder="Descreva a condição do paciente e as recomendações gerais"
            style={{
              width: "100%",
              padding: ".5em",
              borderRadius: "5px",
              fontSize: "14px",
              border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
              backgroundColor: theme.palette.background.default
            }}
          />
        </FormControl>

        <Stack direction="row" spacing={2} justifyContent="flex-start">
          <Button
            onClick={onCancel}
            disabled={isLoading}
            sx={(theme) => ({
              backgroundColor: theme.palette.mode === 'light' ? "#fff" : "#0b0e14",
              border: "1px solid #e5e7eb"
            })}
            className="text-kai-primary transition-colors hover:bg-kai-primary/10"
          >
            <Close sx={{ fontSize: "17px", marginRight: ".2em" }} />
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-kai-primary hover:bg-kai-primary/70 flex items-center"
            sx={(theme) => ({
              color: theme.palette.mode === 'light' ? '#fff' : '#000'
            })}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : (
              <Check sx={(theme) => ({
                color: theme.palette.mode === 'light' ? '#fff' : '#000',
                fontSize: "17px",
                marginRight: ".2em"
              })} />
            )}
            <Typography sx={(theme) => ({
              color: theme.palette.mode === 'light' ? '#fff' : '#000'
            })}>
              {getButtonText()}
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
