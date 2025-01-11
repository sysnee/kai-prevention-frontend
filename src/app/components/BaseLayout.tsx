'use client'

import { ReactNode } from 'react'
import { Box, CssBaseline } from '@mui/material'
import SideMenu from './SideMenu'
import AppNavbar from './AppNavbar'
import Header from './Header'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import ProtectedPage from '../wrappers/protected-page'
import AppTheme from '../theme/AppTheme'
import { chartsCustomizations } from '../theme/customizations/charts'
import { dataGridCustomizations } from '../theme/customizations/dataGrid'
import { treeViewCustomizations } from '../theme/customizations/treeView'
import { datePickersCustomizations } from '../theme/customizations/datePickers'
import { useTheme } from '@mui/system'

const DRAWER_WIDTH = 280

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations
}

function BaseLayout({ children, session }: { children: ReactNode; session?: Session }) {
  const theme = useTheme();

  return (
    <SessionProvider session={session}>
      <div suppressHydrationWarning>
        <ProtectedPage>
          <AppTheme themeComponents={xThemeComponents}>
            <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <SideMenu drawerWidth={DRAWER_WIDTH} />
              <Box
                component='main'
                sx={{
                  flexGrow: 1,
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  overflow: 'hidden',
                  position: 'relative',
                  boxSizing: 'border-box',
                  p: 2,
                  backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default'
                }}>
                <AppNavbar />
                <Header />
                <Box
                  sx={{
                    width: '100%',
                    overflow: 'auto',
                    flex: 1
                  }}>
                  {children}
                </Box>
              </Box>
            </Box>
          </AppTheme>
        </ProtectedPage>
      </div>
    </SessionProvider>
  )
}

export default BaseLayout
