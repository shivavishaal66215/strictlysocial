const express = require("express");
const app = express();
const cors = require("cors");

const PORT = 9000;

const basicRoutes = require("./routes/basicRoutes");
const userInterestRoutes = require("./routes/userInterestsRoutes");
const userSocialRoutes = require("./routes/userSocialRoutes");
const userFriendshipRoutes = require("./routes/userFriendshipRoutes");
const userDiscoveryRoutes = require("./routes/userDiscoveryRoutes");
app.use(express.urlencoded({ extended: true }));
//app.use(express.json());
app.use(cors({ credentials: true }));
//login-logout-Routes
app.use("/", basicRoutes);
//user-interest-routes
app.use("/", userInterestRoutes);
//user-social-routes
app.use("/", userSocialRoutes);
//user-friendship-routes
app.use("/", userFriendshipRoutes);
//user-discovery-routes
app.use("/", userDiscoveryRoutes);

app.listen(PORT, () => {
	console.log("listening on port: " + PORT);
});
