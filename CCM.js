let clients = [];
        let contacts = [];

        function showPage(pageId) {
            document.querySelectorAll('.page-section').forEach(page => 
                page.classList.remove('active-page'));
            document.getElementById(`${pageId}-page`).classList.add('active-page');
            
            document.querySelectorAll('.nav-button').forEach(btn => 
                btn.classList.remove('active'));
            event.target.classList.add('active');
        }

        function generateClientCode(name) {
            const cleanName = name.replace(/[^A-Za-z]/g, '').toUpperCase();
            let alpha = cleanName.slice(0, 3);
            if (alpha.length < 3) {
                alpha += 'A'.repeat(3 - alpha.length);
            }

            let numeric = 1;
            const existingCodes = clients.filter(c => c.code?.startsWith(alpha))
                                    .map(c => parseInt(c.code.slice(3), 10));
            if (existingCodes.length > 0) {
                numeric = Math.max(...existingCodes) + 1;
            }

            return alpha + numeric.toString().padStart(3, '0');
        }

        function addClient() {
            const nameInput = document.getElementById('clientName');
            const feedback = document.getElementById('clientFeedback');
            
            // Clear previous feedback
            feedback.className = 'feedback-message';
            feedback.textContent = '';
            
            // Validate input
            if (!nameInput.value.trim()) {
                feedback.textContent = 'Client name is required';
                feedback.className = 'feedback-message error-message';
                return;
            }
            
            // Check for duplicate client name
            if (clients.some(client => client.name.toLowerCase() === nameInput.value.trim().toLowerCase())) {
                feedback.textContent = 'Client with this name already exists';
                feedback.className = 'feedback-message error-message';
                return;
            }
            
            const code = generateClientCode(nameInput.value);
            const client = {
                id: Date.now(),
                code: code,
                name: nameInput.value.trim(),
                linkedContacts: []
            };
            
            clients.push(client);
            feedback.textContent = 'Client added successfully';
            feedback.className = 'feedback-message success-message';
            renderClients();
            clearClientForm();
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                feedback.className = 'feedback-message';
                feedback.textContent = '';
            }, 3000);
        }

        function deleteClient(id) {
            if (confirm('Are you sure you want to delete this client?')) {
                clients = clients.filter(client => client.id !== id);
                renderClients();
            }
        }

        function editClient(id) {
            const client = clients.find(c => c.id === id);
            const row = document.querySelector(`tr[data-client-id="${id}"]`);
            
            row.innerHTML = `
                <td><input value="${client.name}"></td>
                <td>${client.code}</td>
                <td>${createLinkedContactsDropdown(client)}</td>
                <td>
                    <button class="action-button" onclick="saveClientEdit(${id})">Save</button>
                    <button class="action-button delete-btn" onclick="cancelEdit()">Cancel</button>
                </td>
            `;
        }

        function saveClientEdit(id) {
            const client = clients.find(c => c.id === id);
            const row = document.querySelector(`tr[data-client-id="${id}"]`);
            const newName = row.querySelector('td:nth-child(1) input').value.trim();
            
            if (!newName) {
                alert('Client name cannot be empty');
                return;
            }
            
            // Check for duplicate name (excluding current client)
            if (clients.some(c => c.id !== id && c.name.toLowerCase() === newName.toLowerCase())) {
                alert('Client with this name already exists');
                return;
            }
            
            client.name = newName;
            renderClients();
        }

        function addContact() {
            const nameInput = document.getElementById('contactName');
            const surnameInput = document.getElementById('contactSurname');
            const emailInput = document.getElementById('contactEmail');
            const feedback = document.getElementById('contactFeedback');
            
            // Clear previous feedback
            feedback.className = 'feedback-message';
            feedback.textContent = '';
            
            // Validate inputs
            if (!nameInput.value.trim() || !surnameInput.value.trim()) {
                feedback.textContent = 'Both name and surname are required';
                feedback.className = 'feedback-message error-message';
                return;
            }
            
            // Validate email if provided
            if (emailInput.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    feedback.textContent = 'Please enter a valid email address';
                    feedback.className = 'feedback-message error-message';
                    return;
                }
                
                // Check for duplicate email
                if (contacts.some(contact => contact.email.toLowerCase() === emailInput.value.trim().toLowerCase())) {
                    feedback.textContent = 'Contact with this email already exists';
                    feedback.className = 'feedback-message error-message';
                    return;
                }
            }
            
            const contact = {
                id: Date.now(),
                name: nameInput.value.trim(),
                surname: surnameInput.value.trim(),
                email: emailInput.value.trim(),
                linkedClients: []
            };
            
            contacts.push(contact);
            feedback.textContent = 'Contact added successfully';
            feedback.className = 'feedback-message success-message';
            renderContacts();
            clearContactForm();
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                feedback.className = 'feedback-message';
                feedback.textContent = '';
            }, 3000);
        }

        function deleteContact(id) {
            if (confirm('Are you sure you want to delete this contact?')) {
                contacts = contacts.filter(contact => contact.id !== id);
                renderContacts();
            }
        }

        function editContact(id) {
            const contact = contacts.find(c => c.id === id);
            const row = document.querySelector(`tr[data-contact-id="${id}"]`);
            
            row.innerHTML = `
                <td><input value="${contact.name}"></td>
                <td><input value="${contact.surname}"></td>
                <td><input value="${contact.email}"></td>
                <td>${createLinkedClientsDropdown(contact)}</td>
                <td>
                    <button class="action-button" onclick="saveContactEdit(${id})">Save</button>
                    <button class="action-button delete-btn" onclick="cancelEdit()">Cancel</button>
                </td>
            `;
        }

        function saveContactEdit(id) {
            const contact = contacts.find(c => c.id === id);
            const row = document.querySelector(`tr[data-contact-id="${id}"]`);
            const newName = row.querySelector('td:nth-child(1) input').value.trim();
            const newSurname = row.querySelector('td:nth-child(2) input').value.trim();
            const newEmail = row.querySelector('td:nth-child(3) input').value.trim();
            
            // Validate inputs
            if (!newName || !newSurname) {
                alert('Both name and surname are required');
                return;
            }
            
            // Validate email if provided
            if (newEmail) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(newEmail)) {
                    alert('Please enter a valid email address');
                    return;
                }
                
                // Check for duplicate email (excluding current contact)
                if (contacts.some(c => c.id !== id && c.email.toLowerCase() === newEmail.toLowerCase())) {
                    alert('Contact with this email already exists');
                    return;
                }
            }
            
            contact.name = newName;
            contact.surname = newSurname;
            contact.email = newEmail;
            renderContacts();
        }

        function createLinkedContactsDropdown(client) {
            return `
                <div class="dropdown">
                    <button onclick="toggleDropdown(this)">Manage Contacts ▼</button>
                    <div class="dropdown-content">
                        ${contacts.map(contact => `
                            <button class="dropdown-item" 
                                onclick="toggleLink(${client.id}, ${contact.id}, 'client')"
                                ${client.linkedContacts.includes(contact.id) ? 'style="background-color:#cfe2ff"' : ''}>
                                ${contact.surname} ${contact.name}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        function createLinkedClientsDropdown(contact) {
            return `
                <div class="dropdown">
                    <button onclick="toggleDropdown(this)">Manage Clients ▼</button>
                    <div class="dropdown-content">
                        ${clients.map(client => `
                            <button class="dropdown-item" 
                                onclick="toggleLink(${contact.id}, ${client.id}, 'contact')"
                                ${contact.linkedClients.includes(client.id) ? 'style="background-color:#cfe2ff"' : ''}>
                                ${client.name} (${client.code})
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        function toggleLink(parentId, childId, type) {
            if (type === 'client') {
                const client = clients.find(c => c.id === parentId);
                const index = client.linkedContacts.indexOf(childId);
                index === -1 ? client.linkedContacts.push(childId) : client.linkedContacts.splice(index, 1);
            } else {
                const contact = contacts.find(c => c.id === parentId);
                const index = contact.linkedClients.indexOf(childId);
                index === -1 ? contact.linkedClients.push(childId) : contact.linkedClients.splice(index, 1);
            }
            renderClients();
            renderContacts();
        }

        function renderClients() {
            const tbody = document.getElementById('clientsList');
            
            if (clients.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4">No client(s) found</td></tr>`;
                return;
            }

            tbody.innerHTML = clients.map(client => `
                <tr data-client-id="${client.id}">
                    <td>${client.name}</td>
                    <td>${client.code}</td>
                    <td class="center-align">${client.linkedContacts.length}</td>
                    <td>
                        <button class="action-button edit-btn" onclick="editClient(${client.id})">Edit</button>
                        <button class="action-button delete-btn" onclick="deleteClient(${client.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        }

        function renderContacts() {
            const tbody = document.getElementById('contactsList');
            const sortedContacts = [...contacts].sort((a, b) => {
                const fullNameA = `${a.surname} ${a.name}`.toUpperCase();
                const fullNameB = `${b.surname} ${b.name}`.toUpperCase();
                return fullNameA.localeCompare(fullNameB);
            });

            tbody.innerHTML = sortedContacts.length === 0 
                ? `<tr><td colspan="5">No contact(s) found</td></tr>`
                : sortedContacts.map(contact => `
                    <tr data-contact-id="${contact.id}">
                        <td>${contact.name}</td>
                        <td>${contact.surname}</td>
                        <td>${contact.email}</td>
                        <td class="center-align">${contact.linkedClients.length}</td>
                        <td>
                            <button class="action-button edit-btn" onclick="editContact(${contact.id})">Edit</button>
                            <button class="action-button delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
                        </td>
                    </tr>
                `).join('');
        }

        function clearClientForm() {
            document.getElementById('clientName').value = '';
        }

        function clearContactForm() {
            document.getElementById('contactName').value = '';
            document.getElementById('contactSurname').value = '';
            document.getElementById('contactEmail').value = '';
        }

        function toggleDropdown(button) {
            const dropdown = button.parentElement.querySelector('.dropdown-content');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }

        function cancelEdit() {
            renderClients();
            renderContacts();
        }

        // Initial render
        renderClients();
        renderContacts();