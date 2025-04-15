const main = document.getElementById('mainContent');
const links = document.querySelectorAll('.sidebar a');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.getAttribute('data-title');
    renderPage(page);
  });
});

function renderPage(name) {
  switch (name) {
    case 'Profile':
  const savedName = localStorage.getItem('userName') || 'Not found';
  const savedEmail = localStorage.getItem('userEmail') || 'Not found';
    
      main.innerHTML = `
        <div class="profile-container">
          <div id="profileView">
            <h2>👤 Profile</h2>
            <p><strong>Name:</strong> <span id="viewName">${savedName}</span></p>
            <p><strong>Email:</strong> <span id="viewEmail">${savedEmail}</span></p>
            <button id="editProfileBtn">Change Info</button>
            <button id="logoutBtn" style="margin-top: 10px;">Log Out</button>
          </div>
    
          <form id="profileForm" class="profile-info" style="display: none;">
            <label for="username">Name</label>
              <input type="text" id="username" value="${savedName}" />

            <label for="email">Email</label>
              <input type="email" id="email" value="${savedEmail}" />

            <label for="currentPassword">Current Password</label>
              <input type="password" id="currentPassword" placeholder="Required to change password" />

            <label for="password">New Password</label>
              <input type="password" id="password" placeholder="Leave blank to keep old password" />

            <div class="profile-buttons">
                <button type="button" class="cancel" id="cancelEdit">Cancel</button>
                <button type="submit" class="save">Save Changes</button>
            </div>
            </form>

        </div>
      `;
    
      // Show edit form
      document.getElementById('editProfileBtn').addEventListener('click', () => {
        document.getElementById('profileView').style.display = 'none';
        document.getElementById('profileForm').style.display = 'block';
      });
    
      // Cancel edit
      document.getElementById('cancelEdit').addEventListener('click', () => {
        document.getElementById('profileForm').style.display = 'none';
        document.getElementById('profileView').style.display = 'block';
      });
      
      // Logout
      document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        alert('You have been logged out.');
        toggleSidebar();
        renderPage('Login');
      });
      
    
      // Submit changes
      document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const name = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('password').value;
      
        const body = {
          name,
          email,
          currentPassword,
          ...(newPassword && { password: newPassword })
        };
      
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
      
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('userEmail', data.user.email);
          alert('Profile updated successfully!');
      
          // Update view mode with new values
          document.getElementById('viewName').innerText = data.user.name;
          document.getElementById('viewEmail').innerText = data.user.email;
          document.getElementById('profileForm').style.display = 'none';
          document.getElementById('profileView').style.display = 'block';
        } else {
          alert(data.message || 'Failed to update profile');
        }
      });      
      break;    

    case 'Dashboard':
      main.innerHTML = `
      <div class="dashboard-controls">
        <input type="text" id="searchInput" placeholder="Search by name">
        <select id="filterPriority">
          <option value="">Filter by Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select id="sortBy">
          <option value="">Sort by</option>
          <option value="upcoming">Upcoming Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      <div id="taskList"></div>
    `;
    
    
      loadTasks(true);
      document.getElementById('searchInput').addEventListener('input', () => loadTasks(true));
      document.getElementById('filterPriority').addEventListener('change', () => loadTasks(true));
      document.getElementById('sortBy').addEventListener('change', () => loadTasks(true));      break;

      //Calendar
      case 'Calendar':
        renderCalendar(new Date());
        break;      
      
      function formatTime(date, tz, format) {
        const options = {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: tz === 'local' ? undefined : tz,
          hour12: format === '12'
        };
      
        return date.toLocaleTimeString(undefined, options);
      }
      
      function changeMonth(offset) {
        const header = document.querySelector('.calendar-header h2');
        const [monthStr, yearStr] = header.textContent.split(' ');
        const newDate = new Date(`${monthStr} 1, ${yearStr}`);
        newDate.setMonth(newDate.getMonth() + offset);
        renderCalendar(newDate);
      }
      
      //Login
    case 'Login':
      main.innerHTML = `
        <form id="loginForm">
          <h2>Log in to TaskFlow</h2>
          <input type="email" id="loginEmail" placeholder="Email" required />
          <input type="password" id="loginPassword" placeholder="Password" required />
          <button type="submit" class="login">Sign In</button>
          <div class="alt-login">
            <p>or</p>
            <button type="button" id="registerSwitch">Register</button>
          </div>
        </form>
      `;

      document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('userEmail', data.user.email);
          alert(`Welcome, ${data.user.name}`);
          renderPage('Dashboard');
        } else {
          alert(data.message || 'Login failed');
        }
      });

      document.getElementById('registerSwitch').addEventListener('click', () => {
        renderPage('Register');
      });
      break;

    case 'Register':
      main.innerHTML = `
        <form id="registerForm">
          <h2>Create an Account</h2>
          <input type="text" id="regName" placeholder="Name" required />
          <input type="email" id="regEmail" placeholder="Email" required />
          <input type="password" id="regPassword" placeholder="Password" required />
          <button type="submit">Register</button>
          <div class="alt-login">
            <p>Already have an account?</p>
            <button type="button" id="loginSwitch">Back to Login</button>
          </div>
        </form>
      `;

      document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('userEmail', data.user.email);
          alert(`Welcome, ${data.user.name}`);
          renderPage('Dashboard');
        } else {
          alert(data.message || 'Registration failed');
        }
      });

      document.getElementById('loginSwitch').addEventListener('click', () => {
        renderPage('Login');
      });
      break;

      case 'Settings':
        main.innerHTML = `
          <div class="settings-container">
            <h2>Settings</h2>
      
            <div class="settings-option">
              <label for="themeSelect">Theme:</label>
              <select id="themeSelect">
                <option value="midnight">Midnight Aurora</option>
                <option value="indigo">Frosted Indigo</option>
                <option value="blush">Blush Rose</option>
              </select>
            </div>
      
            <div class="settings-option">
              <label for="timezone">Timezone:</label>
              <select id="timezone">
                <option value="local">Local</option>
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
              </select>
            </div>
      
            <div class="settings-option">
              <label for="timeFormat">Time Format:</label>
              <select id="timeFormat">
                <option value="12">12-hour</option>
                <option value="24">24-hour</option>
              </select>
            </div>
      
            <div class="settings-footer">
              <button class="delete-btn" id="deleteAccountBtn">Delete Account</button>
            </div>
          </div>
        `;
      
        // Apply theme
        const currentTheme = localStorage.getItem('theme') || 'midnight';
        document.body.classList.add(`theme-${currentTheme}`);
        document.getElementById('themeSelect').value = currentTheme;
      
        document.getElementById('themeSelect').addEventListener('change', (e) => {
          const theme = e.target.value;
          document.body.classList.remove('theme-midnight', 'theme-indigo', 'theme-blush');
          document.body.classList.add(`theme-${theme}`);
          localStorage.setItem('theme', theme);
        });
      
        // DELETE ACCOUNT
        document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
          const confirmed = confirm("Are you sure you want to permanently delete your account?");
          if (!confirmed) return;
      
          const token = localStorage.getItem('token');
      
          const res = await fetch('http://localhost:5000/api/auth/delete', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
      
          const data = await res.json();
          if (res.ok) {
            alert('Account deleted.');
            localStorage.clear();
            renderPage('Register');
          } else {
            alert(data.message || 'Failed to delete account.');
          }
        });
      
        break;
      
      

    case 'AddTask':
      document.getElementById('taskModal').style.display = 'block';
      break;

    default:
      main.innerHTML = `<h2>Welcome to TaskFlow</h2>`;
  }
}

