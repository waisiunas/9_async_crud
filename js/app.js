showUsers();

const addFormElement = document.querySelector("#add-form");
const addAlertElement = document.querySelector("#add-alert");

addFormElement.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nameAddElement = document.querySelector("#name-add");
    const emailAddElement = document.querySelector("#email-add");

    let nameAddValue = nameAddElement.value;
    let emailAddValue = emailAddElement.value;

    nameAddElement.classList.remove('is-invalid');
    emailAddElement.classList.remove('is-invalid');
    addAlertElement.innerHTML = '';

    if (nameAddValue == "" || nameAddValue === undefined) {
        addAlertElement.innerHTML = alertMaker("Provide name!");
        nameAddElement.classList.add('is-invalid');
    } else if (emailAddValue == "" || emailAddValue === undefined) {
        addAlertElement.innerHTML = alertMaker("Provide email!");
        emailAddElement.classList.add('is-invalid');
    } else {
        const data = {
            name: nameAddValue,
            email: emailAddValue,
            submit: 1,
        };

        const response = await fetch('./api/add-user.php', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.nameError) {
            addAlertElement.innerHTML = alertMaker(result.nameError);
            nameAddElement.classList.add('is-invalid');
        } else if (result.emailError) {
            addAlertElement.innerHTML = alertMaker(result.emailError);
            emailAddElement.classList.add('is-invalid');
        } else if (result.success) {
            addAlertElement.innerHTML = alertMaker(result.success, 'success');
            nameAddElement.value = '';
            emailAddElement.value = '';
            showUsers();
        } else if (result.failure) {
            addAlertElement.innerHTML = alertMaker(result.failure);
        } else {
            addAlertElement.innerHTML = alertMaker();
        }
    }
});

async function showUsers() {
    const response = await fetch('./api/show-users.php');
    const result = await response.json();

    const responseElement = document.querySelector("#response");

    if (result.length !== 0) {
        let rows = '';
        result.forEach(function (user, index) {
            rows += `<tr>
                                    <td>${index + 1}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>
                                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editUserModal" onclick="editUser(${user.id})">
                                            Edit
                                        </button>
                                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteUserModal" onclick="deleteUser(${user.id})">
                                            Delete
                                        </button>
                                    </td>
                                </tr>`;

        });
        responseElement.innerHTML = `<table class="table table-bordered m-0">
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                ${rows}
                            </tbody>
                        </table>`;
    } else {
        responseElement.innerHTML = `<div class="alert alert-info m-0">No record found!</div>`;
    }
}

const nameEditElement = document.querySelector("#name-edit");
const emailEditElement = document.querySelector("#email-edit");

let outerID = '';

async function editUser(id) {
    outerID = id;
    const data = {
        id: id
    };
    const response = await fetch("./api/show-single-user.php", {
        method: 'POST',
        body: JSON.stringify(data),
    });
    const result = await response.json();

    nameEditElement.value = result.name;
    emailEditElement.value = result.email;
}

const editFormElement = document.querySelector("#edit-form");
const editAlertElement = document.querySelector("#edit-alert");

editFormElement.addEventListener("submit", async function (e) {
    e.preventDefault();

    let nameEditValue = nameEditElement.value;
    let emailEditValue = emailEditElement.value;

    nameEditElement.classList.remove('is-invalid');
    emailEditElement.classList.remove('is-invalid');
    editAlertElement.innerHTML = '';

    if (nameEditValue == "" || nameEditValue === undefined) {
        editAlertElement.innerHTML = alertMaker("Provide name!");
        nameEditElement.classList.add('is-invalid');
    } else if (emailEditValue == "" || emailEditValue === undefined) {
        editAlertElement.innerHTML = alertMaker("Provide email!");
        emailEditElement.classList.add('is-invalid');
    } else {
        const data = {
            name: nameEditValue,
            email: emailEditValue,
            id: outerID,
            submit: 1,
        };

        const response = await fetch("./api/edit-user.php", {
            method: "POST",
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.nameError) {
            editAlertElement.innerHTML = alertMaker(result.nameError);
            nameEditElement.classList.add('is-invalid');
        } else if (result.emailError) {
            editAlertElement.innerHTML = alertMaker(result.emailError);
            emailEditElement.classList.add('is-invalid');
        } else if (result.success) {
            editAlertElement.innerHTML = alertMaker(result.success, 'success');
            showUsers();
        } else if (result.failure) {
            editAlertElement.innerHTML = alertMaker(result.failure);
        } else {
            editAlertElement.innerHTML = alertMaker();
        }

    }
});

function deleteUser(id) {
    outerID = id;
}

const deleteFormElement = document.querySelector("#delete-form");

deleteFormElement.addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = {
        id: outerID
    };

    const response = await fetch('./api/delete-user.php', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    const result = await response.json();

    const alertElement = document.querySelector("#alert");

    if (result.success) {
        alertElement.innerHTML = alertMaker(result.success, 'success');
        showUsers();
        closeDeleteModal();
    } else if (result.failure) {
        alertElement.innerHTML = alertMaker(result.failure);
    } else {
        alertElement.innerHTML = alertMaker();
    }

});

function closeDeleteModal() {
    const modalElement = document.querySelector('#deleteUserModal');
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        modal.hide();
    }
}

function alertMaker(msg = "Something went wrong!", cls = "danger") {
    return `<div class="alert alert-${cls} alert-dismissible fade show" role="alert">
    ${msg}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}