require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APP_SECRET = process.env.APP_SECRET;
const DEFAULT_ALG = process.env.DEFAULT_ALG;
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || "transactions").split(
  ","
);
// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
  ","
);

async function signup(parent, args, { res, prisma }) {
  // no need to check for existing user create will fail if username is not unique
  try {
    let minLen = 7;
    let format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?~]/;
    if (args.password.length < minLen)
      throw new Error(
        "Password too short, needs at least " + minLen + " characters"
      );
    else if (!format.test(args.password))
      throw new Error("Password needs at least 1 special character");
    else if (!/\d/.test(args.password))
      throw new Error("Password needs at least 1 number");
    const password = await bcrypt.hash(args.password, 15);
    const user = await prisma.user.create({
      data: { username: args.username, plaidAcc: "[]", password: password },
    });
    /* default algorithm used is HS256 */
    const token = jwt.sign({ userId: user.id }, APP_SECRET, {
      algorithm: DEFAULT_ALG,
      expiresIn: "7d",
    });
    res.cookie("id", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
  } catch (err) {
    if (
      err.message.includes(
        "Unique constraint failed on the fields: (`username`)"
      )
    ) {
      throw new Error("User already exists");
    } else {
      throw err;
    }
  }
  return true;
}

async function login(parent, args, { res, prisma }) {
  const user = await prisma.user.findUnique({
    where: { username: args.username },
  });
  if (!user) throw new Error("No such user found");
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) throw new Error("Invalid password");
  const token = jwt.sign({ userId: user.id }, APP_SECRET, {
    algorithm: DEFAULT_ALG,
    expiresIn: "7d",
  });
  res.cookie("id", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  console.log("login success!");
  return true;
}

function signout(parent, args, { res }) {
  res.clearCookie("id");
  return true;
}

async function createLinkToken(parent, args, { req, client }) {
  const configs = {
    user: {
      // This should correspond to a unique id for the current user.
      // cast to string because plaid expects a string
      client_user_id: req.user.userId.toString(),
    },
    client_name: "Plaid Quickstart",
    products: PLAID_PRODUCTS,
    country_codes: PLAID_COUNTRY_CODES,
    language: "en",
  };
  console.log('create link token');
  console.log(configs);
  const data = await client.createLinkToken(configs);
  console.log(data);
  return data;
}

async function setAccessToken(parent, args, { req, prisma, client }) {
  const tokenResponse = await client.exchangePublicToken(args.token);
  const resItem = await client.getItem(tokenResponse.access_token);
  // set webhooks
  const result = await client.getInstitutionById(resItem.item.institution_id);
  await prisma.plaidItem.create({
    data: {
      itemId: tokenResponse.item_id,
      accesstoken: tokenResponse.access_token,
      name: `${result.institution.name} item`,
      owner: {
        connect: {
          id: req.user.userId,
        },
      },
    },
  });
  var webhookurl;
  if (process.env.NODE_ENV === "production") {
    webhookurl = `https://${req.header("host")}/webhook/${
      tokenResponse.item_id
    }`;
  } else {
    webhookurl = `http://3c89c6e5792a.ngrok.io/webhook/${tokenResponse.item_id}`;
  }
  await client.updateItemWebhook(tokenResponse.access_token, webhookurl);
  return true;
}

async function testWebHook(parent, _, { req, prisma, client }) {
  var itemsRes = await prisma.user
    .findUnique({ where: { id: req.user.userId } })
    .items();
  var response = [];
  for (var serverItem of itemsRes) {
    response.push(
      client.sandboxItemFireWebhook(serverItem.accesstoken, "DEFAULT_UPDATE")
    );
  }
  response = await Promise.all(response);
  return true;
}

async function updatePreference(parent, args, { req, prisma }) {
  await prisma.user.update({
    where: {
      id: req.user.userId,
    },
    data: {
      plaidAcc: args.plaidAcc,
    },
  });
  return true;
}

module.exports = {
  login,
  signup,
  signout,
  createLinkToken,
  setAccessToken,
  updatePreference,
  testWebHook,
};
