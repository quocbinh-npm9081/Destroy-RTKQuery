import { AnyAction, Middleware, MiddlewareAPI, isRejectedWithValue } from '@reduxjs/toolkit'

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
  console.log('action: ', action)
  if(isPayLoadErrorMessage(action)){
    
    if(isRejectedWithValue()){
        
    }
    
    isRejectedWithValue()
  }
  return next(action)
}
