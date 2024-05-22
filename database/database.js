let Addvocab = '';

function fetchData(selectedLang) {
    let fetchURL = '';
    if (selectedLang === 'Eng') {
        fetchURL = 'http://localhost:3000/vocabularyEng';
        Addvocab = 'http://localhost:3000/addVocabularyEng';
    } else if (selectedLang === 'Ch') {
        fetchURL = 'http://localhost:3000/vocabularyCn';
        Addvocab = 'http://localhost:3000/addVocabularyCn';
    } else if (selectedLang === 'Jp') {
        fetchURL = 'http://localhost:3000/vocabularyJp';
        Addvocab = 'http://localhost:3000/addVocabularyJp';
    }
    fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#vocabulary-table tbody');
            tableBody.innerHTML = '';
            data.forEach(item => {
                // Use a different property name if 'id' is not present
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = item.question;
                row.insertCell(1).textContent = item.subquestion;
                row.insertCell(2).textContent = item.options_1;
                row.insertCell(3).textContent = item.options_2;
                // Action icons for edit and delete
                const actionIconsTemplate = document.querySelector('#action-icons-template');
                const actionIcons = actionIconsTemplate.content.cloneNode(true);
                row.appendChild(actionIcons);
                // Get reference to the action icons in the current row
                const actionIconsList = row.querySelectorAll('ion-icon');
                // Add event listener for the pencil icon (edit)
                actionIconsList[0].addEventListener('click', () => {
                    openEditPopup(item);
                });
                // Add event listener for the trash icon (delete)
                actionIconsList[1].addEventListener('click', () => {
                    deleteRow(selectedLang, item.question);
                    console.log(item.question);
                });
            });
        })
        .catch(error => console.error('Error:', error));
}

// Function to open the edit popup with data filled in for editing
function openEditPopup(item) {
    var editPopup = document.getElementById('edit-popup');
    editPopup.style.display = 'block';

    // Fill in the form fields with data from the item
    document.querySelector('input[name="edit-vocabulary"]').value = item.question;
    document.querySelector('input[name="edit-subVocabulary"]').value = item.subquestion;
    document.querySelector('input[name="edit-option1"]').value = item.options_1;
    document.querySelector('input[name="edit-option2"]').value = item.options_2;

    // Disable scrolling on the body element
    document.body.style.overflow = 'hidden';
}

// Function to close the edit popup
function closeEditPopup() {
    var editPopup = document.getElementById('edit-popup');
    editPopup.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Function to delete a row
function deleteRow(lang, question) {
    console.log(question)
    let deleteEndpoint = '';
    if (lang === 'Eng') {
        deleteEndpoint = `/vocabularyEng`;
    } else if (lang === 'Jp') {
        deleteEndpoint = `/vocabularyJp`;
    } else if (lang === 'Ch') {
        deleteEndpoint = `/vocabularyCn`;
    }
    fetch(`http://localhost:3000${deleteEndpoint}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: question })
    })
        .then(response => {
            if (response.ok) {
                console.log('Row deleted successfully!');
                fetchData(langSelect.value);
            } else {
                console.error('Failed to delete row.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Inside the submitForm function, if you want to handle editing as well:
function submitForm(event) {
    event.preventDefault();
    const formData = {
        vocabulary: document.querySelector('input[name="vocabulary"]').value,
        subVocabulary: document.querySelector('input[name="subVocabulary"]').value,
        option1: document.querySelector('input[name="option1"]').value,
        option2: document.querySelector('input[name="option2"]').value
    };

    fetch(Addvocab, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                console.log('Vocabulary added successfully!');
                fetchData(langSelect.value);
                closePopup();
            } else {
                console.error('Failed to add vocabulary.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Event listener for language selection
const langSelect = document.getElementById('lang');
langSelect.addEventListener('change', () => {
    fetchData(langSelect.value);
});

// Initial fetch data based on default language selection
fetchData(langSelect.value);

// Function to open the popup
function openPopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'block';
    // Disable scrolling on the body element
    document.body.style.overflow = 'hidden';
}

// Function to close the popup
function closePopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listener for form submission
document.getElementById('popup-form').addEventListener('submit', submitForm);

// Function to handle form submission for updating a question
function updateQuestion(event) {
    event.preventDefault();

    const formData = {
        question: document.querySelector('input[name="edit-vocabulary"]').value,
        subQuestion: document.querySelector('input[name="edit-subVocabulary"]').value,
        option1: document.querySelector('input[name="edit-option1"]').value,
        option2: document.querySelector('input[name="edit-option2"]').value
    };

    let updateEndpoint = '';
    if (langSelect.value === 'Eng') {
        updateEndpoint = '/updateVocabularyEng';
    } else if (langSelect.value === 'Jp') {
        updateEndpoint = '/updateVocabularyJp';
    } else if (langSelect.value === 'Ch') {
        updateEndpoint = '/updateVocabularyCn';
    }

    fetch(`http://localhost:3000${updateEndpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
        
    })
        .then(response => {
            if (response.ok) {
                console.log('Question updated successfully!');
                fetchData(langSelect.value);
                closeEditPopup();
            } else {
                console.log(formData)
                console.error('Failed to update question.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Event listener for form submission in edit popup
document.getElementById('edit-popup-form').addEventListener('submit', updateQuestion);

