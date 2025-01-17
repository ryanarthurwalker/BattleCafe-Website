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
let schedule = {}; // Object to store schedule by weeks

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
        document.getElementById('create-schedule-form').style.display = 'block'; // Show schedule form
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
        alert('Name is empty or already signed up. | 名字为空或已注册。');
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

let playerStats = {}; // Object to store points and matches played

let pendingMatches = [];

// Player Reporting Submission
document.getElementById('player-report-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const player1 = document.getElementById('player1-report').value.trim();
    const player2 = document.getElementById('player2-report').value.trim();
    const score = document.getElementById('player-score-report').value.trim();

    console.log("Match report submitted with values:", { player1, player2, score });

    if (!player1 || !player2 || player1 === player2 || !/^\d-\d$/.test(score)) {
        alert("Please enter valid names and a score format (e.g., 3-2).");
        console.error("Invalid input for match reporting:", { player1, player2, score });
        return;
    }

    const [player1Wins, player2Wins] = score.split('-').map(Number);
    if (player1Wins > 3 || player2Wins > 3 || (player1Wins + player2Wins) > 5) {
        alert("Invalid score. Best of 5 means max 3 wins for one player.");
        console.error("Invalid score range for a best of 5:", { player1Wins, player2Wins });
        return;
    }

    pendingMatches.push({ player1, player2, score });
    console.log("Pending matches updated:", pendingMatches);
    updatePendingMatches();
    alert('Match reported successfully! Waiting for confirmation.');
    document.getElementById('player-report-form').reset();
});

function updatePendingMatches() {
    const pendingList = document.getElementById('pending-matches');
    pendingList.innerHTML = '';

    pendingMatches.forEach((match, index) => {
        const { player1, player2, score } = match;
        console.log(`Pending match ${index + 1}:`, { player1, player2, score });
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${player1} vs ${player2}: ${score}
            <button onclick="confirmMatch(${index})">Confirm</button>
            <button onclick="rejectMatch(${index})">Reject</button>
        `;
        pendingList.appendChild(listItem);
    });
}

function confirmMatch(index) {
    const match = pendingMatches[index];
    console.log("Confirming match:", match);

    const [player1Wins, player2Wins] = match.score.split('-').map(Number);
    updatePlayerStats(match.player1, player1Wins, player1Wins > player2Wins);
    updatePlayerStats(match.player2, player2Wins, player2Wins > player1Wins);

    pendingMatches.splice(index, 1); // Remove match from pending list
    console.log("Match confirmed. Remaining pending matches:", pendingMatches);
    updatePendingMatches();
    updateLeaderboard();
}

function rejectMatch(index) {
    console.log(`Rejecting match at index ${index}`);
    if (confirm('Are you sure you want to reject this match?')) {
        pendingMatches.splice(index, 1); // Remove match
        console.log("Match rejected. Remaining pending matches:", pendingMatches);
        updatePendingMatches();
    }
}

function updatePlayerStats(player, wins, isWinner) {
    if (!playerStats[player]) {
        playerStats[player] = { matchesPlayed: 0, points: 0 };
        console.log(`New player added to stats: ${player}`);
    }
    playerStats[player].matchesPlayed++;
    playerStats[player].points += wins; // +1 point per game won
    if (isWinner) playerStats[player].points++; // +1 point for winning the series
    console.log(`Updated stats for ${player}:`, playerStats[player]);
}

function updateLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';

    const sortedPlayers = Object.keys(playerStats).sort((a, b) => playerStats[b].points - playerStats[a].points);
    console.log("Sorted leaderboard:", sortedPlayers);

    sortedPlayers.forEach((player, index) => {
        const { matchesPlayed, points } = playerStats[player];
        const row = `<tr>
            <td>${index + 1}</td>
            <td>${player}</td>
            <td>${matchesPlayed}</td>
            <td>${points}</td>
        </tr>`;
        leaderboardBody.innerHTML += row;
    });
}

// Show schedule creation form when a tournament is created
document.getElementById('create-tournament-form').addEventListener('submit', () => {
    document.getElementById('create-schedule-form').style.display = 'block';
});

// Handle schedule creation
document.getElementById('create-schedule-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const weekNumber = document.getElementById('week-number').value.trim();
    const dateRange = document.getElementById('date-range').value.trim();
    const player1 = document.getElementById('schedule-player1').value.trim();
    const player2 = document.getElementById('schedule-player2').value.trim();

    if (!weekNumber || !dateRange || !player1 || !player2 || player1 === player2) {
        alert('Please enter valid inputs.');
        return;
    }

    // Add matchup to the corresponding week
    if (!schedule[weekNumber]) {
        schedule[weekNumber] = { dateRange, matchups: [] };
    }
    schedule[weekNumber].matchups.push(`${player1} vs ${player2}`);

    // Save the updated schedule to localStorage
    localStorage.setItem('tournamentSchedule', JSON.stringify(schedule));

    updateScheduleDisplay();
    alert('Matchup added to the schedule!');
    document.getElementById('create-schedule-form').reset();
});

document.addEventListener('DOMContentLoaded', () => {
    const savedSchedule = JSON.parse(localStorage.getItem('tournamentSchedule'));
    if (savedSchedule) {
        schedule = savedSchedule; // Load saved schedule
        updateScheduleDisplay();  // Display it on the page
    }
});

function clearSchedule() {
    if (confirm('Are you sure you want to clear the entire schedule?')) {
        localStorage.removeItem('tournamentSchedule'); // Remove from localStorage
        schedule = {}; // Reset the in-memory schedule
        updateScheduleDisplay(); // Update the display
    }
}

// Update schedule display for players
function updateScheduleDisplay() {
    const scheduleList = document.getElementById('schedule-list');
    scheduleList.innerHTML = ''; // Clear existing schedule

    const weeks = Object.keys(schedule).sort((a, b) => Number(a) - Number(b));
    weeks.forEach((week) => {
        const { dateRange, matchups } = schedule[week];
        const weekDiv = document.createElement('div');
        weekDiv.innerHTML = `
            <h4>Week ${week}: ${dateRange}</h4>
            <ul>${matchups.map(match => `<li>${match}</li>`).join('')}</ul>
        `;
        scheduleList.appendChild(weekDiv);
    });
}