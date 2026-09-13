import React, { useEffect } from 'react'
import AppRouter from './routes/AppRouter.jsx'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

function App() {
    const { i18n } = useTranslation()

    useEffect(() => {
        const currentLang = i18n.language || 'fr'
        document.documentElement.dir = currentLang.startsWith('ar') ? 'rtl' : 'ltr'
        document.documentElement.lang = currentLang
    }, [i18n.language])

    return (
        <>
            <AppRouter />
            <Toaster position={i18n.language?.startsWith('ar') ? 'top-left' : 'top-right'} />
        </>
    )
}

export default App