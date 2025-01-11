import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Collapse from '@mui/material/Collapse'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import DocumentScannerRounded from '@mui/icons-material/DocumentScannerRounded'
import { CalendarIcon } from '@mui/x-date-pickers'
import { Groups2, MonitorHeart, SecurityOutlined, VerifiedUser } from '@mui/icons-material'
import { Divider } from '@mui/material'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import SyncAltIcon from '@mui/icons-material/SyncAlt'


const mainListItems = [
  // {
  //   text: 'Início',
  //   icon: <HomeRoundedIcon />,
  //   path: '/'
  // },
  {
    text: 'Agendamento',
    icon: <CalendarIcon />,
    path: '/dashboard/agendamentos'
  },
  {
    text: 'Laudário',
    icon: <DocumentScannerRounded />,
    path: '/dashboard/estudos'
  },
  {
    text: 'Fluxo de trabalho',
    icon: <SyncAltIcon />,
    path: '/dashboard/workflow'
  },
  {
    text: 'Clientes',
    icon: <PeopleRoundedIcon />,
    path: '/dashboard/clientes'
  }
]

const secondaryListItems = [
  { text: 'Usuários', icon: <Groups2 />, path: '/dashboard/usuarios' },
  { text: 'Permissões', icon: <VerifiedUser />, path: '/dashboard/permissions' }
]

export default function MenuContent() {
  const [open, setOpen] = React.useState<{ [key: number]: boolean }>({})
  const { data } = useSession()

  const handleClick = (index: number) => {
    setOpen(prevOpen => ({
      ...prevOpen,
      [index]: !prevOpen[index]
    }))
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1 }} spacing={4}>
      <List>
        {mainListItems.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding sx={{ display: 'block' }}>

              <Link href={item.path || '/'} passHref>
                <ListItemButton
                  sx={{
                    py: 0,
                    '& .MuiListItemIcon-root': {
                      minWidth: 30,
                      '& .MuiSvgIcon-root': {
                        color: '#fff'
                      }
                    },
                    '& .MuiTypography-root': {
                      fontSize: '0.95rem',
                      color: '#fff'
                    }
                  }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Link>

            </ListItem>


          </React.Fragment>
        ))}
      </List>

      <Divider />

      {data?.user?.email === 'adm@onlineclinic.com.br' && (
        <Stack>
          <Stack direction={'row'} spacing={1} sx={{ px: 2, py: 1 }}>
            <SecurityOutlined
              className='opacity-50'
              style={{ width: '20px', color: '#fff' }}
            />
            <p className='opacity-75' style={{ color: '#fff' }}>ADMINISTRATIVO</p>
          </Stack>
          <List>
            {secondaryListItems.map((item, index) => (
              <Link key={index} href={item.path}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      py: 1.5,
                      '& .MuiListItemIcon-root': {
                        minWidth: 30,
                        '& .MuiSvgIcon-root': {
                          color: '#fff'
                        }
                      },
                      '& .MuiTypography-root': {
                        fontSize: '0.95rem',
                        color: '#fff'
                      }
                    }}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </Stack>
      )}
    </Stack>
  )
}
