import path from "path";
import express, { Express, NextFunction, Request, Response } from "express";
import axios from "axios";

const app: Express = express();

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "../../client/dist")));

app.use(express.json());

app.use(function (
  inRequest: Request,
  inResponse: Response,
  inNext: NextFunction
) {
  inResponse.header("Access-Control-Allow-Origin", "*");
  inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  inResponse.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  inNext();
});

app.get("/", (req: Request, res: Response) => {
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
app.get("/test", (req: Request, res: Response) => {
  res.send("Dette er en severtest!");
  console.log("Dette er en servertest!");
});

// Sender en request til SSB sin API basert på brukerinput hentet fra index.html gjennom script.js
app.post("/api/ssb", async (req: Request, res: Response) => {
  console.log("Motatt brukerinput - utfører api-kall til /api/ssb");
  try {
    const url = "https://data.ssb.no/api/v0/no/table/11342";
    const query = req.body;

    const response = await axios.post(url, query, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    res.json(data);
    console.log("Suksess. Sender data tilbake til klient.\n");
  } catch (error) {
    console.error("Error fetching data from SSB API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
