import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'

//nếu bên slice chúng ta dùng CreateSlice để tạo slice thì bên RTK query dung CreateApi
// với createapi chúng ta gọi là slice api
//Chúng ta sẽ khai báo baseUrl và các endpoints

//baseQuery được dùng cho mỗi endpont để fetch api

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
  tagTypes: ['Posts'], // Những kiểu tag được phép dùng trong blogAPI
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (build) => ({
    //GenericType theo thứ tự là kiểu response trả về và argument
    getPosts: build.query<Post[], void>({
      query: () => 'posts', //baseUrl + post = http://localhost:4000/posts

      //providerTags là cái sẽ trả về khi phương thước POST nào đó gọi đến thuông qua invalidatesTags dc viết ben trong POST method
      //nếu invalidatesTag naofm atch với providesTags này thì sx làm getPost method được chạy lại
      providesTags: (result) => {
        // Cài này sẽ chạy mỗi lần getPost được gọi
        // Mong muốn trả về kiẻu
        // interface Tags: {
        //   type:"Posts", // trùng với  tagTypesv
        //   id:string
        // }[]
        // vì thế phải them as const để đảm bảo nó là read only không thể mutaion
        if (result) {
          // result là mảng các bài post
          console.log('Result respone getPost', result)

          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            {
              type: 'Posts' as const,
              id: 'LIST'
            }
          ]

          return final
        }
        return [{ type: 'Posts' as const, id: 'LIST' }]
      }
    }),
    getPost: build.query<Post, string>({
      query: (id) => `posts/${id}`
    }),
    // Chúng ta dùng mutation đối với các trường hợp POST, PUT, DELETE
    // Post là responsive trả về và Omit<Post, 'id'> là body gửi lên (đã loại bỏ id) nếu là Partial<Post> có ngĩa là body gửi lên có thể thiếu 1 số thuộc tính của Post

    //Có 2 cách để update UI sao khi post
    //Cách truyền thống như trước giờ em vẫn làm đó là post body lên seveer là server trả về dữ liệu của post đó
    //Lấy dữ liệu server trả về và update vào state redux
    //React thấy state Redux thay đổi nên nó sẽ automatically re-render update ui
    //Rủi ro ==> là nếu khi gọi request add post mà server trả về data không đủ các field để chúng ta hiển thị thì sẽ bị lỗi hoặc bắt buộc handle rất mệt, Chưa kể chúng ra phải quản lú việc cập nhập state trong redux rất mêt( I so mother fucking tired)

    //Cách 2: Đây là cách thường dùng với RTK query
    //- Sau khi post lên server , server sé trả về dữ liệu của post đó
    //- Ta không sử dụng dữ liệu trả về mà tiến hành call api get toàn bộ 1 lần nữa
    //- Lấy dữ lieuj từ lần call get api để update state redux
    // => ui update
    //====> Điều này đảm bảo dữ liệu phía dưới local luôn luôn mới,
    //Việc này dẫn đến phair call them 1 lần nữa như ng như vậy là không đáng kể
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        return {
          url: 'posts',
          method: 'POST',
          body: body
        }
      },
      //body là ở cient truyền lên cái gì thì ở đây ta nhận cái đấy
      //invalidatesTags cung cấp các tags nếu các tag match với providesTags thì providesTags đó sẽ được gọi lại
      invalidatesTags: (result, error, body) => [{ type: 'Posts', id: 'LIST' }] // kết quả này giống hệt với return trong providesTags của getPost nên getPost sẽ được gợi lại
    }),
    updatePost: build.mutation<Post, { id: string; body: Partial<Post> }>({
      query(data) {
        // throw new Error(' Lỗi rồi') <--- Lỗi này do người viết code tự đặt RTK sẽ tự động trả về SerializeError
        //Ngược lại, nếu call API lỗi và server trả về messageCode error thì RTK trả về lỗi dưới dạng FetchBaseQueryError
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      //trong trường hợp update hoặc delete thì phải dựa vào id, nên mình nên invalidatesTags theo id để id: "LIST" cũng được nhưng nó sẽ không clear code
      invalidatesTags: (result, error, data) => [{ type: 'Posts', id: data.id }]
    }),
    deletePost: build.mutation<Post, string>({
      query: (id) => {
        return {
          url: `posts/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Posts', id: id }]
    })
  })
})

export const { useGetPostsQuery, useGetPostQuery, useAddPostMutation, useUpdatePostMutation, useDeletePostMutation } =
  blogApi // tự phát sinh từ endPoints
