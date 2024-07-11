document.addEventListener('DOMContentLoaded', showIdeas);

function validateForm() {
    const label = document.getElementById('label').value.trim();
    const category = document.getElementById('category').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    if (label === "") {
        document.getElementById('labelError').innerText = "Le libellé est requis.";
        isValid = false;
    } else {
        document.getElementById('labelError').innerText = "";
    }

    if (category === "") {
        document.getElementById('categoryError').innerText = "La catégorie est requise.";
        isValid = false;
    } else {
        document.getElementById('categoryError').innerText = "";
    }

    if (message === "") {
        document.getElementById('messageError').innerText = "Le message est requis.";
        isValid = false;
    } else {
        document.getElementById('messageError').innerText = "";
    }

    if (!isValid) {
        showMessage("Tous les champs sont requis !", 'danger');
    }

    return isValid;
}

function addIdea(event) {
    event.preventDefault();
    if (validateForm()) {
        const label = document.getElementById('label').value.trim();
        const category = document.getElementById('category').value.trim();
        const message = document.getElementById('message').value.trim();

        let ideaList = localStorage.getItem('ideaList') ? JSON.parse(localStorage.getItem('ideaList')) : [];
        ideaList.push({ label, category, message, approved: false, disapproved: false });
        localStorage.setItem('ideaList', JSON.stringify(ideaList));

        document.getElementById('label').value = "";
        document.getElementById('category').value = "";
        document.getElementById('message').value = "";

        showMessage("Idée ajoutée avec succès !", 'success');
        showIdeas();
    }
}

function viewIdea(index) {
    let ideaList = JSON.parse(localStorage.getItem('ideaList'));
    const { label, category, message } = ideaList[index];
    alert(`Détails de l'idée :\n\nLibellé : ${label}\nCatégorie : ${category}\nMessage : ${message}`);
}

function editIdea(index) {
    let ideaList = JSON.parse(localStorage.getItem('ideaList'));
    const { label, category, message } = ideaList[index];

    document.getElementById('label').value = label;
    document.getElementById('category').value = category;
    document.getElementById('message').value = message;

    document.getElementById('addIdeaBtn').style.display = "none";
    document.getElementById('updateIdeaBtn').style.display = "block";

    document.getElementById('updateIdeaBtn').onclick = function() {
        updateIdea(index);
    };
}

function updateIdea(index) {
    if (validateForm()) {
        let ideaList = JSON.parse(localStorage.getItem('ideaList'));
        ideaList[index].label = document.getElementById('label').value.trim();
        ideaList[index].category = document.getElementById('category').value.trim();
        ideaList[index].message = document.getElementById('message').value.trim();
        localStorage.setItem('ideaList', JSON.stringify(ideaList));

        document.getElementById('label').value = "";
        document.getElementById('category').value = "";
        document.getElementById('message').value = "";

        showMessage("Idée modifiée avec succès !", 'success');
        showIdeas();

        document.getElementById('addIdeaBtn').style.display = "block";
        document.getElementById('updateIdeaBtn').style.display = "none";
        document.getElementById('updateIdeaBtn').onclick = null;
    }
}

function deleteIdea(index) {
    let ideaList = JSON.parse(localStorage.getItem('ideaList'));
    ideaList.splice(index, 1);
    localStorage.setItem('ideaList', JSON.stringify(ideaList));
    showIdeas();
}

function showIdeas() {
    let ideaList = localStorage.getItem('ideaList') ? JSON.parse(localStorage.getItem('ideaList')) : [];
    const tableBody = document.querySelector('#crudTable tbody');
    tableBody.innerHTML = "";

    ideaList.forEach((idea, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${idea.label}</td>
            <td>${idea.category}</td>
            <td>${idea.message}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteIdea(${index})">Supprimer</button>
                <button class="btn btn-warning m-2" onclick="editIdea(${index})">Modifier</button>
                <button class="btn btn-primary" onclick="viewIdea(${index})">Détails</button>
                ${idea.approved ? 
                    `<button class="btn btn-secondary" disabled>Approuvé</button>` :
                    `<button class="btn btn-secondary" onclick="approveIdea(${index})">Approuver</button>`
                }
                ${idea.disapproved ? 
                    `<button class="btn btn-dark" disabled>Désapprouvé</button>` :
                    `<button class="btn btn-dark" onclick="disapproveIdea(${index})">Désapprouver</button>`
                }
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function approveIdea(index) {
    let ideaList = JSON.parse(localStorage.getItem('ideaList'));
    ideaList[index].approved = true;
    localStorage.setItem('ideaList', JSON.stringify(ideaList));
    showIdeas();
}

function disapproveIdea(index) {
    let ideaList = JSON.parse(localStorage.getItem('ideaList'));
    ideaList[index].disapproved = true;
    localStorage.setItem('ideaList', JSON.stringify(ideaList));
    showIdeas();
}

function showMessage(message, type) {
    const messageElement = document.getElementById('mainMessage');
    messageElement.className = `alert alert-${type}`;
    messageElement.innerText = message;
    messageElement.style.display = "block";
    setTimeout(() => {
        messageElement.style.display = "none";
    }, 2000);
}

document.getElementById('ideaForm').addEventListener('submit', addIdea);
