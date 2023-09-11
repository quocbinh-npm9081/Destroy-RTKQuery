import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './pages/blog/blog.slice'
import { blogApi } from 'pages/blog/blog.services'
import { setupListeners } from '@reduxjs/toolkit/dist/query'

export const store = configureStore({
  reducer: {
    blog: blogReducer, //slice được tạo từ CraeteSlide
    [blogApi.reducerPath]: blogApi.reducer //slice được tạo từ createApi
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  //thêm một middleware để enable các tính năng caching, invalidation, pulling của RTK query
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware)
})

//optional, but required for refechOnFocus/redetchOnReconnect behavior
// là tùy chọn không bắt buộc nếu muốn sử dụng các hành vi refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