// Colors for priority
function getPriorityColor(priority) {
  switch (priority) {
    case 'Low':
      return 'limegreen';
    case 'Medium':
      return 'orange';
    case 'High':
      return 'red';
    default:
      return 'white';
  }
}

// Load tasks from backend
async function loadTasks(filter = false) {
  const taskList = document.getElementById('taskList');
  if (!taskList) return;

  const token = localStorage.getItem('token');

  const res = await fetch('http://localhost:5000/api/tasks', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const tasks = await res.json();

  let filtered = tasks;
  if (filter) {
    const search = document.getElementById('searchInput')?.value.toLowerCase();
    const priority = document.getElementById('filterPriority')?.value;
    const sortBy = document.getElementById('sortBy')?.value;
    
    filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(search) &&
      (!priority || task.priority === priority)
    );

    if (sortBy === 'upcoming') {
      filtered = filtered.sort((a, b) => new Date(a.date || Infinity) - new Date(b.date || Infinity));
    }
    
    if (sortBy === 'priority') {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      filtered = filtered.sort((a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99));
    }
  }

  taskList.innerHTML = '';
  filtered.forEach(task => {
    const li = document.createElement('div');
    li.className = `task-card ${task.done ? 'done' : ''}`;
    li.innerHTML = `
    <div class="task-info">
      <strong>${task.title}</strong> 
      <span style="color: ${getPriorityColor(task.priority)};">(${task.priority})</span> - ${task.description}
    </div>
    <div class="task-actions">
      <button class="edit">Edit</button>
      <button class="done">Done</button>
      <button class="delete">Delete</button>
    </div>
  `;
  
  li.querySelector('.done').addEventListener('click', async () => {
    const updatedDoneStatus = !task.done; // Toggle status
  
    await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ done: updatedDoneStatus })
    });
  
    loadTasks(filter); // Refresh list
  });
  

    li.querySelector('.delete').addEventListener('click', async () => {
      await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      loadTasks(filter);
    });

    li.querySelector('.edit').addEventListener('click', () => {
      document.getElementById('taskModal').style.display = 'block';
    
      document.getElementById('title').value = task.title;
      document.getElementById('description').value = task.description;
      document.getElementById('date').value = task.date || '';
      document.getElementById('priority').value = task.priority;
    
      taskForm.setAttribute('data-edit-id', task._id);
    });
    
    li.querySelector('.done').textContent = task.done ? 'Undone' : 'Done';
    taskList.appendChild(li);
  });
}

