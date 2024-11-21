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
    Typography 
  } from "@mui/material";
  import { Box } from "@mui/system";
  import { useState } from "react";
  
  export default function AchadoForm({
    onCancel,
    onSubmit,
  }: {
    onCancel: () => void;
    onSubmit: (formData: any) => void;
  }) {

    const [formData, setFormData] = useState({
        sistema: "",
        orgao: "",
        patologias: [],
        severidade: "",
        observacoes: "",
    });

    //Validações

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | string[]>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = () => {
      onSubmit(formData);
    };
  
    return (
      <Box
        sx={(theme) => ({
          padding: "1.2em",
          border: theme.palette.mode === 'light' ? "none" : "1px solid #333b4d",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          backgroundColor: theme.palette.mode === 'light' ? "#fff" : "transparent",
        })}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Novo Achado
        </Typography>
  
        <Stack spacing={3}>
            <FormControl fullWidth>
                <InputLabel id="inputSistema">Sistema</InputLabel>
                <Select
                    labelId="inputSistema"
                    name="sistema"
                    value={formData.sistema}
                    onChange={(e) => handleChange(e)}
                    sx={{
                        backgroundColor: "transparent"
                    }}
                >
                    <MenuItem value="Sistema Nervoso">Sistema Nervoso</MenuItem>
                    <MenuItem value="Sistema Cardiovascular">Sistema Cardiovascular</MenuItem>
                </Select>
            </FormControl>
  
          <FormControl fullWidth>
                <InputLabel id="inputOrgao">Órgão</InputLabel>
                <Select
                    labelId="inputOrgao"
                    name="orgao"
                    value={formData.orgao}
                    onChange={(e) => handleChange(e)}
                    sx={{
                        backgroundColor: "transparent"
                    }}
                >
                    <MenuItem value="Coração">Coração</MenuItem>
                    <MenuItem value="Cérebro">Fígado</MenuItem>
                </Select>
          </FormControl>
  
          <FormControl fullWidth>
                <InputLabel id="inputPatologias">Patologias</InputLabel>
                <Select
                    labelId="inputPatologias"
                    name="patologias"
                    value={formData.patologias}
                    onChange={(e) => handleChange(e)}
                    multiple
                    sx={{
                        backgroundColor: "transparent"
                    }}
                >
                    <MenuItem value="Valvopatia">Valvopatia</MenuItem>
                    <MenuItem value="Aneurisma">Aneurisma</MenuItem>
                </Select>
          </FormControl>

          <FormControl>
                <Typography
                    sx={{
                        fontSize: "18px"
                    }}
                >
                    Severidade
                </Typography>
                <RadioGroup
                    row
                    name="severidade"
                    value={formData.severidade}
                    onChange={handleChange}
                >
                    <FormControlLabel value="leve" control={<Radio size="small" />} label="Leve" />
                    <FormControlLabel value="grave" control={<Radio size="small" />} label="Grave" />
                </RadioGroup>
          </FormControl>

          <FormControl fullWidth>
                <Typography variant="body1" gutterBottom>
                Observações gerais
                </Typography>
                <TextareaAutosize
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleChange(e)}
                    minRows={4}
                    placeholder="Descreva as observações aqui..."
                    style={{
                        width: "100%",
                        padding: ".5em",
                        borderRadius: "4px",
                        border: "1px solid #333b4d",
                        fontSize: "14px",
                        backgroundColor: "transparent"
                    }}
                />
          </FormControl>
  
          <Stack direction="row" spacing={2} justifyContent="flex-start">
                <Button 
                    onClick={onCancel}
                    sx={(theme) => ({
                        color: theme.palette.text.primary,
                        fontSize: "12px",
                        border: "1px solid #333b4d"
                    })}
                >
                    <Close sx={{fontSize: "17px", marginRight: ".2em"}} />
                    Cancelar
                </Button>
                <Button 
                    onClick={handleSubmit}
                    sx={(theme) => ({
                        color: theme.palette.text.primary,
                        fontSize: "12px",
                        border: "1px solid #333b4d"
                    })}
                >
                    <Check sx={{fontSize: "17px", marginRight: ".2em"}} />
                    Salvar Achado
                </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }
  