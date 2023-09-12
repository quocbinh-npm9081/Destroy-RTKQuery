import { PayloadAction, createSlice } from '@reduxjs/toolkit'

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
    startEdit: (state: BlogState, action: PayloadAction<string>) => {
      state.postId = action.payload
    },
    canelEditPost: (state: BlogState) => {
      state.postId = ''
    }
  }
})

export const { startEdit, canelEditPost } = blogSide.actions

export default blogSide.reducer
