import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    guest: false,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
    posts: [],
  },
  reducers: {
    // actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.guest = false;
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
      state.user = null;
      state.guest = false;
      state.suggestedUsers = [];
      state.userProfile = null;
      state.selectedUser = null;
      state.posts = [];
    },
    enableGuestMode: (state) => {
      state.guest = true;
      state.user = {
        _id: "guest",
        username: "guest",
        profilePicture: "https://api.dicebear.com/9.x/thumbs/svg?seed=Guest",
        bio: "Exploring PicShare in read-only mode.",
      };
      state.userProfile = {
        _id: "guest",
        username: "guest",
        profilePicture: "https://api.dicebear.com/9.x/thumbs/svg?seed=Guest",
        bio: "Exploring PicShare in read-only mode.",
        posts: [],
        followers: [],
        following: [],
      };
      state.selectedUser = null;

      state.suggestedUsers = [
        {
          _id: "user1",
          username: "maya.travels",
          profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
          bio: "Travel, light & little moments",
          followers: [],
        },
        {
          _id: "user2",
          username: "noah.creates",
          profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
          bio: "Designer and weekend photographer",
          followers: [],
        },
        {
          _id: "user3",
          username: "sophia.foods",
          profilePicture: "https://randomuser.me/api/portraits/women/68.jpg",
          bio: "Simple recipes, beautifully shared",
          followers: [],
        }
      ];
      
      state.posts = [
        {
          _id: "post1",
          caption: "Slow mornings, warm coffee, and nowhere else to be.",
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
          author: state.suggestedUsers[0],
          likes: ["user2", "user3"],
          comments: [],
        },
        {
          _id: "post2",
          caption: "Finding inspiration in clean lines and quiet spaces.",
          image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
          author: state.suggestedUsers[1],
          likes: ["user1", "user3", "user4"],
          comments: [],
        },
        {
          _id: "post3",
          caption: "A little color makes every day better.",
          image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=85",
          author: state.suggestedUsers[2],
          likes: ["user1", "user2", "user4", "user5"],
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
