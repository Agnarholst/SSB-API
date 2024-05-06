/* 
Framgangsmåte: Først programmerte jeg scriptet helt likt linje for linje som Steinar gjorde i 
en av videoen. Etterpå så begynte jeg fra start av og forsøkte å gjøre det helt på egenhånd. 
Til tider tok jeg en liten titt i hvordan Steinar hadde gjort det sånn at jeg ikke skulle 
sitte fast lenger enn nødvendig. Når det kommer til AI har jeg forsøkt å programmere så mye på 
egenhånd som mulig. Jeg vil si jeg har programmert 90 % selv, også har jeg fått hjelp av chatgpt 
de siste prosentene der jeg satt fast. Det har vært en veldig lærerik oblig. 
*/


let inputÅr = [2024];
let inputKommuner = ['0301'];
let inputBeregninger = [];

function highlightÅr(element, år) {
    element.classList.toggle('highlighted');
    let index = inputÅr.indexOf(år);

    if (index === -1) {
        inputÅr.push(år);
    } else {
        inputÅr.splice(index, 1);
    }

    inputÅr.sort(function (a, b) {
        return a - b;
    });

    console.log('Highlighted År:', inputÅr);
}

function highlightKommuner(element, kode) {
    element.classList.toggle('highlighted');
    let index = inputKommuner.indexOf(kode);

    if (index === -1) {
        inputKommuner.push(kode);
    } else {
        inputKommuner.splice(index, 1);
    }
    console.log('Highlighted Kommuner:', inputKommuner);
}

function highlightBeregninger(element, calc) {
    element.classList.toggle('highlighted');
    let index = inputBeregninger.indexOf(calc);

    if (index === -1) {
        inputBeregninger.push(calc);
    } else {
        inputBeregninger.splice(index, 1);
    }
    console.log('Highlighted Beregninger:', inputBeregninger);
}


async function fetchStats() {
    try {
        const query = {
            "query": [
                {
                    "code": "Region",
                    "selection": {
                        "filter": "vs:Kommune",
                        "values": inputKommuner
                    }
                },
                {
                    "code": "ContentsCode",
                    "selection": {
                        "filter": "item",
                        "values": [
                            "Folkemengde"
                        ]
                    }
                },
                {
                    "code": "Tid",
                    "selection": {
                        "filter": "item",
                        "values": inputÅr
                    }
                }
            ],
            "response": {
                "format": "json-stat2"
            }
        };

        const response = await fetch('http://localhost:3000/api/ssb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from server');
        }

        const data = await response.json();
        const dataset = JSONstat(data).Dataset(0);
        populateTable(dataset)
    } catch (error) {
        console.error('Error fetching data from server:', error);
        alert('Failed to fetch data from server');
    }
}



