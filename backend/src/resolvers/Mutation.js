const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  },
  async signup(parent, args, ctx, info) {
    const { name, email, password } = args;
    const lower_email = email.toLowerCase(); // zEkAn.fRaN
    const hashed_password = await bcrypt.hash(password, 10);

    const user = await ctx.db.mutation.createUser(
      {
        data: {
          name,
          email: lower_email,
          password: hashed_password,
          premissions: { set: ["USER"] } // TODO: I KNOW ALI NE DA MI SE MIJNJATI
        }
      },
      info
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    const lower_email = email.toLowerCase(); // zEkAn.fRaN

    const user = await ctx.db.query.user({ where: { email: lower_email } });

    if (!user) {
      throw new Error(`No such user for ${email}`); // I think this is a security issue
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  }
};

module.exports = mutations;
