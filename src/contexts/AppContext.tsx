import { createContext, useContext, ReactNode, useState } from 'react'

interface AppContextProps {
  reload: () => void,
  url: string,
  corsProxyUrl: string,
  isDev: boolean
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [_reloadCounter, setReloadCounter] = useState(0)
  const [url] = useState("https://notemasterapi.azurewebsites.net")
  const [corsProxyUrl] = useState("https://cors-anywhere.herokuapp.com/")
  const [isDev] = useState(true)

  const reload = () => {
    setReloadCounter((prevCounter) => prevCounter + 1)
  }

  return (
    <AppContext.Provider value={{ reload, url, corsProxyUrl, isDev }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
