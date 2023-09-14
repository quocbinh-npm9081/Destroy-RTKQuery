import { AnyAction, Middleware, MiddlewareAPI, isRejected, isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

function isPayLoadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
  }
  status: number
} {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as any).data?.error === 'string'
  )
}

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  if (isRejected(action)) {
    console.log('action: ', action)
    if (action.error.name === 'CustomError') {
      toast.warn(`${action.error.message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
    }
  }
  if (isRejectedWithValue(action)) {
    // isRejectedWithValue là 1 func giúp chúng ta kiểm tra những action có rejectedWuthValue = true từ createAsyncThunk
    // RTK Query sử dụng isRejectedWithValue sử dụng createAsyncThunk bên trong nên ta có thể sử dụng isRejectedWithValue
    // isRejectedWithValue chỉ có thể bắt cáclối server trả về khi ấy isRejectedWithValue = true
    // isRejecttedWithValue không bắt các lỗi caching khi ấy  isRejectedWithValue = false
    if (isPayLoadErrorMessage(action.payload)) {
      toast.warn(`${action.payload.data.error}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
    }
  }

  return next(action)
}