// Handle Add Task Modal submission
const taskForm = document.getElementById('taskForm');
if (taskForm) {
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    let rawDate = document.getElementById('date')?.value || '';
    let date = rawDate ? new Date(rawDate).toISOString().split('T')[0] : '';    
    const priority = document.getElementById('priority')?.value || 'Medium';

    const newTask = { title, description, date, priority };

    const isEdit = taskForm.hasAttribute('data-edit-id');
    const taskId = taskForm.getAttribute('data-edit-id');
    
    const url = isEdit
      ? `http://localhost:5000/api/tasks/${taskId}`
      : `http://localhost:5000/api/tasks`;
    
    const method = isEdit ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newTask)
    });

    const result = await response.json();
    console.log("Server response:", result);

    taskForm.reset();
    taskForm.removeAttribute('data-edit-id');
    document.getElementById('taskModal').style.display = 'none';
    renderPage('Dashboard');
  });
}

// Global Add Task button
document.getElementById('globalAddTask').onclick = () => {
  document.getElementById('taskModal').style.display = 'block';
};

// Close modal events
document.getElementById('closeModal').onclick = () => {
  document.getElementById('taskModal').style.display = 'none';
};

document.getElementById('closeModalBtn').onclick = () => {
  document.getElementById('taskModal').style.display = 'none';
};

window.onclick = (e) => {
  if (e.target === document.getElementById('taskModal')) {
    document.getElementById('taskModal').style.display = 'none';
  }
};

// Hides login button when logged in
function toggleSidebar() {
  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('navLogin');

  if (token) {
    if (loginLink) loginLink.style.display = 'none'; // REMOVE from layout
  } else {
    if (loginLink) loginLink.style.display = ''; // Let CSS handle it (default)
  }
}

//calendar functions
let currentCalendarDate = new Date();

async function renderCalendar(baseDate = new Date()) {
  const timezone = localStorage.getItem('timezone') || 'local';
  const timeFormat = localStorage.getItem('timeFormat') || '12';
  const token = localStorage.getItem('token');

  const res = await fetch('http://localhost:5000/api/tasks', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const tasks = await res.json();

  main.innerHTML = `
    <div class="calendar-header">
      <h2>${formatDate(baseDate)}</h2>
      <div>
        <button onclick="changeMonth(-1)">Prev</button>
        <button onclick="changeMonth(1)">Next</button>
      </div>
    </div>
    <div class="calendar-grid" id="calendarGrid"></div>
  `;

  generateCalendarGrid(baseDate, timezone, timeFormat, tasks);

  // Hook up the buttons
  document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar(currentCalendarDate);
  });
  
  document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar(currentCalendarDate);
  });
}


function generateCalendarGrid(date, timezone, format, tasks = []) {
  const calendar = document.getElementById('calendarGrid');
  calendar.innerHTML = '';

  const year = date.getFullYear();
  const month = date.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const daysInMonth = endDate.getDate();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(day => {
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    cell.textContent = day;
    calendar.appendChild(cell);
  });

  for (let i = 0; i < startDate.getDay(); i++) {
    const blank = document.createElement('div');
    blank.className = 'calendar-cell';
    calendar.appendChild(blank);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const cellDate = new Date(year, month, i);
    const cell = document.createElement('div');
    const cellDateStr = cellDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const dayTasks = tasks.filter(task => task.date?.split('T')[0] === cellDateStr);
    cell.className = 'calendar-cell';
    cell.innerHTML = `<strong>${i}</strong>`;

    dayTasks.forEach(task => {
      const taskElem = document.createElement('div');
      taskElem.textContent = `• ${task.title}`;
      taskElem.style.fontSize = '0.75rem';
      taskElem.style.marginTop = '4px';
      taskElem.style.color = getPriorityColor(task.priority);
      taskElem.style.whiteSpace = 'nowrap';
      taskElem.style.overflow = 'hidden';
      taskElem.style.textOverflow = 'ellipsis';
      taskElem.style.cursor = 'pointer';

      //crosses out task in calendar if done
      if (task.done) {
        taskElem.style.textDecoration = 'line-through';
        taskElem.style.opacity = '0.6';
      }

      // Add click handler to open modal and pre-fill task data
      taskElem.addEventListener('click', () => {
        document.getElementById('taskModal').style.display = 'block';
        document.getElementById('title').value = task.title;
        document.getElementById('description').value = task.description;
        document.getElementById('date').value = task.date || '';
        document.getElementById('priority').value = task.priority;
        taskForm.setAttribute('data-edit-id', task._id);
      });

      cell.appendChild(taskElem);
    });

    calendar.appendChild(cell);
  }
}


function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long'
  });
}

// Default landing page
renderPage('Dashboard');
toggleSidebar();//hide login