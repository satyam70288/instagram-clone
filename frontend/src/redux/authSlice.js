import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    guest: false,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
    posts: [],  // Posts array will hold the posts for the guest user
  },
  reducers: {
    // actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.guest = false;  // If a real user logs in, disable guest mode
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    removeAuthUser: (state) => {
      state.user = null;  // Reset user data when expired or logged out
      state.guest = false;
      state.suggestedUsers = [];
      state.userProfile = null;
      state.selectedUser = null;
      state.posts = [];  // Clear posts when the user logs out
    },
    enableGuestMode: (state) => {
      state.guest = true;
      state.user = {
        id: "guest",
        username: "Guest User",
        profilePicture: "https://via.placeholder.com/150", // Default guest avatar
        bio: "Welcome! You are exploring as a guest.",
      };
      state.userProfile = {
        id: "guest",
    username: "Guest User",
    profilePicture: "https://via.placeholder.com/150", // Default guest avatar
    bio: "Welcome! You are exploring as a guest.",
    posts: [],
    followers: [
      { id: "user1", username: "User One" },
      { id: "user2", username: "User Two" },
      // You can add more followers here
    ],
    following: [
      { id: "user3", username: "User Three" },
      { id: "user4", username: "User Four" },
      // You can add more following users here
    ]
      };
      state.selectedUser = null;

      // Dummy suggested users for guest mode
      state.suggestedUsers = [
        {
          id: "user1",
          username: "John Doe",
          profilePicture: "https://via.placeholder.com/150?text=John",
          bio: "Loves coding and coffee.",
          followers: [
            { id: "user1", username: "User One" },
            { id: "user2", username: "User Two" }
          ],
          following: [
            { id: "user3", username: "User Three" },
            { id: "user4", username: "User Four" }
          ]
        },
        {
          id: "user2",
          username: "Jane Smith",
          profilePicture: "https://via.placeholder.com/150?text=Jane",
          bio: "Traveler and photographer.",
          followers: [
            { id: "user1", username: "User One" },
            { id: "user3", username: "User Three" }
          ],
          following: [
            { id: "user4", username: "User Four" }
          ]
        },
        {
          id: "user3",
          username: "Alice Johnson",
          profilePicture: "https://via.placeholder.com/150?text=Alice",
          bio: "Tech enthusiast and gamer.",
          followers: [
            { id: "user1", username: "User One" }
          ],
          following: [
            { id: "user2", username: "User Two" },
            { id: "user4", username: "User Four" }
          ]
        },
        {
          id: "user4",
          username: "Bob Brown",
          profilePicture: "https://via.placeholder.com/150?text=Bob",
          bio: "Web designer and writer.",
          followers: [
            { id: "user2", username: "User Two" }
          ],
          following: [
            { id: "user3", username: "User Three" }
          ]
        }
      ];
      
      // Default posts for the guest
      state.posts = [
        {
          id: "post1",
          caption: "Welcome to the platform! Feel free to browse around.",
          image: "https://via.placeholder.com/500",
          author: state.user,
          likes: 0,
          comments: [],
        },
        {
          id: "post2",
          caption: "Guest user’s first post! Explore without logging in.",
          image: "",
          author: state.user,
          likes: 0,
          comments: [],
        },
      ];
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  removeAuthUser,
  enableGuestMode,
} = authSlice.actions;

export default authSlice.reducer;
