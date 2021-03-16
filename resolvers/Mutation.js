require('dotenv').config();
<<<<<<< HEAD
const { Error, console } = require('@ungap/global-this');
=======
const { ApolloServer, AuthenticationError, UserInputError} = require("apollo-server");
>>>>>>> Added error handling for password and user
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const APP_SECRET = process.env.APP_SECRET;
const DEFAULT_ALG = process.env.DEFAULT_ALG;
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(
    ',',
);
// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
    ',',
);
async function signup(parent, args, {res, req, prisma}) {
    let minLen = 7;
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (args.password.length < minLen) throw new UserInputError("Password too short, needs at least "+minLen+" characters");
    else if (!format.test(args.password)) throw new UserInputError("Password needs at least 1 special character");
    else if (!/\d/.test(args.password)) throw new UserInputError("Password needs at least 1 number");
    const password = await bcrypt.hash(args.password, 15);
    // no need to check for existing user create will fail if username is not unique
    try {
        const user = await prisma.user.create({ data: { ...args, password}});
        /* default algorithm used is HS256 */
        const token = jwt.sign(
            { userId : user.id }, 
            APP_SECRET, 
            { 
                algorithm: DEFAULT_ALG,
                expiresIn: '7d'
            }
        );
        res.cookie("id", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });
    }
    catch(err) {
        if (err.message.includes("Unique constraint failed on the fields: (`username`)")){
            throw new AuthenticationError('User already exists');
        }
        else {
            throw err;
        }
    }
    return true;
}

async function login(parent, args, {res, prisma}) {
    console.log('login request recieved for ', args.username);
    const user = await prisma.user.findUnique({ where: { username: args.username } });
    if (!user) throw new AuthenticationError('No such user found');
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) throw new AuthenticationError('Invalid password');
    const token = jwt.sign(
        { userId : user.id }, 
        APP_SECRET, 
        { 
            algorithm: DEFAULT_ALG,
            expiresIn: '7d'
        }
    );
    console.log('logged in set cookie');
    res.cookie("id", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
    return true;
}

function signout(parent, args, {res}) {
    res.clearCookie('id');
    return true;
}

async function createLinkToken(parent, args, {req, client}) {
    return await new Promise((resolve) => {
        console.log(req.user);
        const configs = {
            user: {
                // This should correspond to a unique id for the current user.
                // cast to string because plaid expects a string
                client_user_id: req.user.userId.toString(),
            },
            client_name: 'Plaid Quickstart',
            products: PLAID_PRODUCTS,
            country_codes: PLAID_COUNTRY_CODES,
            language: 'en',
        };
        client.createLinkToken(configs, function(error, createTokenResponse) {
            if (error != null) {
                throw Error(error);
            }
            resolve(createTokenResponse);
        });
    });
}


async function setAccessToken (parent, args, {req, prisma, client}) {
    return await new Promise(resolve => {
        console.log('exchange tokens');
        client.exchangePublicToken(args.token, async (error, tokenResponse) => {
            if (error != null) {
                throw new Error(error);
            }
            // access item information
            const resItem = await client.getItem(tokenResponse.access_token).catch((error) => {
                if (error !== null) throw Error(error);
            });
            // get institution id information
            client.getInstitutionById(resItem.item.institution_id, async (error, result) => {
                if (error != null) throw new Error(error);
                console.log({
                    data : {
                        itemId : tokenResponse.item_id,
                        accesstoken : tokenResponse.access_token,
                        name : `${result.institution.name} item`,
                        owner : {
                            connect : {
                                id : req.user.userId
                            }
                        }
                    }
                });
                await prisma.plaidItem.create({
                    data : {
                        itemId : tokenResponse.item_id,
                        accesstoken : tokenResponse.access_token,
                        name : `${result.institution.name} item`,
                        owner : {
                            connect : {
                                id : req.user.userId
                            }
                        }
                    }
                });
                console.log('resolved true');
                resolve(true);
            });
        });
    });
}

module.exports = {
    login,
    signup,
    signout,
    createLinkToken,
    setAccessToken
};