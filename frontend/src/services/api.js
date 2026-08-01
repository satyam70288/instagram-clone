// src/services/api.js
import { server } from '@/constant/config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuthToken, getAuthToken } from '@/lib/authStorage';
import { removeAuthUser } from '@/redux/authSlice';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { toast } from 'sonner';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${server}/api/v1`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

let rtkLoggingOut = false;

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const status = result.error?.status;
  const message = result.error?.data?.message || '';

  if (status === 401) {
    const state = api.getState();
    if (!state.auth?.guest && state.auth?.user && !rtkLoggingOut) {
      rtkLoggingOut = true;
      clearAuthToken();
      api.dispatch(removeAuthUser());
      api.dispatch(setSelectedPost(null));
      api.dispatch(setPosts([]));
      toast.error(
        /expired/i.test(message)
          ? 'Your session has expired. Please log in again.'
          : 'Please log in again to continue.'
      );
      if (!window.location.pathname.includes('/login')) {
        window.location.assign('/login');
      }
      setTimeout(() => {
        rtkLoggingOut = false;
      }, 2500);
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User', 'Posts', 'Notification'],
  endpoints: (builder) => ({
    followOrUnfollowUser: builder.mutation({
      query: (id) => ({
        url: `/user/followorunfollow/${id}`,
        method: 'POST',
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
      providesTags: ['Notification'],
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notification/update/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useFollowOrUnfollowUserMutation,
  useGetFollowingOrFollowerQuery,
  useExplorePostQuery,
  useSearchUserQuery,
  useNotificationQuery,
  useMarkAsReadMutation
} = apiSlice;
