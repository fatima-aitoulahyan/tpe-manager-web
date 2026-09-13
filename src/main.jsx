import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import store from './store'
import AppRouter from './routes/AppRouter.jsx'
import './index.css'
import './core/i18n/i18n';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime:        1000 * 60 * 5,
            retry:            1,
            refetchOnWindowFocus: false,
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AppRouter />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            borderRadius: '10px',
                            fontSize: '14px',
                        },
                    }}
                />
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
)