import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { BrowserRouter } from 'react-router-dom';

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
const wsLink = new WebSocketLink({
  uri : uri.replace('http', 'ws').replace('graphql', 'subscriptions'),
  options: {
    reconnect: true
  }
});

// split between using websocket and http based 
// on operation type recommended by apollo documentation
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
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
