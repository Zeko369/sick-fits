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
  },
  async order(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You arent logged in");
    }

    const order = await ctx.db.query.order({ where: { id: args.id } }, info);

    const ownsOrder = order.user.id === userId;
    const hasPermission = ctx.request.user.permissions.includes("ADMIN");

    if (!ownsOrder || !hasPermission) {
      throw new Error("Cant see this");
    }

    return order;
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You need to be logged in");
    }

    return ctx.db.query.orders({ where: { user: { id: userId } } }, info);
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
