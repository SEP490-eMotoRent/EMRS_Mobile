import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id?: string;        // ✅ Added
  username?: string;  // ✅ Added
  role: string;
  fullName: string;
  branchId?: string;
  branchName?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addAuth: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    removeAuth: (state) => {
      state.token = null;
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { addAuth, removeAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;