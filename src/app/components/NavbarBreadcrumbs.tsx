import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

// const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
//   margin: theme.spacing(1, 0),
//   [`& .${breadcrumbsClasses.separator}`]: {
//     color: (theme.cssVariables || theme).palette.action.disabled,
//     margin: 1,
//   },
//   [`& .${breadcrumbsClasses.ol}`]: {
//     alignItems: 'center',
//   },
// }));

export default function NavbarBreadcrumbs() {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Dashboard</Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
        Início
      </Typography>
    </Breadcrumbs>
  );
}
