import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Eye, Edit2 } from "lucide-react";

function ViewEditButtons({ onView, onEdit }: {
  onView: () => void
  onEdit: () => void
}) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onView}
        className="hover:opacity-70"
      >
        <Eye className="w-5 h-5 text-kai-primary" />
      </button>
      <button
        onClick={onEdit}
        className="hover:opacity-70"
      >
        <Edit2 className="w-5 h-5 text-kai-primary" />
      </button>
    </div>
  )
}

export const colum = (
  onView: (cliente: any) => void,
  onEdit: (cliente: any) => void,
): GridColDef[] => [
    {
      field: "name",
      headerName: "Nome",
      flex: 0.4,
      minWidth: 250,
      renderCell: (params) => (
        <Box
          sx={(theme) => ({
            padding: "0 .8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            width: "100%",
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
          })}
        >
          {params.row.name}
        </Box>
      ),
    },
    {
      field: "cpf",
      headerName: "CPF",
      flex: 0.4,
      minWidth: 150,
      renderCell: (params) => (
        <Box
          sx={(theme) => ({
            padding: "0 .8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            width: "100%",
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
          })}
        >
          {params.row.cpf}
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.4,
      minWidth: 250,
      renderCell: (params) => (
        <Box
          sx={(theme) => ({
            padding: "0 .8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            width: "100%",
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
          })}
        >
          {params.row.email}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      flex: 0.4,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={(theme) => ({
            padding: "0 .8em",
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            height: "100%",
            width: "100%",
            borderRight: `1px solid ${theme.palette.divider}`,
            boxSizing: "border-box",
            backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'inherit',
          })}
        >
          <ViewEditButtons
            onView={() => onView(params.row)}
            onEdit={() => onEdit(params.row)}
          />
        </Box>
      ),
    },
  ];

export const generateRows = (clientes: any[]): GridRowsProp => {

  const formatCPF = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  return clientes?.map((cliente: any) => ({
    id: cliente.id,
    name: cliente.name,
    cpf: formatCPF(cliente.cpf),
    email: cliente.email,
    gender: cliente.gender,
    phone: cliente.phone,
    birthdate: cliente.birthdate,
    street: cliente.street,
    number: cliente.number,
    complement: cliente.complement,
    neighborhood: cliente.neighborhood,
    city: cliente.city,
    state: cliente.state,
    zipcode: cliente.zipcode,
  }));
};
