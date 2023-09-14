# Báo cáo thực tập ngày 5 (Cache Data)

Caching là một tính năng quan trong của RTK Query, khi chúng fetch dữ liệu từ server,RTK Query sẽ cache dữ liệu vào Redux. Tất nhiên đây là cache trên RAM => F5 là mất

Caching sẽ dựa vào

- API endpoint( tức là mấy cái khai báo `getPosts`, `getPost` các kiểu...)
- Query params được sử dụng( vd: `1` là parameter trong `useGetPostQuery(1)` )
- Số lượng active subscription cộng dồn

Khi một component được mounted và gọi `useQuery` hook thí component đó có subcribe cái data đó => Ta có 1 subscription, Nếu nó unmount thì ta sẽ trở lại 0 (unsubcribe)

Khi request được gọi, nếu data đã được cache thì RTK sẽ không thực hiện request mới đến server mà trả về cache đó

Số lượng subscription được cộng dồn khi mà cùng gọi 1 endPoint và query param. Miễn là còn component subcribe data thì data có nó chưa mất, Nếu không có component nào được subcribe thì mặc định sau 60s sẽ xóa khỏi cache( nếu lúc đó có compoennt nào subcribe tại data đó thì còn dữ tiếp)

## Ví dụ về thời gian cache

```jsx
import { useGetUserQuery } from './api.ts'

function ComponentOne() {
  // component subscribes to the data
  const { data } = useGetUserQuery(1)

  return <div>...</div>
}

function ComponentTwo() {
  // component subscribes to the data
  const { data } = useGetUserQuery(2)

  return <div>...</div>
}

function ComponentThree() {
  // component subscribes to the data
  const { data } = useGetUserQuery(3)

  return <div>...</div>
}

function ComponentFour() {
  // component subscribes to the *same* data as ComponentThree,
  // as it has the same query parameters
  const { data } = useGetUserQuery(3)

  return <div>...</div>
}
```

Khi 4 component trên được gọi thì ta có

- Component 1 subcribe data 1
- Component 2 subcribe data 2
- Component 3 và 4 cùng subcribe data 3

Chỉ có 3 request được gửi lên server là request từ component 1,2,3. Còn component 4 sẽ dùng lại data cache từ component 3

Data sẽ được giữ lại cho đến khi không còn component nào subcribe. Ví dụ:

- Nếu component 1 hoặc 2 bị unmount, data 1 hoặc data 2 sẽ bị xóa sau 60s
- Nếu component 3 bị unmount, data 3 vẫn còn vì component 4 vẫn đang subcribe. Nếu lúc này 4 unsubcribe thì data 3 mới bị xóa sau 60s

## Chúng ta có thể cấu hình thời gian caching

Không nhất thiết phải đợi 60s để destroy caching, chúng ta có thẻ tự settup thời gian caching theo ý chúng ta muốn

Tài liệu về cách setup caching time đầy đủ tại đây [Reducing subscription time](https://redux-toolkit.js.org/rtk-query/usage/cache-behavior#manipulating-cache-behavior).

```ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Post } from './types'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  // global configuration for the api
  keepUnusedDataFor: 30, //<-- caching cho toàn bộ các endPonit để caching với thời gian là 30s>
  refetchOnMountOrArgChange: 10, //Sau 10s thì cho phép call api lại
  refetchOnReconnect: true, // call api sau khi internet được kết nối
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], number>({
      query: () => `posts`,
      // configuration for an individual endpoint, overriding the api setting
      keepUnusedDataFor: 5 //<--caching 1 endPont riêng biệt vơi expire time là 5s>
    })
  })
})
```

### Polling

> Polling là kỹ thuật realtime cứ mỗi giây thì nó tự động call api 1 lần sẽ làm dữ liệu trên UI luôn luôn mới

```ts
const { data, status, error, refetch } = useGetPokemonByNameQuery(name, {
  pollingInterval: 3000 //< sau 3 giây call api useGetPokemonByNameQuery 1 lần >
})
```

### Customer Header

> Ví dự như mình muốn truyền token vào header của phương thức GET thì phải làm thé nào ?

Xem tài liệu về Header Request của RTK Query ở đây [Headers on requests](https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests)

#### Set header cho toàn bộ request

```ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type { RootState } from './store'

const baseQuery = fetchBaseQuery({
  baseUrl: '/',
  prepareHeaders: (headers, { getState }) => {
    //<--- Customer header thông qua perpareHeader property
    const token = (getState() as RootState).auth.token //<--- Lấy token trong Store của redux

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      //<- Nếu có token thì set headers
      headers.set('authorization', `Bearer ${token}`)
    }

    return headers
  }
})
```

#### Set header cho từng Request riêng biệt

```ts
 // omitted
  endpoints: (builder) => ({
    updateUser: builder.query({
      query: (user: Record<string, string>) => ({
        url: `users`,
        method: 'PUT',
        headers: { //<-- set header cho riêng method updateUser chổ này
            'content-type': 'text/plain',
        },
        body: user
      }),
    }),
```

#### Truyền Params lên URL cho từng resquest rieng biệt

```ts
 getPost: build.query<Post, string>({
      query: (id) => ({
        url: `posts/${id}`,
        headers: {
          hello: 'Binh Senior Intern'
        },
        //Bây tui muốn truyển lên server 1 cái url có params là posts/${id}?name=binh&nickname=vip
        params: {
          name: 'Binh',
          nickname: 'VIP'
        }
      })
    }),
```

![image](https://github.com/quocbinh-npm9081/Destroy-RTKQuery/assets/68917523/af5097e5-7927-47b1-96b4-a32d4d22a64a)
