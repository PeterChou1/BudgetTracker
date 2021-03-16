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
  marginBottom:"20px"
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
  const error = React.createRef();
  const history = useHistory();
  const [formState, setFormState] = useState({
    login: true,
    password: '',
    username: ''
  });
  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: (val) => {
        console.log(val);
        history.push('/items');
    },
    onError: (err) => {
      console.log('error occurred');
      console.log(err);
    }
  });
  const [signup] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (val) => {
      console.log(val);
      history.push('/items');
    },
    errorPolicy: 'all'
  });
  function filterEmpty(e) {
    if (!(formState.username && formState.password)) {
      error.current.innerHTML = "Login or password are empty";
      error.current.style.display = "block";
    } else {
      error.current.style.display = "none";
      if (formState.login) {
        login({    variables: {
          username: formState.username,
          password: formState.password
        },});
      }
      else {
        signup({    variables: {
          username: formState.username,
          password: formState.password
        },});
      } 
    }
  }
  return (
    <div className="main-page">
      <div className="sign-page">
        <h4 className="mv3" style={titleStyle}>
          {formState.login ? 'Login' : 'Sign Up'}
        </h4>
        <div className="flex flex-column">
          <div id="error-box" ref={error}></div>
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
          <div className="button-placeholder">
            <button
              className="pointer mr2 button login"
              onClick={filterEmpty} 
            >
              {formState.login ? 'Login' : 'Sign up'}
            </button>
            <div className="text-holder" style = {{marginTop:"20px"}}>
            <p>{formState.login ? "Not registered? " : "Already have an account? "}</p>
            <p className="change-window" onClick={(e) =>
              setFormState({
                ...formState,
                login: !formState.login
              })}>{formState.login ? "Sign up" : "Log in"}</p>
            </div>

          </div>
      </div>
    </div>

  );
};

export default Login;