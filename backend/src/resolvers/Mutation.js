const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const { transport, makeANiceEmail } = require("../mail");
const { hasPermission } = require("../utils");
const stripe = require("../stripe");

const mutations = {
  async createItem(parent, args, ctx, info) {
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error("You must be logged in to do that");
    }

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          user: {
            connect: {
              id: userId
            }
          }
        }
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
    const { userId, user } = ctx.request;

    if (!userId) {
      throw new Error("You must be logged in to do that");
    }

    const where = { id: args.id };

    // Get
    const item = await ctx.db.query.item({ where }, `{id, title, user {id}}`);

    // Permissions
    const ownsItem = item.user.id === userId;
    const hasPermission = user.permissions.some((permission) =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );

    // Delete
    if (!ownsItem && !hasPermission) {
      throw new Error("You cant delete this");
    }

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
          permissions: { set: ["USER"] } // TODO: I KNOW ALI NE DA MI SE MIJNJATI
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
  },
  async signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { text: "Logged out" };
  },
  async requestReset(parent, args, ctx, info) {
    const { email } = args;
    const lower_email = email.toLowerCase();
    const user = await ctx.db.query.user({ where: { email: lower_email } });

    if (!user) {
      throw new Error(`No such user for ${email}`); // I think this is a security issue
    }

    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    const res = await ctx.db.mutation.updateUser({
      where: { email: lower_email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    const mailRes = await transport.sendMail({
      from: "sick@fits.com",
      to: user.email,
      subject: "Password reset token",
      html: makeANiceEmail(`Your password reset token is \n\n
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Reset token</a>\n\n${resetToken}`)
    });

    return { text: "Password reset link sent" };
  },
  async resetPassword(parent, args, ctx, info) {
    const { password, resetToken } = args;

    const [user] = await ctx.db.query.users({
      where: { resetToken, resetTokenExpiry_gte: Date.now() - 3600000 }
    });

    if (!user) {
      throw new Error(`No such reset token or expired`);
    }

    const hashed_password = await bcrypt.hash(password, 10);

    await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        password: hashed_password,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  },
  async updatePermissions(parent, args, ctx, info) {
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error("You must be logged in to do that");
    }

    const currentUser = await ctx.db.query.user(
      { where: { id: userId } },
      "{permissions}"
    );

    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);

    return ctx.db.mutation.updateUser(
      {
        where: { id: args.userId },
        data: {
          permissions: {
            set: args.permissions
          }
        }
      },
      info
    );
  },
  async addToCart(parent, args, ctx, info) {
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error("You must be logged in to do that");
    }

    console.log(ctx.db.query);

    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });

    if (existingCartItem) {
      console.log("Has this");
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 }
        },
        info
      );
    }

    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: { connect: { id: userId } },
          item: { connect: { id: args.id } }
        }
      },
      info
    );
  },
  async removeFromCart(parent, args, ctx, info) {
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error("You must be logged in to do that");
    }

    const item = await ctx.db.query.cartItem(
      {
        where: { id: args.id }
      },
      "{user {id}}"
    );

    if (item) {
      if (item.user.id === userId) {
        return ctx.db.mutation.deleteCartItem({ where: { id: args.id } }, info);
      } else {
        throw new Error("You cant delete that item");
      }
    }

    throw new Error("Item not found");
  },
  async createOrder(parent, args, ctx, info) {
    // Get user
    const { userId } = ctx.request;

    if (!userId) {
      throw new Error("You must be logged in to do that");
    }

    const user = await ctx.db.query.user(
      {
        where: {
          id: userId
        }
      },
      `{
          id
          name
          email
          cart {
            id
            quantity
            item {
              id
              title
              price
              description
              image
              largeImage
            }
          }
        }`
    );

    // Calc total
    const amount = user.cart.reduce(
      (all, cartItem) => all + cartItem.item.price * cartItem.quantity,
      0
    );
    console.log(amount);

    // Create stripe charge
    const charge = await stripe.charges.create({
      amount,
      currency: "USD",
      source: args.token
    });

    // Cart items -> Order Items
    const orderItems = user.cart.map((cartItem) => {
      const orderItem = {
        quantity: cartItem.quantity,
        user: {
          connect: { id: userId }
        },
        ...cartItem.item
      };

      delete orderItem.id;
      return orderItem;
    });

    // Create an order
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId } }
      }
    });

    // clean up cart, delete cart items
    const cartItemIds = user.cart.map((cartItem) => cartItem.id);
    await ctx.db.mutation.deleteManyCartItems({
      where: { id_in: cartItemIds }
    });

    // return order
    return order;
  }
};

module.exports = mutations;
