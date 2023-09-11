import { createSlice } from '@reduxjs/toolkit'

interface BlogState {
  postId: string
}

const initialState: BlogState = {
  postId: ''
}

const blogSide = createSlice({
  name: 'blog',
  initialState,
  reducers: {

  }
})

export default blogSide.reducer
