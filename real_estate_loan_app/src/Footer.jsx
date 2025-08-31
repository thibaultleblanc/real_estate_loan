import { BottomNavigation, BottomNavigationAction, Typography, Box } from '@mui/material'

function Footer() {
  return (
    <Box sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0 }}>
      <BottomNavigation showLabels sx={{ bgcolor: '#f5f5f5' }}>
        <BottomNavigationAction
          label={
            <Typography variant="body2" align="center" sx={{ width: '100%' }}>
              © 2025 - Réalisé avec Material UI
            </Typography>
          }
        />
      </BottomNavigation>
    </Box>
  )
}

export default Footer