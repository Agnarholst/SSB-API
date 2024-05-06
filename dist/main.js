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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
app.use(express_1.default.json());
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
});
app.get("/", (req, res) => {
    res.send("Velkommen til statistikk!");
});
// Lage en server variabel med 3000
const PORT = process.env.PORT || 3000;
// Kjører Server.
app.listen(PORT, () => {
    console.log(`Server kjører på port: http://localhost:${PORT}`);
    console.log();
    console.log("Venter på brukerinput.\n");
});
// Snakke med serveren test
app.get("/test", (req, res) => {
    res.send("Dette er en severtest!");
    console.log("Dette er en servertest!");
});
// Sender en request til SSB sin API basert på brukerinput hentet fra index.html gjennom script.js
app.post("/api/ssb", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Motatt brukerinput - utfører api-kall til /api/ssb");
    try {
        const url = "https://data.ssb.no/api/v0/no/table/11342";
        const query = req.body;
        const response = yield axios_1.default.post(url, query, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = response.data;
        res.json(data);
        console.log("Suksess. Sender data tilbake til klient.\n");
    }
    catch (error) {
        console.error("Error fetching data from SSB API:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
//# sourceMappingURL=main.js.map