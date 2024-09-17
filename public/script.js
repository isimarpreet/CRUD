document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('list')) {
      fetchUsers();
  }

  // Call fetchUsers when the page loads
  function fetchUsers() {
      fetch('/api/users')
          .then(response => response.json())
          .then(data => {
              const userTable = document.getElementById('user-table');
              userTable.innerHTML = ''; // Clear the table before inserting rows

              data.data.forEach(user => {
                  const row = document.createElement('tr');
                  row.innerHTML = `
                      <td>${user.id}</td>
                      <td>${user.name}</td>
                      <td>${user.email}</td>
                      <td>${user.phone}</td>
                      <td>${user.age}</td>
                      <td class="actions">
                          <a href="/view/${user.id}"><button>View</button></a>
                          <a href="/edit/${user.id}"><button>Edit</button></a>
                          <button onclick="deleteUser(${user.id})">Delete</button>
                      </td>
                  `;
                  userTable.appendChild(row);
              });
          });
  }

  // Implement search functionality
  document.getElementById('search-bar').addEventListener('keyup', function () {
      let searchQuery = this.value.toLowerCase();
      let rows = document.querySelectorAll('tbody tr');

      rows.forEach(row => {
          const nameCell = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
          if (nameCell.includes(searchQuery)) {
              row.style.display = '';
          } else {
              row.style.display = 'none';
          }
      });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('user-form');
  
  if (userForm) {
      userForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const phone = document.getElementById('phone').value;
          const age = document.getElementById('age').value;
          
          fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email, phone, age }),
          }).then(response => response.json())
            .then(() => window.location.href = '/list')
            .catch(error => console.error('Error:', error));
      });
  }
});


function deleteUser(id) {
  fetch(`/api/users/${id}`, { method: 'DELETE' })
      .then(() => window.location.href = '/list');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('user-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validation
    const phone = document.getElementById('phone').value;
    const age = document.getElementById('age').value;

    if (!/^\d{10}$/.test(phone)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    if (age < 0 || age > 99) {
      alert('Age must be between 0 and 99.');
      return;
    }

    // If validation passes, proceed with form submission
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, phone, age })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'User added') {
        alert('User added successfully');
        window.location.href = '/list';
      } else {
        alert('Error adding user');
      }
    })
    .catch(err => console.error('Error:', err));
  });
});

