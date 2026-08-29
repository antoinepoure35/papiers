const students = [
"A Juliette", "A Pierre", "B Maddy", "B Matthieu", "C Stacy", "C Célestin", "C Victoire", "C Maxime", "C Gwenola", "C Oscar", "C Lorenzo", "C Axel", "G Cesar", "G Randy", "G Tuomas", "H Gabriel", "L Paul", "L Heidi", "L Juliette", "M Lilas", "M Raphaëlle", "M Telio", "N Malia odile", "N Elise", "O Aelig", "R Marius", "S Laurane", "S Raphaël"
];

function addDocument() {
    const documentName = document.getElementById('documentName').value;
    if (documentName) {
        const table = document.createElement('table');
        table.className = 'table';
        table.id = documentName;
        
        const tableName = document.createElement('div');
        tableName.textContent = `${documentName} : `;
        
        const counter = document.createElement('div');
        counter.id = `counter-${documentName}`;
        counter.textContent = `0/${students.length}`;
        
		let row;
		students.forEach((student, index) => {
			if (index % 4 === 0) {
				row = document.createElement('tr');
				table.appendChild(row);
			}

			const cell = document.createElement('td');
			cell.className = 'red';
			cell.innerText = student;
			cell.onclick = () => {
				cell.className = cell.className === 'red' ? 'green' : 'red';
				updateCounter(documentName);
				saveData();
			};
			row.appendChild(cell);
		});

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Supprimer';
        deleteButton.onclick = () => {
            document.getElementById('documents').removeChild(container);
            saveData();
        };

        const container = document.createElement('div');
        container.appendChild(tableName);
        container.appendChild(counter);
        container.appendChild(table);
        container.appendChild(deleteButton);

        document.getElementById('documents').appendChild(container);
        saveData();
    }
}

function updateCounter(documentName) {
    const table = document.getElementById(documentName);
    if (table) {
        const cells = table.getElementsByTagName('td');
        let greenCount = 0;
        for (let cell of cells) {
            if (cell.className === 'green') {
                greenCount++;
            }
        }
        document.getElementById(`counter-${documentName}`).textContent = `${greenCount}/${cells.length}`;
    } else {
        console.error(`Table with id ${documentName} not found.`);
    }
}

function saveData() {

    const documents = document.getElementById('documents').innerHTML;

    const transaction = db.transaction(["data"], "readwrite");
    const store = transaction.objectStore("data");

    store.put(documents, "documents");

    transaction.oncomplete = () => {
        console.log("Données sauvegardées");
    };
}

function loadData() {

    return new Promise((resolve) => {

        const transaction = db.transaction(["data"], "readonly");
        const store = transaction.objectStore("data");

        const request = store.get("documents");

        request.onsuccess = () => {

            const documents = request.result;

            if (documents) {

                document.getElementById('documents').innerHTML = documents;

                document.querySelectorAll('.table td').forEach(cell => {
                    cell.onclick = () => {
                        cell.className = cell.className === 'red' ? 'green' : 'red';
                        updateCounter(cell.closest('.table').id);
                        saveData();
                    };
                });

                document.querySelectorAll('button').forEach(button => {
                    if (button.innerText === 'Supprimer') {
                        button.onclick = () => {
                            document.getElementById('documents')
                                .removeChild(button.parentElement);
                            saveData();
                        };
                    }
                });

                document.querySelectorAll('.table').forEach(table => {
                    updateCounter(table.id);
                });
            }

            resolve();
        };

        request.onerror = () => resolve();
    });
}

let db;

function initDB() {
    return new Promise((resolve, reject) => {

        const request = indexedDB.open("GestionDocuments", 1);

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            if (!db.objectStoreNames.contains("data")) {
                db.createObjectStore("data");
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve();
        };

        request.onerror = () => reject(request.error);
    });
}

window.onload = loadData;
