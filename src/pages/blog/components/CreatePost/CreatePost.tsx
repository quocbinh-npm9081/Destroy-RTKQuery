import { useAddPostMutation, useGetPostQuery, useUpdatePostMutation } from 'pages/blog/blog.services'
import { useMemo, useState } from 'react'
import { Post } from 'types/blog.type'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { useEffect } from 'react'
import { canelEditPost } from 'pages/blog/blog.slice'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { SerializedError } from '@reduxjs/toolkit'
import { isEntityError, isSeriallizedError } from 'utils/helpers'
import classNames from 'classnames'
const initialState: Omit<Post, 'id'> = {
  title: '',
  description: '',
  publishDate: '',
  featuredImage: '',
  published: true
}

type FormError =
  | {
      // [key in keyof Omit<Post, 'id'>]: string
      //thay vì viết như ở trên thì mình có thể viết như ở dưới
      //Mang ý nghĩa các key bên trong FormError có thể trùng với các key trong initialState
      [key in keyof typeof initialState]: string
    }

export default function CreatePost() {
  const [formData, setFormData] = useState<Omit<Post, 'id'> | Post>(initialState)
  //Unlike the query, Mutation rreturn a tuple , the Mutation hook doesn't execute automatically
  //Không giống như Query hook, Mutation hook không tự dộng trả về, mà ta phải tự đặt các trigger tương ứng với bên trong source của nó
  const [addPost, addPostResult] = useAddPostMutation()
  const [updatePost, updatePostResult] = useUpdatePostMutation()
  // This is the mutation triggers
  // This is the destructured mutation result]   = useUpdatePostMutation();
  const postId = useSelector((state: RootState) => state.blog.postId)
  const { data } = useGetPostQuery(postId, { skip: !postId }) //Nếu PostID không có thì không cần gọi lại
  const dispatch = useDispatch()

  const errorForm: FormError | null = useMemo(() => {
    //vì errorResults có thể là  FetchBaseQueryError | SerializedError | undefined, mỗi kiểu lại có cấu trúc khách nhau
    //Nêu chúng ta cần kiểm tra để hiển thị cho đúng
    const errorResults: FetchBaseQueryError | SerializedError | undefined = postId
      ? updatePostResult.error
      : addPostResult.error

    //Vì mình không biết errorResults trả về kiểu nào trong 2 kieur  FetchBaseQueryError | SerializedError  nên minh phải kiểm tra xem thử data và status trong 2 trường hợp errosResults là  FetchBaseQueryError | SerializedError
    // if ((errorResults as FetchBaseQueryError).data && (errorResults as FetchBaseQueryError).status) {
    //   return errorResults as any
    // }
    // if ((errorResults as SerializedError).code && (errorResults as SerializedError).message) {
    //   return errorResults as any
    // }
    //NẾU SỬ DỤNG CÁC Ở TRÊN THÌ GÀ QUÁ NÊN PHẢI PREDICATE NÓ TRONG FILE /src/utils/helpers.ts
    //Thằng errosResults có quá nhiều type nên ta phải typp predicate

    if (isEntityError(errorResults)) {
      console.log('isEntityError: ', errorResults)

      //Sau khi type predicate thì errorResult đã chuyển thành kiểu FetchBaseQueryError
      //có thê ép kiẻu ngay chổ này được , vì chúng ra đã kiểm tra chắc chắn rồi
      //Nếu không muốn ép kiểu thì có thẻ khai báo cais interface `EnityError` sao cho tương dồng với FormError là được
      return errorResults.data.error as FormError
    }

    // if (isSeriallizedError(errorResults)) {
    //   return errorResults
    // }

    return null
  }, [postId, updatePostResult, addPostResult])

  const handelSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      if (Boolean(postId)) await updatePost({ id: postId, body: formData }).unwrap()
      else await addPost(formData).unwrap()
      setFormData(initialState)
    } catch (error) {
      console.log('error: Something wrong', error)
    }
  }

  const handleCanel = () => {
    dispatch(canelEditPost())
    setFormData(initialState)
  }

  useEffect(() => {
    if (data) setFormData(data)
  }, [data])

  return (
    <form onSubmit={handelSubmit}>
      <div className='mb-6'>
        <label htmlFor='title' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
          Title
        </label>
        <input
          type='text'
          id='title'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Title'
          required
          value={formData.title}
          onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='featuredImage' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
          Featured Image
        </label>
        <input
          type='text'
          id='featuredImage'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Url image'
          required
          value={formData.featuredImage}
          onChange={(event) => setFormData((prev) => ({ ...prev, featuredImage: event.target.value }))}
        />
      </div>
      <div className='mb-6'>
        <div>
          <label htmlFor='description' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400'>
            Description
          </label>
          <textarea
            id='description'
            rows={3}
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            placeholder='Your description...'
            required
            value={formData.description}
            onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
          />
        </div>
      </div>
      <div className='mb-6'>
        <label
          htmlFor='publishDate'
          className={classNames('mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300', {
            'text-red-700': Boolean(errorForm?.publishDate),
            'text-gray-900': !Boolean(errorForm?.publishDate)
          })}
        >
          Publish Date
        </label>
        <input
          type='datetime-local'
          id='publishDate'
          className={classNames(
            'block w-56 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500',
            {
              'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-blue-500':
                Boolean(errorForm?.publishDate),
              ' border-gray-300 bg-gray-50': !Boolean(errorForm?.publishDate)
            }
          )}
          placeholder='Title'
          required
          value={formData.publishDate}
          onChange={(event) => setFormData((prev) => ({ ...prev, publishDate: event.target.value }))}
        />
      </div>

      {errorForm?.publishDate && (
        <p className='mt-2 text-sm text-red-600'>
          <span className='font-medium'>Lỗi !</span>
          {errorForm?.publishDate}
        </p>
      )}

      <div className='mb-6 flex items-center'>
        <input
          id='publish'
          type='checkbox'
          checked={formData.published}
          className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
          onChange={(event) => setFormData((prev) => ({ ...prev, published: event.target.checked }))}
        />
        <label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
          Publish
        </label>
      </div>
      <div>
        {!Boolean(postId) && (
          <button
            className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
            type='submit'
          >
            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
              Publish Post
            </span>
          </button>
        )}

        {Boolean(postId) && (
          <>
            <button
              // type='submit'
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Update Post
              </span>
            </button>
            <button
              type='reset'
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
              onClick={() => handleCanel()}
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Cancel
              </span>
            </button>
          </>
        )}
      </div>
    </form>
  )
}
