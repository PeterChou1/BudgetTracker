# Ideas for Proposal

## Budget Tracker 
deployed on https://budget-tracking-dev.herokuapp.com/
### team member
Peter Chou - peter.chou@mail.utoronto.ca - student number: 1004295693
Alex Andros - alexandru.andros@mail.utoronto.ca - student number: 1004354263
### description

Online portal to track and visualize your financial expenditures in interesting and insightful ways. 
- Allows users to visualize spending through a variety of methods. Line charts, Pie charts, Sankey graphs, Tree maps, Heap Maps.
- Allows users to sort between tracking daily, weekly, monthly spending. 
- Allows users to sorting by categories for spending. 
- Allows users to filtering on spending categories. 
- Allows for users to set weekly, monthly limits on spending and track progress. 
- Allows users create a spending plan and track usage of each category of spending
- Allows users to execute trade orders on specific condition on twitter (example: when elon musks tweets about doge coin immediately execute 100 buy orders for doge coin, or when elon musks tweets about weed immediately short tesla )


### Beta version

- Users can sign up or be authenticated through login portal
- Setup Basic visualizing for user financial data

### Final version
- Setup Advance visualizing Treemaps, Heat Maps, Sankey graphs
- Implement feature set limits to spending monthly
- Implemented features allowing users to create spending plan and track progress


### Technologies Used

#### frontend
- D3js  front end visualization library used to build custom graphs  documentation: https://github.com/d3/d3/wiki
- React front end is a frame work for developing websites <br/> documentation:  https://reactjs.org/docs/getting-started.html
    - redux - react state management <br/>
      documentation: https://redux.js.org/api/api-reference
    - react-router - react routing library <br/>
      documentation: https://reactrouter.com/web/guides/quick-start

#### backend 

- Plaid API  banking api used to access spending information
documentation: https://plaid.com/docs/api/

- Nodejs/Express framework used to handle server side logic <br/>
    nodejs docs: https://nodejs.org/en/docs/ <br/>
    express docs: http://expressjs.com/en/api.html <br/>

- PostgresSQL database to store user information <br/>
    documentation: https://www.postgresql.org/




### Technical Challenged faced

- Extra caution must be used when writing code handling bank information.
- Building custom charts using d3js. D3 is a low level library for building charts. Developing new custom charts will be a technical hurdle
- Front end state management. The application will track a large amount of states front as the users navigate through UI. Keeping the state management understandable and maintainable will be a technical hurdle.  
- Responsivness. The application should be fast and responsive there should not be a significant delay between user action and response from application. Writing resource efficient front end and back end code will be a technical hurdle.
- Creating an intuitive editor and budget viewer will be technical challenge.



