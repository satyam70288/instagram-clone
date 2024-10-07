// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000/api/v1',
    credentials: 'include',  // Ensure credentials are included for cross-origin requests if required
  }),
  tagTypes: ['User', 'Posts', 'Notification'],  // Define tagTypes used in the API
  endpoints: (builder) => ({
    // Mutation to follow or unfollow a user
    followOrUnfollowUser: builder.mutation({
      query: (id) => ({
        url: `/user/followorunfollow/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],  // Invalidate 'User' cache on follow/unfollow
    }),
    
    // Query to get followers or following of a user
    getFollowingOrFollower: builder.query({
      query: (userId) => `/user/getFollowingOrFollower/${userId}`,
      providesTags: ['User'],  // Provide 'User' cache for followers or following list
    }),

    // Query to explore posts
    explorePost: builder.query({
      query: () => `/post/explore`,
      providesTags: ['Posts'],  // Provide 'Posts' cache for explore posts
    }),

    // Query to search users based on a query string
    searchUser: builder.query({
      query: (query) => ({
        url: '/user/search',
        method: 'GET',
        params: { query },  // Pass the search query as a parameter
      }),
      providesTags: ['Users'],  // Provide 'Users' cache for search results
    }),

    // Query to get all notifications
    notification: builder.query({
      query: () => `/notification/all`,
      providesTags: ['Notification'],  // Provide 'Notification' cache for notifications
    }),

    // Mutation to mark a notification as read
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notification/update/${id}`,
        method: 'PATCH',  // Use PATCH to update the notification status
      }),
      invalidatesTags: ['Notification'],  // Invalidate 'Notification' cache to refresh notifications
    }),
  }),
});

// Export hooks for each query and mutation to use in functional components
export const { 
  useFollowOrUnfollowUserMutation, 
  useGetFollowingOrFollowerQuery,
  useExplorePostQuery,
  useSearchUserQuery, 
  useNotificationQuery,
  useMarkAsReadMutation
} = apiSlice;
