const { forwardTo } = require("prisma-binding");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db")
};

// Long version of the top thingie
// async items(parent, args, ctx, info) {
//   const items = await ctx.db.query.items();
//   return items;
// }

// Cool ES6 Feature
// dogs() {
//
// } is same as
// dogs: () => {
//
// }

module.exports = Query;
