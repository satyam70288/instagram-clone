// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/v1' }),
  endpoints: (builder) => ({
    followOrUnfollowUser: builder.mutation({
      query: (id) => ({
        url: `/user/followorunfollow/${id}`,
        method: 'POST',
        body: {},
        credentials: 'include',
      }),
      // Tag this mutation to invalidate relevant cache
      invalidatesTags: ['User'],
    }),
    getFollowingOrFollower: builder.query({
      query: (userId) => ({
        url: `/user/getFollowingOrFollower/${userId}`,
        method: 'GET',
        credentials: 'include',
      }),
      // Provide this tag for caching the query result
      providesTags: ['User'],
    }),
    // Define other endpoints here
  }),
});

export const { 
  useFollowOrUnfollowUserMutation, 
  useGetFollowingOrFollowerQuery 
} = apiSlice;
