import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'

//nếu bên slice chúng ta dùng CreateSlice để tạo slice thì bên RTK query dung CreateApi
// với createapi chúng ta gọi là slice api
//Chúng ta sẽ khai báo baseUrl và các endpoints

//baseQuery dduowcjdungf cho mỗi endpont để fetch api

//fetchBaseQuery là 1 func nhỏe được xây dựng trên fetch api
//Nó không thay thế hoàn toàn được Axios nhưng sẽ giải quyết hầu hết các vấn đè của bạn
//Chúng ta có thể dùng axuos để thay thế

//endPoints là tập hợp những menthods giúp Get, put,post, delete... tương tác với server
//Khi khai báo endPoints nó sẽ sinh ra cho ta những hook để ta tương tác , sử dụng trong Compoennt
//endPoints: có 2 kiểu là query và mutation
//Query thường dùng cho GET
//Mutation: thường dùng cho các trường hợp thay đổi dữ liệu trên server

export const blogApi = createApi({
  reducerPath: 'blogApi', // Tên field trong Redux State
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (build) => ({
    //GenericType theo thứ tự là kiểu response trả về và argument
    getPosts: build.query<Post[], void>({
      query: () => 'posts' //baseUrl + post = http://localhost:4000/posts
    })
  })
})

export const { useGetPostsQuery } = blogApi // tự phát sinh từ endPoints
