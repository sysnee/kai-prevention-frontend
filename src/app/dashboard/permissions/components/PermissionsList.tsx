"use client";

import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { RolePermissions } from "../../../types/pemissions/permissions";
import AccessChip from "./AccessChip";
import StagePermissions from "./StagePermissions";
import ActionButtons from "./ActionButtons";
import StatusChip from "./StatusChip";
import { useTheme } from "@mui/system";
import { getPatientAccessDescription } from "../utils/permissionUtils";

interface PermissionsListProps {
  rolesPermissions: RolePermissions[];
  onView: (role: RolePermissions) => void;
  onEdit: (role: RolePermissions) => void;
  onDelete: (role: RolePermissions) => void;
}

export default function PermissionsList({
  rolesPermissions,
  onView,
  onEdit,
  onDelete,
}: PermissionsListProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const theme = useTheme();

  const handleToggle = (role: string) => {
    setExpandedItems((prev) =>
      prev.includes(role)
        ? prev.filter((item) => item !== role)
        : [...prev, role]
    );
  };

  const isDarkMode = theme.palette.mode === "dark";

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        backgroundColor: isDarkMode
          ? theme.palette.background.default
          : "white",
        borderRadius: "8px",
        boxShadow: isDarkMode
          ? "0 2px 8px rgba(0,0,0,0.5)"
          : "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {rolesPermissions.map((role, index) => (
        <div key={role.name}>
          <ListItem
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: isDarkMode
                  ? theme.palette.action.hover
                  : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "flex-start",
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      component={"span"}
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: "bold !important",
                      }}
                    >
                      {role.name}
                    </Typography>
                    <StatusChip isActive={role.isActive} />
                  </Box>
                }
                secondary={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: 1,
                      marginTop: 1,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.875rem",
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                      }}
                    >
                      Módulo de Clientes
                    </Typography>
                    <Box>
                      <AccessChip
                        access={
                          role.permissions.find((p) => p.module == "client")
                            ?.access || "none"
                        }
                        description={getPatientAccessDescription(
                          role.permissions.find((p) => p.module === "client")
                            ?.access || "none",
                          role.name!
                        )}
                      />
                    </Box>
                  </Box>
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 1,
                width: "auto",
                marginTop: { xs: 2, sm: 0 },
              }}
            >
              <ActionButtons
                onView={() => onView(role)}
                onEdit={() => onEdit(role)}
                onDelete={() => onDelete(role)}
              />
              <IconButton
                edge="end"
                onClick={() => handleToggle(role.name!)}
                size="small"
                className="bg-kai-primary text-white transition-colors hover:bg-[#e66a33]"
                sx={{
                  border: "1px solid #e5e7eb"
                }}
              >
                {expandedItems.includes(role.name!) ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </IconButton>
            </Box>
          </ListItem>
          <Collapse
            in={expandedItems.includes(role.name!)}
            timeout="auto"
            unmountOnExit
          >
            <Box
              sx={{
                padding: "16px",
                backgroundColor: isDarkMode
                  ? theme.palette.background.paper
                  : "rgba(0,0,0,0.02)",
                borderRadius: "8px",
                margin: "8px 16px",
              }}
            >
              <StagePermissions stages={role.examStages} />
            </Box>
          </Collapse>
          {index < rolesPermissions.length - 1 && (
            <Divider
              sx={{
                backgroundColor: isDarkMode
                  ? theme.palette.divider
                  : "rgba(0, 0, 0, 0.1)",
              }}
            />
          )}
        </div>
      ))}
    </List>
  );
}
