import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Box, Avatar, Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Estudo",
    flex: 0.4,
    minWidth: 80,
    renderCell: (params) => (
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          borderRight: `1px solid ${theme.palette.divider}`,
          boxSizing: "border-box",
        })}
      >
        {params.row.id}
      </Box>
    ),
  },
  {
    field: "imagens",
    headerName: "Imagens",
    flex: 2,
    minWidth: 200,
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: "0.2em", marginLeft: 2, marginTop: 0.3 }}>
        {params.value.slice(0, 4).map((imagem: any, index: number) =>
          index < 3 ? (
            <Image
              key={index}
              src={imagem.link}
              alt="raio-x"
              width={50}
              height={50}
              style={{ borderRadius: "8px" }}
            />
          ) : (
            <Box key={index} sx={{ position: "relative" }}>
              <Image
                src={imagem.link}
                alt="raio-x"
                width={50}
                height={50}
                style={{ borderRadius: "8px" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 50,
                  height: 46,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "16px",
                }}
              >
                +{params.value.length - 3}
              </Box>
            </Box>
          )
        )}
      </Box>
    ),
  },
  {
    field: "responsavel",
    headerName: "Responsável",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
          marginLeft: 2,
        }}
      >
        <Avatar />
        <Box>{params.value ? params.value.nome : "Dr. James"}</Box>
      </Box>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 100,
    renderCell: (params) => (
      <Box
        sx={{
          color: params.value === "Pendente" ? "orange" : "green",
          paddingLeft: 1,
        }}
      >
        {params.value}
      </Box>
    ),
  },
  {
    field: "acao",
    headerName: "Ação",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Link href={params.value.url} passHref>
        <Button
          size="small"
          className="bg-kai-primary hover:bg-kai-primary/70"
          endIcon={
            <ChevronRightRoundedIcon sx={(theme) => ({ color: theme.palette.mode === 'light' ? '#fff' : '#000' })} />
          }
          sx={(theme) => ({
            width: "100%",
          })}
        >
          <Typography
            sx={(theme) => ({
              color: theme.palette.mode === 'light' ? '#fff' : '#000'
            })}
          >
            {params.value.label}
          </Typography>
        </Button>
      </Link>
    ),
  },
];

export const generateRows = (estudos: any[]): GridRowsProp => {
  return estudos.map((estudo: any) => ({
    id: estudo.id,
    nome: estudo.nome,
    imagens: estudo.imagens,
    responsavel: estudo.responsavel,
    status: estudo.laudoId ? "Laudado" : "Pendente",
    acao: {
      label: estudo.laudoId ? "Editar laudo" : "Laudar",
      url: estudo.laudoId
        ? `/dashboard/estudos/${estudo.id}`
        : `/dashboard/estudos/${estudo.id}/novo`,
    },
  }));
};
