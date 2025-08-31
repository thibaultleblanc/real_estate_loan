import { AppBar, Toolbar, Typography } from '@mui/material'

function Header() {
  return (
    <AppBar position="static" color="primary" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography variant="h4" align="center" sx={{ flexGrow: 1 }}>
          Convertisseur Brut &rarr; Net
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header