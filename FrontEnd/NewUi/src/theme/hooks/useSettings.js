import { useContext } from 'react'
import { SettingsContext } from 'src/theme/context/settingsContext'

export const useSettings = () => useContext(SettingsContext)
