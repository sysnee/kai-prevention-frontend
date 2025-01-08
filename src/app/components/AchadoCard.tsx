import { Avatar, Box, Button, Card, CardContent, Stack, Typography, Chip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Finding, Severity } from "@/types/findings";
import { formatDate } from "@/utils/format-date";

function getSeverityColor(severity: Severity) {
    const colors = {
        [Severity.NONE]: 'default',
        [Severity.LOW]: 'success',
        [Severity.MEDIUM]: 'warning',
        [Severity.HIGH]: 'error',
        [Severity.SEVERE]: 'error'
    } as const;
    return colors[severity];
}

function getSeverityLabel(severity: Severity) {
    const labels = {
        [Severity.NONE]: 'Normal',
        [Severity.LOW]: 'Leve',
        [Severity.MEDIUM]: 'Moderada',
        [Severity.HIGH]: 'Alta',
        [Severity.SEVERE]: 'Grave'
    };
    return labels[severity];
}

export default function AchadoCard({
    achado,
    onEdit,
    onDelete
}: {
    achado: Finding,
    onEdit: () => void,
    onDelete: () => void
}) {
    return (
        <Card
            sx={(theme) => ({
                width: "100%",
                backgroundColor: "#fff",
                border: theme.palette.mode === 'light' ? "none" : "1px solid #333b4d",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                overflow: "auto"
            })}
        >
            <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4">
                        {achado.pathology}
                    </Typography>
                    <Chip
                        label={getSeverityLabel(achado.severity)}
                        color={getSeverityColor(achado.severity)}
                        size="small"
                        sx={{
                            height: '20px',
                            '& .MuiChip-label': {
                                fontSize: '0.75rem',
                                px: 1
                            }
                        }}
                    />
                </Stack>
            </CardContent>

            <Stack
                direction="row"
                alignItems="start"
                justifyContent="space-between"
                spacing={2}
                marginTop={2}
            >
                <Box>
                    <Typography sx={{ fontSize: "16px" }} variant="h6">
                        Sistema
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "lighter" }} variant="h6">
                        {achado.system}
                    </Typography>
                </Box>

                <Box>
                    <Typography sx={{ fontSize: "16px" }} variant="h6">
                        Órgão
                    </Typography>
                    <Typography sx={{ fontSize: "12px", fontWeight: "lighter" }} variant="h6">
                        {achado.organ}
                    </Typography>
                </Box>

                {achado.observations && (
                    <Box>
                        <Typography sx={{ fontSize: "16px" }} variant="h6">
                            Observações
                        </Typography>
                        <Typography sx={{ fontSize: "12px", fontWeight: "lighter" }} variant="h6">
                            {achado.observations}
                        </Typography>
                    </Box>
                )}
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                marginTop={3}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: ".5em" }}>
                    <Avatar sx={{ width: 35, height: 35 }}></Avatar>
                    <Box>
                        <Typography sx={{ fontSize: "11px", fontWeight: "bold" }}>
                            Laudado por
                        </Typography>
                        <Typography sx={{ fontSize: "10px" }}>
                            {achado.created_by?.fullName}
                        </Typography>
                        <Typography sx={{ fontSize: "9px", color: "text.secondary" }}>
                            {formatDate(achado.created_at)}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        onClick={onEdit}
                        sx={{
                            minWidth: 'auto',
                            padding: '8px',
                            color: '#FF8046',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 128, 70, 0.1)',
                            }
                        }}
                    >
                        <EditIcon sx={{ fontSize: "20px" }} />
                    </Button>

                    <Button
                        onClick={onDelete}
                        sx={{
                            minWidth: 'auto',
                            padding: '8px',
                            color: '#FF8046',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 128, 70, 0.1)',
                            }
                        }}
                    >
                        <DeleteIcon sx={{ fontSize: "20px" }} />
                    </Button>
                </Box>
            </Stack>
        </Card>
    )
}