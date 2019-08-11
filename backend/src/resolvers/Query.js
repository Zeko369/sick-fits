const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      return null;
    }

    return ctx.db.query.user(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      return null;
    }

    hasPermission(ctx.request.user, ["ADMIN", "PREMISSIONUPDATE"]);
    return ctx.db.query.users({}, info);
  }
};

// Long version of the top thingy
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
