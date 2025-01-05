const adminId = "Mozaic";
const adminPassword = "072192";

const adminLink = document.getElementById('admin-link');
const adminLoginSection = document.getElementById('admin-login');
const adminIdInput = document.getElementById('admin-id');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginButton = document.getElementById('admin-login-button');
const closeAdminLoginButton = document.getElementById('close-admin-login');

const createTournamentForm = document.getElementById('create-tournament-form');
const signUpForm = document.getElementById('sign-up-form');
const tournamentDetails = document.getElementById('tournament-details');
const participantsList = document.getElementById('participants-list');
const downloadButton = document.getElementById('download-names');
const removeTournamentButton = document.getElementById('remove-tournament-button');

let participants = [];

// Check localStorage for existing tournament data
document.addEventListener('DOMContentLoaded', () => {
    const savedTournament = JSON.parse(localStorage.getItem('tournamentData'));
    if (savedTournament) {
        displayTournament(savedTournament);
    }
});

// Admin link to open login form
adminLink.addEventListener('click', () => {
    adminLoginSection.style.display = 'block';
});

// Close admin login
closeAdminLoginButton.addEventListener('click', () => {
    adminLoginSection.style.display = 'none';
});

// Admin Login
adminLoginButton.addEventListener('click', () => {
    const enteredId = adminIdInput.value.trim();
    const enteredPassword = adminPasswordInput.value.trim();
    if (enteredId === adminId && enteredPassword === adminPassword) {
        adminLoginSection.style.display = 'none'; // Hide admin login
        createTournamentForm.style.display = 'block'; // Show create tournament form
    } else {
        alert('Incorrect ID or password. Access denied.');
    }
});

// Create Tournament
createTournamentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const tournamentData = {
        name: document.getElementById('tournament-name').value.trim(),
        date: document.getElementById('tournament-date').value,
        description: document.getElementById('tournament-description').value.trim(),
    };

    if (tournamentData.name && tournamentData.date && tournamentData.description) {
        localStorage.setItem('tournamentData', JSON.stringify(tournamentData)); // Save to localStorage
        displayTournament(tournamentData);
        createTournamentForm.style.display = 'none';
    }
});

// Display Tournament
function displayTournament(tournamentData) {
    tournamentDetails.innerHTML = `
        <strong>${tournamentData.name}</strong><br>
        <em>${new Date(tournamentData.date).toLocaleString()}</em><br>
        <p>${tournamentData.description}</p>
    `;
    signUpForm.style.display = 'block';
}

// Remove Tournament
removeTournamentButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to remove the current tournament?')) {
        localStorage.removeItem('tournamentData'); // Remove from localStorage
        tournamentDetails.innerHTML = 'No tournament has been created yet.';
        participantsList.innerHTML = '';
        signUpForm.style.display = 'none';
        createTournamentForm.style.display = 'block';
        participants = [];
    }
});

// Sign Up Form
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('participant-name').value.trim();
    if (name && !participants.includes(name)) {
        participants.push(name);
        updateParticipantsList();
        document.getElementById('participant-name').value = '';
        downloadButton.style.display = 'block'; // Show download button after the first sign-up
    } else {
        alert('Name is empty or already signed up.');
    }
});

// Update Participants List
function updateParticipantsList() {
    participantsList.innerHTML = participants
        .map((name, index) => `<li>${index + 1}. ${name}</li>`)
        .join('');
}

// Download Participants List
downloadButton.addEventListener('click', () => {
    const blob = new Blob([participants.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants-list.txt';
    a.click();
    URL.revokeObjectURL(url);
});