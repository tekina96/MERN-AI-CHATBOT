import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { chatCompletionValidator, validate } from "../utils/validators.js";
import {
  deleteChats,
//   deleteChats,
  generateChatCompletion, sendChatsToUser,
} from "../controllers/chat-controllers.js";

//Protected API
const chatRoutes = Router();
chatRoutes.post(
  "/new",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion
);
// const chatRoutes = Router();
chatRoutes.get(
  "/all-chats",
  verifyToken,
  sendChatsToUser
);
chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
chatRoutes.delete("/delete", verifyToken, deleteChats);

export default chatRoutes;