import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Context from "../../context/Dashboard";
import Chip from "@material-ui/core/Chip";
import lunr from "lunr";
import Grid from "@material-ui/core/Grid";

const transformOptions = (suggestions, transactions) => {
  var options = [];
  for (var suggestion of suggestions) {
    const metadata = suggestion.matchData.metadata;
    const matches = Object.keys(metadata);
    const ref = suggestion.ref;
    const matchDoc = transactions
      .reduce((acc, doc) => {
        return doc.groupid
          ? acc.concat(doc.transactions)
          : acc.push(doc) && acc;
      }, [])
      .find((doc) => doc.transaction_id === ref);
    options.push({
      display:
        matchDoc.merchant_name === null
          ? `transaction on ${matchDoc.date}`
          : `${matchDoc.merchant_name} ${matchDoc.date}`,
      match: ref,
      matchPath: "transaction_id",
      matchAmount: 1,
    });
    for (var match of matches) {
      if (Object.prototype.hasOwnProperty.call(metadata, match)) {
        const matchPath = Object.keys(suggestion.matchData.metadata[match])[0];
        const matchedField = matchDoc[matchPath];
        const matchedTerm = Array.isArray(matchedField)
          // eslint-disable-next-line no-loop-func
          ? matchedField.find((m) => m.toLowerCase().includes(match))
          : matchedField;
        var option;
        option = options.find((o) => o.match === matchedTerm);
        if (option) {
          option.matchAmount += 1;
        } else {
          options.push({
            display: matchedTerm,
            match: matchedTerm,
            matchPath,
            matchAmount: 1,
          });
        }
      }
    }
  }
  // sort options
  options.sort((a, b) => a.matchPath.localeCompare(b.matchPath));
  return options;
};

const AutoCompleteSearch = () => {
  const [options, setOption] = React.useState([]);
  // override default behaviour use lunr instead
  const filterOptions = (options) => options;
  const { index, transactionsNonFilter, dispatch } = useContext(Context);
  return (
    <div style={{ width: "100%" }}>
      <Autocomplete
        multiple
        options={options}
        filterOptions={filterOptions}
        onInputChange={(event, newInputValue) => {
          if (index != null && newInputValue !== "") {
            // build query
            var tokens = lunr
              .tokenizer(newInputValue)
              .map((token) => lunr.stemmer(token).toString());
            //console.log(index.query(q => q.term(tok)));
            setOption(
              transformOptions(
                index.query(function (q) {
                  for (var token of tokens) {
                    q.term(token, {
                      wildcard:
                        lunr.Query.wildcard.LEADING |
                        lunr.Query.wildcard.TRAILING,
                      presence: lunr.Query.presence.REQUIRED,
                    });
                  }
                }),
                transactionsNonFilter
              )
            );
          }
        }}
        onChange={(event, value) => {
          dispatch({
            type: "SET_STATE",
            state: {
              filtertoken: value,
            },
          });
        }}
        renderTags={(value, getTagProps) => {
          return value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.display}
              {...getTagProps({ index })}
            />
          ));
        }}
        getOptionLabel={(option) => option.match}
        renderOption={(option) => {
          return (
            <React.Fragment>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  {option.display}
                </Grid>
                <Grid container item xs={8} justify="flex-end">
                  <Chip color="primary" label={`hits: ${option.matchAmount}`} />
                  <Chip
                    color="secondary"
                    label={`type: ${option.matchPath.replace("_", " ")}`}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="search"
            margin="normal"
            variant="outlined"
            InputProps={{ ...params.InputProps, type: "search" }}
          />
        )}
      />
    </div>
  );
};

export default AutoCompleteSearch;
