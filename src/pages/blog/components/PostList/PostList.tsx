import PostItem from '../PostItem'
import { useGetPostsQuery } from 'pages/blog/blog.services'
import SkeletonPost from '../SkeletonPost/SkeletonPost'
import { Fragment } from 'react'
import { Post } from 'types/blog.type'
export default function PostList() {
  //isLoading chạy cho lần fetch đầu tiên
  //isFetching là mỗi lần gọi API
  //thường dùng isFetching hơn isLoading
  const { data, isFetching, isLoading } = useGetPostsQuery()

  // console.log('data: ', data)
  // console.log('isFetching: ', isFetching)
  // console.log('isLoading: ', isLoading)
  // console.log('=====================')

  return (
    <div className='bg-white py-6 sm:py-8 lg:py-12'>
      <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
        <div className='mb-10 md:mb-16'>
          <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>Binh Dev Blog</h2>
          <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
            Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
          {isFetching && (
            <Fragment>
              <SkeletonPost />
            </Fragment>
          )}

          {!isFetching &&
            data?.map((post: Post) => (
              <div key={post.id}>
                <PostItem id={post.id} post={post} />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
