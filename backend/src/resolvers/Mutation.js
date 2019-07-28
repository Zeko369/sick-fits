const mutations = {
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: { ...args }
      },
      info
    );

    return item;
  },
  async updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;

    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: { id: args.id }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    // Get
    const item = await ctx.db.query.item({ where }, `{id, title}`);

    // Permissions
    // TODO

    // Delete
    return await ctx.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = mutations;
