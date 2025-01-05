const adminId = "Mozaic"; // Admin ID
const adminPassword = "072192"; // Admin Password
const adminLoginSection = document.getElementById('admin-login');
const adminIdInput = document.getElementById('admin-id');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginButton = document.getElementById('admin-login-button');
const createTournamentForm = document.getElementById('create-tournament-form');
const signUpForm = document.getElementById('sign-up-form');
const tournamentDetails = document.getElementById('tournament-details');
const participantsList = document.getElementById('participants-list');
const downloadButton = document.getElementById('download-names');

let participants = [];

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

    const tournamentName = document.getElementById('tournament-name').value.trim();
    const tournamentDate = document.getElementById('tournament-date').value;
    const tournamentDescription = document.getElementById('tournament-description').value.trim();

    if (tournamentName && tournamentDate && tournamentDescription) {
        tournamentDetails.innerHTML = `
            <strong>${tournamentName}</strong><br>
            <em>${new Date(tournamentDate).toLocaleString()}</em><br>
            <p>${tournamentDescription}</p>
        `;
        createTournamentForm.style.display = 'none';
        signUpForm.style.display = 'block'; // Show sign-up form to all users
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
    URL.revokeObjectURL(url); // Clean up URL object
});