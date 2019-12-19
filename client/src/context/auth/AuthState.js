import React, {useReducer} from 'react';
import axios from 'axios';
import AuthContext from '../auth/authContext';
import AuthReducer from '../auth/authReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_ERRORS,
  AUTH_ERROR,
  USER_LOADED
} from '../types';

const AuthState = props => {
  const initialState = {
    token : localStorage.getItem('token'),
    isAuthenticated : null,
    loading : true,
    user : null,
    error : null
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const loadUser = async () => {

    if(localStorage.token){
      setAuthToken(localStorage.token);
    }

    try{
      const res = await axios.get('api/auth');
      dispatch({
        type : USER_LOADED,
        payload : res.data
      });
    }catch(err) {
      dispatch({
        type : AUTH_ERROR
      })
    }
  }

  const register = async formData => {
    const config = {
      headers : {
        'Content-Type' : 'application/json'
      }
    };

    try{
      const res =  await axios.post('/api/users', formData, config);

      dispatch({
        type : REGISTER_SUCCESS,
        payload : res.data
      });

      loadUser();

    }catch (err){
      dispatch({
        type : REGISTER_FAIL,
        payload : err.response.data.msg
      });
    }
  };

  const login = async formData => {
    const config = {
      headers : {
        'Content-Type' : 'application/json'
      }
    };

    try{
      const res =  await axios.post('/api/auth', formData, config);

      dispatch({
        type : LOGIN_SUCCESS,
        payload : res.data
      });

      loadUser();

    }catch (err){
      dispatch({
        type : LOGIN_FAIL,
        payload : err.response.data.msg
      });
    }
  };

  const logout = () => dispatch({type : LOGOUT});

  const clearErrors = () => dispatch({type : CLEAR_ERRORS});

  return(
    <AuthContext.Provider
      value = {{
        token : state.token,
        isAuthenticated : state.isAuthenticated,
        loading : state.loading,
        user : state.user,
        error : state.error,
        login,
        loadUser,
        register,
        clearErrors,
        logout
      }} >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
