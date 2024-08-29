const students = ["A.Héloïse", "B.Youenn", "B.Malou", "B.Lise", "B.Sami", "B.Anaé", "B.Noa", "C.Jeanne", "C.Lyna", "C.Alice", "C.Glenn", "D.Colin", "E.Dorian", "E.Clément", "G.Joan", "H.Kenji", "J.Maïwen", "J.Aaron", "L.Louis", "LV.Simon", "M.Charlie", "NG.Jocelin", "O.Hugo", "P.Alexis", "Q.Nina", "R.Maël", "R.Thomas", "S.Chloé", "V.Anna"];

function addDocument() {
    const documentName = document.getElementById('documentName').value;
    if (documentName) {
        const table = document.createElement('table');
        table.className = 'table';
        table.id = documentName;
		
		const tableName = document.createElement('div');
		tableName.textContent = `${documentName}`;

        students.forEach(student => {
            const cell = document.createElement('td');
            cell.className = 'red';
            cell.innerText = student;
            cell.onclick = () => {
                cell.className = cell.className === 'red' ? 'green' : 'red';
                saveData();
            };
            table.appendChild(cell);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Supprimer';
        deleteButton.onclick = () => {
            document.getElementById('documents').removeChild(table);
            saveData();
        };

        const container = document.createElement('div');
		container.appendChild(tableName);
        container.appendChild(table);
        container.appendChild(deleteButton);

        document.getElementById('documents').appendChild(container);
        saveData();
    }
}

function saveData() {
    const documents = document.getElementById('documents').innerHTML;
    localStorage.setItem('documents', documents);
}

function loadData() {
    const documents = localStorage.getItem('documents');
    if (documents) {
        document.getElementById('documents').innerHTML = documents;
        document.querySelectorAll('.table td').forEach(cell => {
            cell.onclick = () => {
                cell.className = cell.className === 'red' ? 'green' : 'red';
                saveData();
            };
        });
        document.querySelectorAll('button').forEach(button => {
            if (button.innerText === 'Supprimer') {
                button.onclick = () => {
                    document.getElementById('documents').removeChild(button.parentElement);
                    saveData();
                };
            }
        });
    }
}

window.onload = loadData;
