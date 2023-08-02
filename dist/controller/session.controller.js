"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sessions = void 0;
const session_model_1 = require("../models/session.model");
class Sessions {
    static maintain_session(req, res, device, user, userSession) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user) {
                    if (!userSession) {
                        const session_details = yield session_model_1.Session.create({
                            user_id: user.id,
                            device_id: device,
                            status: true
                        });
                        console.log("Session stored successfully");
                        console.log(session_details);
                    }
                    else if (userSession) {
                        if (!userSession.status) {
                            yield session_model_1.Session.update({ status: !userSession.status }, { where: { user_id: user.id } });
                            console.log("Session Activate");
                        }
                    }
                }
                else {
                    res.status(404).json({ message: "User Not Found" });
                    console.log("User not found");
                }
            }
            catch (err) {
                res.status(500).json({ message: "Server Error", err });
                console.log("Server Error");
            }
        });
    }
}
exports.Sessions = Sessions;
//# sourceMappingURL=session.controller.js.map