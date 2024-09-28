// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://instagram-clone-8h2b.onrender.com/api/v1',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    followOrUnfollowUser: builder.mutation({
      query: (id) => ({
        url: `/user/followorunfollow/${id}`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['User'],
    }),
    getFollowingOrFollower: builder.query({
      query: (userId) => `/user/getFollowingOrFollower/${userId}`,
      providesTags: ['User'],
    }),
    explorePost: builder.query({
      query: () => `/post/explore`,
      providesTags: ['Posts'],
    }),
    searchUser: builder.query({
      query: (query) => ({
        url: '/user/search',
        method: 'GET',
        params: { query },
      }),
      providesTags: ['Users'],
    }),
    notification: builder.query({
      query: () => `/notification/all`,
      providesTags: ['User', 'Posts'], // Corrected providesTags format
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notification/update/${id}`,
        method: 'PATCH',  // Correct the HTTP method to 'PATCH'
        body: {},  // You can remove `body` if it's not required
      }),
      invalidatesTags: ['Notification'],  // Ensure this matches the tag used when fetching notifications
    })
    
  }),
});

// Export hooks for usage in functional components
export const { 
  useFollowOrUnfollowUserMutation, 
  useGetFollowingOrFollowerQuery,
  useExplorePostQuery,
  useSearchUserQuery, 
  useNotificationQuery,
  useMarkAsReadMutation
} = apiSlice;
