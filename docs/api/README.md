# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

- [Query](#query)
- [Mutation](#mutation)
- [Objects](#objects)
  - [Account](#account)
  - [Group](#group)
  - [LinkToken](#linktoken)
  - [PlaidItem](#plaiditem)
  - [Subscription](#subscription)
  - [Transaction](#transaction)
  - [TransactionUpdate](#transactionupdate)
  - [User](#user)
- [Inputs](#inputs)
  - [FilterToken](#filtertoken)
  - [Items](#items)
- [Enums](#enums)
  - [GroupBy](#groupby)
  - [Sort](#sort)
  - [SortBy](#sortby)
- [Scalars](#scalars)
  - [Boolean](#boolean)
  - [Float](#float)
  - [ID](#id)
  - [Int](#int)
  - [String](#string)
- [Unions](#unions)
  - [TransactionResult](#transactionresult)

</details>

## Query

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>getuser</strong></td>
<td valign="top"><a href="#user">User</a>!</td>
<td> Retrieves a Users own profile <br>
(User must be authenticated to access this endpoint)
</td>
</tr>
</tbody>
</table>

## Mutation

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>login</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>Authenticates user via JWT will set a session cookie for Authorization</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">username</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">password</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>signup</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>Validates password and username to match password policy, stores credientials and authenticates users by setting session cookie</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">username</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">password</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>signout</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>Signs out user by deleting session cookie <br> (User must be authenticated to access this endpoint)</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>createLinkToken</strong></td>
<td valign="top"><a href="#linktoken">LinkToken</a></td>
<td>creates Link Token to interface with Plaid Link is called on signin <br> (User must be authenticated to access this endpoint)</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>setAccessToken</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>Exchanges public token obtain through Plaid link for access tokens <br>
(User must be authenticated to access this endpoint)</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">token</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>testWebHook</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>test plaid webhook functionality by forcing plaid to fire webhook at server <br> (User must be authenticated to access this endpoint)</td>
</tr>
</tbody>
</table>

## Objects

### Account

<div>
Individual account associated under an Item
</div>

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>account_id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td> plaid account id</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td> plaid institution name</td>
</tr>
</tbody>
</table>

### Group

<div> Data Type returned when specifing anything other than TRANSACTION for <a href="#groupby">Group</a> when trying to getTransaction from <a href="#user">User</a></div>
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>groupid</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td> </td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>amount</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>transactions</strong></td>
<td valign="top">[<a href="#transaction">Transaction</a>]</td>
<td></td>
</tr>
</tbody>
</table>

### LinkToken

<div>Used Internal by Plaid Link to launch the plaid link client</div>

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>expiration</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>link_token</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>request_id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>status_code</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### PlaidItem

<div>
A plaid item represents an account signed up under a user. It contains all accounts associated with a bank credential as well as its institution name
</div>
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>itemId</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>accounts</strong></td>
<td valign="top">[<a href="#account">Account</a>]!</td>
<td></td>
</tr>
</tbody>
</table>

### Subscription

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>transactionUpdate</strong></td>
<td valign="top"><a href="#transactionupdate">TransactionUpdate</a></td>
<td> subscription for transaction data of user may optionally pass an array of items to only subscribe to a portion of updates </td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">items</td>
<td valign="top">[<a href="#items">Items</a>]</td>
<td></td>
</tr>
</tbody>
</table>

### Transaction
<div> 
A Transactions Record that is obtained from the plaid API
</div>

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>transaction_id</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>account_id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>date</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>iso_currency_code</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>category</strong></td>
<td valign="top">[<a href="#string">String</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>amount</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>payment_channel</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>merchant_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### TransactionUpdate

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>webhook_code</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>item_id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>error</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>new_transactions</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
</tbody>
</table>

### User

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>username</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>items</strong></td>
<td valign="top">[<a href="#plaiditem">PlaidItem</a>]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">containsid</td>
<td valign="top">[<a href="#id">ID</a>]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>getTransaction</strong></td>
<td valign="top">[<a href="#transactionresult">TransactionResult</a>]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">items</td>
<td valign="top">[<a href="#items">Items</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">startDate</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">endDate</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter</td>
<td valign="top">[<a href="#filtertoken">FilterToken</a>]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">group</td>
<td valign="top"><a href="#groupby">GroupBy</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">sortBy</td>
<td valign="top"><a href="#sortby">SortBy</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">sort</td>
<td valign="top"><a href="#sort">Sort</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">skip</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">take</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
</tbody>
</table>

## Inputs

### FilterToken
<div>
Input type to provide the resolver with which information will be used to filter out transactions.
</div>
<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>match</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>matchPath</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Items
<div>
Input type to specify which items the resolver will get the data from
</div>
<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>itemId</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>accounts</strong></td>
<td valign="top">[<a href="#string">String</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

## Enums

### GroupBy
<div> used to specify to resolver how to group transaction data</div>
<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>TRANSACTION</strong></td>
<td>Group by individual transactions</td>
</tr>
<tr>
<td valign="top"><strong>DAY</strong></td>
<td>Group by 24 hr days</td>
</tr>
<tr>
<td valign="top"><strong>WEEK</strong></td>
<td>Group by Weeks</td>
</tr>
<tr>
<td valign="top"><strong>MONTH</strong></td>
<td>Group by Months</td>
</tr>
<tr>
<td valign="top"><strong>CATEGORY_1</strong></td>
<td>Group by simple categories</td>
</tr>
<tr>
<td valign="top"><strong>CATEGORY_2</strong></td>
<td>Group by complex categories</td>
</tr>
<tr>
<td valign="top"><strong>NAME</strong></td>
<td>Group by merchant name of the transaction</td>
</tr>
</tbody>
</table>

### Sort
<div>Enum to indicate how to sort data</div>
<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>ASC</strong></td>
<td>Ascending</td>
</tr>
<tr>
<td valign="top"><strong>DESC</strong></td>
<td></td>
</tr>
</tbody>
</table>

### SortBy
<div>Enum to indicate what to sort by</div>
<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>DATE</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>AMOUNT</strong></td>
<td></td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

The `Boolean` scalar type represents `true` or `false`.

### Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

### ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

## Unions

### TransactionResult
<div>Return value for getTransaction mutation if the User specified grouped by TRANSACTION the server will return an array of Transaction. If users specified any other grouping getTransaction will return an array of Groups</div>
<table>
<thead>
<th align="left">Type</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong><a href="#transaction">Transaction</a></strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong><a href="#group">Group</a></strong></td>
<td></td>
</tr>
</tbody>
</table>
