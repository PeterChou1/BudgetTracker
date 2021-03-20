import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
let history = createBrowserHistory();
const host = window.document.location.host.replace(/:.*/, "");
var uri;
if (window.location.port === "3000") {
  // in development port 4000 is default port
  uri = "http://localhost:4000/graphql";
} else {
  uri = `https://${host}:${window.location.port}/graphql`;
}

console.log(`graphql serverlink ${uri}`);
const httpLink = createHttpLink({
  credentials: 'include',
  uri
});


const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <BrowserRouter history={history}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