function populateTable(dataset) {
    console.log("Vis tabell")
    console.log(dataset)
    const kommunerID = dataset.Dimension("Region").id;
    const kommuner = dataset.Dimension("Region").__tree__.category.label;

    // Sletter potensielt tidligere tabell
    let table = document.getElementById("mainTable").getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    let rows = table.getElementsByTagName('tr');
    let index = 0;
    let j = 0;

    const numOfrows = dataset.size[0] * inputBeregninger.length // Lager tabell basert mtp. bergninger


    if (inputBeregninger.length !== 0) {
        for (i = 0; i < (numOfrows); i++) {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            let cell3 = newRow.insertCell(2);
        }

        const tredjeKol = document.getElementById("kolonneÅr")
        tredjeKol.innerHTML = "Beregninger"


        // Fyller ut første kolonne
        for (i = 0; i < numOfrows; i++) {
            let cells = rows[i].getElementsByTagName('td');
            cells[0].innerHTML = kommuner[kommunerID[index]]
            j++;
            if (inputBeregninger.length <= j) {
                index++
                j = 0;
            }
        }

        index = 0;
        // Fyller ut andre kolonne
        for (i = 0; i < numOfrows; i++) {
            for (k = 0; k <= inputBeregninger.length; k++) {
                var cells = rows[i].getElementsByTagName('td');
                cells[1].innerHTML = inputBeregninger[index];
                index++;
                if (index == inputBeregninger.length) {
                    index = 0;
                }

            }
        }

        let values = dataset.value
        // Lager Array fra values
        let valuesArray = []
        console.log(values)


        // Fyller ut trejde kolonne
        for (i = 0; i < numOfrows;) {
            valuesArray = []
            // Lager et nytt array for gjeldene kommune
            for (k = 0; k < dataset.size[2]; k++) {
                // Jeg tror en if 0 dont push må inn... da må den kun fjernes. 
                // Så det beste er nok !0 så push.  
                if (values[0] !== 0) {
                    valuesArray.push(values[0]);
                }
                values.splice(index, 1);
            }
            for (j = 0; j < inputBeregninger.length; j++) {
                // Utfører beregninger
                let previousCell = rows[i].getElementsByTagName('td')[1].innerHTML;
                let cells;
                switch (previousCell) {
                    case "Minimum":
                        let minValue = Math.min(...valuesArray);
                        cells = rows[i].getElementsByTagName('td');
                        cells[2].innerHTML = minValue;
                        break;
                    case "Maksimum":
                        let maxValue = Math.max(...valuesArray);
                        cells = rows[i].getElementsByTagName('td');
                        cells[2].innerHTML = maxValue;
                        break;
                    case "Median":
                        valuesArray.sort((a, b) => a - b);
                        const n = valuesArray.length;
                        cells = rows[i].getElementsByTagName('td');
                        if (n % 2 === 0) {
                            const middle1 = valuesArray[n / 2 - 1];
                            const middle2 = valuesArray[n / 2];
                            const result = (middle1 + middle2) / 2;
                            cells[2].innerHTML = Math.floor(result)
                        } else {
                            const result = valuesArray[Math.floor(n / 2)];
                            cells[2].innerHTML = result
                        }
                        break;
                    case "Gjennomsnitt":
                        const sum = valuesArray.reduce((total, current) => total + current, 0); // Brukte litt chatgpt på utregningene. Som denne pilfunksjonen. 
                        cells = rows[i].getElementsByTagName('td');
                        cells[2].innerHTML = Math.floor(sum / valuesArray.length)
                        break;
                }
                i++;
            }
        }

        // Eksempel på litt pesudokode jeg skrive under utvikling.
        // Fjerne vanligvis dette, men jeg lar litt stå for å vise 
        // hvordan jeg programmerer. 

        //-------------------------START---------------------------->
        // Fyller ut tredje kolonne
        // Må bare sammenligne hva som er i beregningskolonnen. 
        // If innerHTML == "gjennomsnitt do this
        // if InnerHTML == "Median do this"
        // if InnerHTML == "Maksimum do this"
        // if InnerHTML == "Minimum do this"
        // putte alle de ifelse statementsene eller switch statements i en for-løkke,
        // som går antall rader ned, som er variabelen numOfRows.

        // valuesArray = []

        // for (i = 0; i < dataset.size[2]; i++) {
        //     valuesArray.push(values[0]);
        //     console.log(valuesArray)
        //     values.splice(index, 1);
        // }

        // minValue = Math.min(...valuesArray);
        // var cells = rows[1].getElementsByTagName('td');
        // cells[2].innerHTML = minValue;
        //--------------------------SLUTT---------------------------|

        return;
    }


    const tredjeKol = document.getElementById("kolonneÅr")
    tredjeKol.innerHTML = "År"

    // Oppretter en tom tabell
    for (i = 0; i < dataset.n; i++) {
        let newRow = table.insertRow();
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
    }

    // Fyller ut første kolonne
    for (i = 0; i < dataset.n; i++) {
        let cells = rows[i].getElementsByTagName('td');
        cells[0].innerHTML = kommuner[kommunerID[index]]
        j++;
        if ((dataset.size[2]) <= j) {
            index++
            j = 0;
        }
    }

    // Fyller ut andre kolonne
    for (i = 0; i < dataset.n; i++) {
        var cells = rows[i].getElementsByTagName('td');
        cells[1].innerHTML = inputÅr[j];
        j++;
        if (j == dataset.size[2]) {
            j = 0;
        }
    }

    // Fyller ut tredje kolonne
    for (i = 0; i < dataset.n; i++) {
        var cells = rows[i].getElementsByTagName('td');
        cells[2].innerHTML = dataset.value[i]
    }
}