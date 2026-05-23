import { SettingsProvider } from './context/SettingsContext'
import Layout from './components/Layout'

export default function App() {
  return (
    <SettingsProvider>
      <Layout />
    </SettingsProvider>
  )
}
