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
const host = window.document.location.host.replace(/:.*/, "");
var port;
if (window.location.port === "3000") {
  // in development port 4000 is default port
  port = "4000";
} else {
  port = `${window.location.port}`;
}

console.log(`graphql serverlink http://${host}:${port}/graphql`);
const httpLink = createHttpLink({
  credentials: 'include',
  uri: `http://${host}:${port}/graphql`
});


const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <BrowserRouter>
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
