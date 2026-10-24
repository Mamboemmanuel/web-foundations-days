const loadUsersBtn = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let allUsers = [];

async function loadUsers() {
  statusText.textContent = "Loading users...";
  loadUsersBtn.disabled = true;
  usersList.innerHTML = "";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allUsers = await response.json();
    renderUsers(allUsers);
    statusText.textContent = `Successfully loaded ${allUsers.length} users.`;
  } catch (error) {
    statusText.textContent = "Could not load users. Please try again later.";
    console.error("Error fetching users:", error);
  } finally {
    loadUsersBtn.disabled = false;
  }
}

function renderUsers(usersToRender) {
  usersList.innerHTML = "";

  if (usersToRender.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No users match your filter.";
    usersList.appendChild(li);
    return;
  }

  usersToRender.forEach(user => {
    const li = document.createElement("li");
    
    const nameEl = document.createElement("strong");
    nameEl.textContent = user.name;
    
    const detailsEl = document.createElement("p");
    detailsEl.textContent = `Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;
    detailsEl.style.margin = "0.2rem 0 1rem 0";
    
    li.appendChild(nameEl);
    li.appendChild(detailsEl);
    usersList.appendChild(li);
  });
}

loadUsersBtn.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  const query = filterInput.value.toLowerCase().trim();
  const filtered = allUsers.filter(user => 
    user.name.toLowerCase().includes(query)
  );
  renderUsers(filtered);
});