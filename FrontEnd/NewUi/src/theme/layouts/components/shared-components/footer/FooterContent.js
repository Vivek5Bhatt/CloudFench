// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const FooterContent = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2, fontSize: '14px' }}>
        {`© ${new Date().getFullYear()}, CloudFence Solutions v0.1 `}
      </Typography>
    </Box>
  )
}

export default FooterContent
