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
        } else if (result.failure) {
            addAlertElement.innerHTML = alertMaker(result.failure);
        } else {
            addAlertElement.innerHTML = alertMaker();
        }
        console.log(result);
    }
});

function alertMaker(msg = "Something went wrong!", cls = "danger") {
    return `<div class="alert alert-${cls} alert-dismissible fade show" role="alert">
    ${msg}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}