import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));
const users = JSON.parse(localStorage.getItem("users"));

const initialState = {
  user: user ? user : null,
  users:users?users:null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const adminUpdate = createAsyncThunk(
  "auth/adminUpdateProfile",
  async(data,thunkAPI)=>{
    try {
      return await authService.adminUpdate(data)
    } catch (error) {
      const message =
      (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
  
      return thunkAPI.rejectWithValue(message);
    }
  }
)
export const registerUser = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.registerUser(user)
    } catch (error) {
      const message =
      (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
  
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const sendMail = createAsyncThunk(
  "auth/verify/selle/mailr",
  async (mail, thunkAPI) => {
    try {
      return await authService.sendMail(mail)
    } catch (error) {
      const message =
      (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
  
      return thunkAPI.rejectWithValue(message);
    }
  }
);



export const getUser = createAsyncThunk("auth/getUser", async(tokens,thunkAPI)=>{
  try {

    const token = localStorage.getItem("user")
    return await authService.getUser(JSON.parse(token).data.token)
  } catch (error) {
    const message =
    (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
})
export const changePassword = createAsyncThunk("auth/changePassword",async(password,thunkAPI)=>{

    try {
      return await authService.changePassword(password)
    } catch (error) {
      const message =
      (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
  
      return thunkAPI.rejectWithValue(message);
    }
})
export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_,thunkAPI) => {
    try {
      return await authService.getAllUsers();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const verifyUser = createAsyncThunk("auth/verify/seller",async(data, thunkAPI)=>{
  try {
  
    return await authService.verifyUser(data)
  } catch (error) {
    const message =
    (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
})
export const updateProfile = createAsyncThunk("auth/updateProfile", async(body,thunkAPI)=>{
  try {
      
    return await authService.updateProfile(body)
  } catch (error) {
    const message =
    (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
})
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {

    return await authService.login(user);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("auth ", async () => {
  await authService.logout()
})

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        state.user = action.payload;
        state.users = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.users = null;
      }) .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      }).addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        state.user = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      }).addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        state.users = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      }).addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.data;
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
        
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      }).addCase(adminUpdate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminUpdate.fulfilled, (state, action) => {
        state.users = action.payload.data;
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        
      })
      .addCase(adminUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(verifyUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        state.users= action.payload
        
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(sendMail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
        
      })
      .addCase(sendMail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });;
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
