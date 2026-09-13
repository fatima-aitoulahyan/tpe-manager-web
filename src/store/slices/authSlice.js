import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../../core/api/authApi'

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await authApi.login(credentials)

            localStorage.setItem('access_token',  data.access)
            localStorage.setItem('refresh_token', data.refresh)

            const profile = await authApi.getProfile()
            return profile
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.detail || 'Identifiants incorrects'
            )
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await authApi.register(userData)

            const accessToken  = data.access  || data.tokens?.access
            const refreshToken = data.refresh || data.tokens?.refresh

            if (accessToken && refreshToken) {
                localStorage.setItem('access_token',  accessToken)
                localStorage.setItem('refresh_token', refreshToken)
            }

            return data.user || data
        } catch (err) {
            const errors = err.response?.data
            const firstError = errors
                ? Object.values(errors).flat()[0]
                : "Erreur lors de l'inscription"
            return rejectWithValue(firstError)
        }
    }
)

export const loadProfile = createAsyncThunk(
    'auth/loadProfile',
    async (_, { rejectWithValue }) => {
        try {
            const data = await authApi.getProfile()
            return data
        } catch {
            return rejectWithValue(null)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user:        null,
        loading:     false,
        error:       null,
        initialized: false,
    },
    reducers: {
        logout: (state) => {
            state.user = null
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        },
        clearError: (state) => { state.error = null },
    },
    extraReducers: (builder) => {
        const pending  = (state) => { state.loading = true;  state.error = null }
        const rejected = (state, action) => {
            state.loading = false
            state.error   = action.payload
        }

        builder
            .addCase(login.pending,         pending)
            .addCase(login.fulfilled,       (state, action) => {
                state.loading     = false
                state.user        = action.payload
                state.initialized = true
            })
            .addCase(login.rejected,        rejected)

            // Register cases
            .addCase(register.pending,      pending)
            .addCase(register.fulfilled,    (state, action) => {
                state.loading     = false
                state.user        = action.payload
                state.initialized = true
            })
            .addCase(register.rejected,     rejected)

            // Load Profile cases
            .addCase(loadProfile.fulfilled, (state, action) => {
                state.user        = action.payload
                state.initialized = true
            })
            .addCase(loadProfile.rejected,  (state) => {
                state.initialized = true
            })
    },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer