require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const plaid = require('plaid');
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
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
const client = new plaid.Client({
    clientID: PLAID_CLIENT_ID,
    secret: PLAID_SECRET,
    env: plaid.environments[PLAID_ENV],
    options: {
      version: '2019-05-29',
    },
});

async function signup(parent, args, {res, req, prisma}) {
    const password = await bcrypt.hash(args.password, 15);
    // no need to check for existing user create will fail if username is not unique 
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
    return true;
}

async function login(parent, args, {res, req, prisma}) {
    const user = await prisma.user.findUnique({ where: { username: args.username } });
    if (!user) throw new Error('No such user found');
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) throw new Error('Invalid password');
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

async function signout(parent, args, {res, req, prisma}) {
    if (req.user) {
        res.clearCookie('id');
        return true;
    }
    throw Error('not authenticated');
}

async function createLinkToken(parent, args, {res , req, prisma}) {
    if (req.user) {
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
    throw Error('not authenticated');
}


async function setAccessToken (parent, args, {res, req, prisma}) {
    if (req.user) {
        console.log('set access token');
        console.log(args.token);
        console.log('end');
        return await new Promise(resolve => {
            console.log('exchange tokens');
            client.exchangePublicToken(args.token, async function (error, tokenResponse) {
                if (error != null) {
                  throw new Error(error);
                }
                // store in data base
                await prisma.plaidItem.create({
                    data : {
                        itemId : tokenResponse.item_id,
                        accesstoken : tokenResponse.access_token,
                        owner : {
                            connect : {
                                id : req.user.userId
                            }
                        }
                    }
                });
                resolve(true);
            });
        });
    }
    throw Error('not authenticated');
}

module.exports = {
    login,
    signup,
    signout,
    createLinkToken,
    setAccessToken
};