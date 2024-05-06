# SSB API Prosjekt - IBE260 - Agnar Holst

Dette prosjektet er en nettside som tar brukerinput på kommuner, år, og eventuelt andre beregninger.
Brukerinputet blir sendt til en proxy-server som deretter gjør et api-kall til SSB og sender tilbake
informasjonen til browseren hvor eventuelle beregninger blir gjort på dataen. Til slutt blir
befolkningsstatistikken brukeren eterspurte vist i en tabell i nettleseren.

### Installasjon og Bruk

Først må du sørge for at Node.js og Typescript er installert. Kjøre Upd Dereter kan de følgende stegene tas:

1. Kjør `npm update` for å installere node_modules

2. Kjør `npm run dev` i terminalen. Serveren vil kjøre på: `http://localhost:3000`

3. Naviger til dist-mappen og åpne opp index.html i nettleseren.

4. På nettsiden hentes befolkningsstatistikk basert på brukerinput.

Avslutt serveren med control + c terminalen.

### Utvikling

Dette prosjektet er skrevet i TypeScript og følger Node.js praksis. Her er noen viktige mapper og filer:

- src/: Inneholder kildekoden for prosjektet.
- dist/: Inneholder den kompilerte kildekoden klar for distribusjon.
- main.ts: Inneholder den proxy-baserte serveren som gjør selve api-kallet.
- index.html: Inneholder selve html-koden for klientsiden.
- script.js: Inneholder koden til klienten som viser tabellen brukeren har ettterspurt.
- node_modules/: Inneholder "dependencies" og "libraries" for prosjektet.

### Lisens

Dette prosjektet er lisensiert under MIT-lisensen.
