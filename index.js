import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRouter.js"
import userRoutes from"./routes/userRoutes.js"
import foodItemRoutes from "./routes/foodItemRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import deliveryassignmentsRoutes from "./routes/deliveryAssignmentRoutes.js"
import transactionRoutes from "./routes/transactionRouter.js"
import inventoryrequestRoutes from "./routes/inventoryRequestRoutes.js"
import ingredientRoutes from "./routes/ingredientRoutes.js";
import supportticketRoutes from "./routes/supportTicketRoutes.js"
import vendordocsRoutes from "./routes/vendorDocumentRoutes.js"

dotenv.config();


connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({messasge:"Hello from backend"});
});

app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.use("/food-items", foodItemRoutes);
app.use("/orders", orderRoutes);
app.use("/delivery-assignments",deliveryassignmentsRoutes);
app.use("/transactions",transactionRoutes);
app.use("/inventory-requests",inventoryrequestRoutes)
app.use("/ingredients",ingredientRoutes)
app.use("/support-tickets",supportticketRoutes);
app.use("/vendor-documents",vendordocsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
