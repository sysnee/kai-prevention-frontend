'use client'

import * as React from 'react'
import { Drawer, Box, Divider, Stack, Typography, Avatar, useMediaQuery, Theme } from '@mui/material'
import MenuContent from '../dashboard/components/MenuContent'
import OptionsMenu from '../dashboard/components/OptionsMenu'
import { useSession } from 'next-auth/react'
import logoImage from '../assets/imagens/kai_a_orange.png'

interface SideMenuProps {
  drawerWidth: number
}

function SideMenu({ drawerWidth }: SideMenuProps) {
  const { data } = useSession()
  const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

  return (
    <Drawer
      variant={isLargeScreen ? 'permanent' : 'temporary'}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: theme => `1px solid ${theme.palette.divider}`,
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#867C74' : '#867C74',
          color: theme => theme.palette.mode === 'dark' ? '#fff' : '#fff'
        }
      }}>
      <Box
        sx={{
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
        <Avatar
          src={logoImage.src}
          sx={{
            width: 25,
            height: 25,
            mr: 1,
            imageRendering: 'auto',
            boxShadow: 'inset 4px 0px 6px rgba(0, 0, 0, 0.2)'
          }}
        />
        <Typography variant='h5' sx={{ color: '#fff' }}>KAI RIS</Typography>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <MenuContent />
      </Box>

      <Divider />

      <Stack
        direction='row'
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center'
        }}>
        <Avatar alt={data?.user?.name ?? ''} src='/static/images/avatar/7.jpg' sx={{ width: 36, height: 36 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant='body2' noWrap sx={{ fontWeight: 500, color: '#fff' }}>
            {data?.user?.name ?? ''}
          </Typography>
          <Typography variant='caption' noWrap sx={{ color: '#fff' }}>
            {data?.user?.email ?? ''}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  )
}

export default SideMenu
