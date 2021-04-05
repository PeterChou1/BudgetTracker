import React, {useEffect, useContext} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Context from "../../context/Dashboard";
import Chip from '@material-ui/core/Chip';
import lunr from 'lunr';
import Grid from '@material-ui/core/Grid';


const transformOptions = (suggestions, transactions) => {
    console.log(transactions);
    var options = [];
    for (var suggestion of suggestions) {
        const metadata = suggestion.matchData.metadata;
        const matches = Object.keys(metadata);
        const ref = suggestion.ref;
        for (var match of matches) {
            if (Object.prototype.hasOwnProperty.call(metadata, match)) {
                const matchPath = Object.keys(suggestion.matchData.metadata[match])[0];
                const matchDoc = transactions.reduce( (acc, doc) => {
                    return doc.groupid ? acc.concat(doc.transactions) : acc.push(doc) && acc;
                }, []).find(doc => doc.transaction_id === ref);
                const matchedField = matchDoc[matchPath];
                var option;
                option = options.find(o => matchPath === 'category' ? o.match === match : o.match === matchedField);
                if (option) {
                    option.matchAmount += 1;
                } else {
                    options.push({
                        match : matchPath === 'category' ? match : matchedField,
                        matchPath,
                        matchAmount : 1
                    });
                }
                          
            }
        }
    }
    console.log(options);
    // sort options
    options.sort((a, b) => a.matchPath.localeCompare(b.matchPath));
    return options;
};

const AutoCompleteSearch = () => {
    //const [inputValue, setInputValue] = React.useState('');
    const [options, setOption] = React.useState([]);


    // override default behaviour use lunr instead
    const filterOptions = (options) => options;
    const { index, transactionsNonFilter, dispatch } = useContext(Context);
    return (
        <div style={{width: '100%'}}>
            <Autocomplete
                multiple
                options={options}
                filterOptions={filterOptions}
                onInputChange={(event, newInputValue) => {
                    if (index != null && newInputValue != '') {
                        // build query
                        setOption(
                            transformOptions(
                                index.query(function(q){
                                    const terms = newInputValue.split(" ");
                                    for (var term of terms) {
                                        q.term(term, {
                                            wildcard: lunr.Query.wildcard.TRAILING,
                                            presence: lunr.Query.presence.REQUIRED
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
                        type: 'SET_STATE',
                        state: {
                            filtertoken: value
                        }
                    });
                }}
                renderTags={(value, getTagProps) => {
                    return value.map((option, index) => (
                      <Chip variant="outlined" label={option.match} {...getTagProps({ index })} />
                    ))
                }}
                getOptionLabel={(option) => option.match}
                renderOption={(option) => {
                    return (
                        <React.Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={4}>
                                    {(option.match)}
                                </Grid>
                                <Grid container item xs={8} justify="flex-end">
                                    <Chip color="primary" label={`ocurrences: ${option.matchAmount}`}/>
                                    <Chip color="secondary" label={`type: ${option.matchPath.replace('_', ' ')}`}/>
                                </Grid>

                            </Grid>
                        </React.Fragment>
                    )
                }}
                renderInput={(params) =>  (
                        <TextField
                            {...params}
                            label="filter"
                            margin="normal"
                            variant="outlined"
                            InputProps={{ ...params.InputProps, type: 'search' }}
                        />
                    )
                }
            />
        </div>

    )
};

export default AutoCompleteSearch;