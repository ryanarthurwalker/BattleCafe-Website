// Initialize LeanCloud
AV.init({
    appId: "YOn3lFKBK5ap6uKbZiQ3JL9fYr-MdYXbMMI",
    appKey: "YOUbhFWX0TVsFdg8YoZubAaujgw",
    serverURLs: "YOhttps://n3lfkbk5.api.lncldglobal.com" // Use the URLs provided in the LeanCloud console
});

// LeanCloud References
const Participant = AV.Object.extend('Participant');
const Schedule = AV.Object.extend('Schedule');

// Load Participants on Page Load
document.addEventListener('DOMContentLoaded', () => {
    loadParticipants();
    loadSchedule();
});

// Add Participant
const signUpForm = document.getElementById('sign-up-form');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('participant-name').value.trim();

    if (name) {
        const participant = new Participant();
        participant.set('name', name);

        participant.save().then(() => {
            alert('Participant added successfully! | 参与者添加成功！');
            loadParticipants();
            document.getElementById('participant-name').value = ''; // Clear input
        }).catch((error) => {
            console.error('Error adding participant:', error);
            alert('Failed to add participant. Please try again. | 添加参与者失败。请重试。');
        });
    } else {
        alert('Name cannot be empty. | 姓名不能为空。');
    }
});

// Load Participants
function loadParticipants() {
    const query = new AV.Query('Participant');
    query.find().then((results) => {
        const participantsList = document.getElementById('participants-list');
        participantsList.innerHTML = ''; // Clear list

        results.forEach((participant) => {
            const name = participant.get('name');
            const li = document.createElement('li');
            li.textContent = name;
            participantsList.appendChild(li);
        });
    }).catch((error) => {
        console.error('Error fetching participants:', error);
    });
}

// Add Schedule Entry
const createScheduleForm = document.getElementById('create-schedule-form');
createScheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const week = document.getElementById('week-number').value.trim();
    const dateRange = document.getElementById('date-range').value.trim();
    const player1 = document.getElementById('schedule-player1').value.trim();
    const player2 = document.getElementById('schedule-player2').value.trim();

    if (week && dateRange && player1 && player2) {
        const scheduleEntry = new Schedule();
        scheduleEntry.set('week', week);
        scheduleEntry.set('dateRange', dateRange);
        scheduleEntry.set('player1', player1);
        scheduleEntry.set('player2', player2);

        scheduleEntry.save().then(() => {
            alert('Matchup added to the schedule! | 比赛已添加至计划表！');
            loadSchedule();
            createScheduleForm.reset();
        }).catch((error) => {
            console.error('Error adding schedule entry:', error);
            alert('Failed to add matchup. Please try again. | 添加比赛失败。请重试。');
        });
    } else {
        alert('All fields are required. | 所有字段都是必填项。');
    }
});

// Load Schedule
function loadSchedule() {
    const query = new AV.Query('Schedule');
    query.find().then((results) => {
        const scheduleList = document.getElementById('schedule-list');
        scheduleList.innerHTML = ''; // Clear list

        results.forEach((entry) => {
            const week = entry.get('week');
            const dateRange = entry.get('dateRange');
            const player1 = entry.get('player1');
            const player2 = entry.get('player2');

            const div = document.createElement('div');
            div.innerHTML = `<strong>Week ${week} | 周 ${week}</strong>: ${dateRange}<br>${player1} vs ${player2}`;
            scheduleList.appendChild(div);
        });
    }).catch((error) => {
        console.error('Error fetching schedule:', error);
    });
}

// Clear Schedule
function clearSchedule() {
    const query = new AV.Query('Schedule');
    query.find().then((results) => {
        AV.Object.destroyAll(results).then(() => {
            alert('Schedule cleared successfully! | 计划表已成功清除！');
            loadSchedule();
        }).catch((error) => {
            console.error('Error clearing schedule:', error);
            alert('Failed to clear schedule. Please try again. | 清除计划表失败。请重试。');
        });
    }).catch((error) => {
        console.error('Error fetching schedule for clearing:', error);
    });
}
