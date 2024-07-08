const { ApolloServer } = require("@apollo/server");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const http = require("http");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
require("dotenv").config();

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Connecting to MongoDB");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : false;
        if (auth && auth.startsWith("Bearer ")) {
          try {
            const token = req.headers.authorization.replace("Bearer ", "");
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
          } catch (error) {
            if (error.message === "jwt expired") return { currentUser: null };
            else console.log(error.message);
          }
        }
      },
    })
  );
  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server running on http:/localhost:${PORT}`)
  );
};
start();
