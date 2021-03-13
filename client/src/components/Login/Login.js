import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useMutation, gql } from '@apollo/client';
import '../../styles/Login.css';
const SIGNUP_MUTATION = gql`
  mutation SignupMutation( 
    $username: String!
    $password: String!
  ) {
    signup(
      username: $username
      password: $password
    )
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $username: String!
    $password: String!
  ) {
    login(
        username: $username, 
        password: $password
    )
  }
`;
const titleStyle = {
  color: "lightblue",
  fontSize: "30px",
  marginTop: "70px",
  marginBottom:"30px"
};
const textStyle = {
  fontSize: "20px",
  marginLeft: "20px",
  marginRight: "20px",
  marginBottom: "20px",
  height: "50px",
  fontFamily: '"Lucida Console", "Courier New", monospace'
}
const Login = () => {
  const history = useHistory();
  const [formState, setFormState] = useState({
    login: true,
    password: '',
    username: ''
  });
  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      username: formState.username,
      password: formState.password
    },
    onCompleted: (val) => {
        console.log(val);
        history.push('/items');
    }
  });
  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      username: formState.username,
      password: formState.password
    },
    onCompleted: (val) => {
      console.log(val);
      history.push('/items');
    }
  });
  return (
    <div class="sign-page">
      <h4 className="mv3" style={titleStyle}>
        {formState.login ? 'Login' : 'Sign Up'}
      </h4>
      <div className="flex flex-column">
        <input
          value={formState.username}
          style={textStyle}
          onChange={(e) =>
            setFormState({
              ...formState,
              username: e.target.value
            })
          }
          type="text"
          placeholder="Enter your username"
        />
        <input
          value={formState.password}
          style={textStyle}
          onChange={(e) =>
            setFormState({
              ...formState,
              password: e.target.value
            })
          }
          type="password"
          placeholder="Enter your password"
        />
      </div>
      <div className="flex mt3"></div>
        <div class="button-placeholder">
          <button
            className="pointer mr2 button login"
            onClick={formState.login ? login : signup} 
          >
            {formState.login ? 'Login' : 'Sign up'}
          </button>
          <div class="text-holder" style = {{marginTop:"20px"}}>
          <p2>{formState.login ? "Not registered? " : "Already have an account? "}</p2>
          <p2 class="change-window" onClick={(e) =>
            setFormState({
              ...formState,
              login: !formState.login
            })}>{formState.login ? "Sign up" : "Log in"}</p2>
          </div>

        </div>
    </div>
  );
};

export default Login;