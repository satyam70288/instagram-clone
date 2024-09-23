// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000/api/v1',
    credentials: 'include', // Set credentials at the base query level
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
      query: (userId) => ({
        url: `/user/getFollowingOrFollower/${userId}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    explorePost: builder.query({
      query: () => ({
        url: `/post/explore`,
        method: 'GET',
      }),
      providesTags: ['Posts'],
    }),
    searchUser: builder.query({
      query: (query) => ({
        url: `/user/search`,
        method: 'GET',
        params: { query }, // Append query parameters if needed
      }),
      providesTags: ['Users'], // Changed to 'Users' to match the context
    }),
  }),
});

export const { 
  useFollowOrUnfollowUserMutation, 
  useGetFollowingOrFollowerQuery,
  useExplorePostQuery,
  useSearchUserQuery, // Export the hook for searchUser query
} = apiSlice;
