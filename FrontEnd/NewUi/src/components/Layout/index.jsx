// ** MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/theme/layouts/VerticalLayout'
import VerticalAppBarContent from '../HeaderRightSide'
// ** Hook Import
import { useSettings } from 'src/theme/hooks/useSettings'

const UserLayout = ({ children }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalAppBarContent={(
        props
      ) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={props.toggleNavVisibility}
        />
      )}
    >
      {children}
    </VerticalLayout>
  )
}

export default UserLayout
