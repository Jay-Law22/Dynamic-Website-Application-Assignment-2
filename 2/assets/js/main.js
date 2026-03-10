// Theme Toggle
const btn = document.querySelector('#themeToggle');
btn.onclick = () => {
    document.documentElement.classList.toggle('dark');
    document.querySelector('#themeIcon').innerHTML =
    document.documentElement.classList.contains('dark') ? '<i class="ri-sun-fill"></i>' : '<i class="ri-moon-fill"></i>'  
}


// Questions Tab Switcher
const tabs = document.querySelectorAll('.tab-link');
const sections = document.querySelectorAll('.question-content');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        // Remove the active class & hide all section
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.add('hidden'));

        // Add active class when clicked & render section
        tab.classList.add('active');
        sections[index].classList.remove('hidden');
    });
});

// Question 1
let allEmp = [];
let isTableView = true;
async function EmployeesDetail() {

    try {
        // path of json file || fetch data using Async
        const response = await fetch ('/data/employees.json');
        if(!response.ok) throw new Error("Invalid path");
        const emplist = await response.json();
        allEmp = emplist.employees;

        // The Organizer:  Sort the by age in ascending order
        allEmp.sort((a,b) => a.age - b.age);

        // The Mapper: Full names , destructing
        const fullNames = allEmp.map(({firstName, lastName}) => `${firstName} ${lastName}`);
        console.log("Employees Full Names:", fullNames)

        // The Recruiter: Filter > $55,000
        const bigEarners = allEmp.filter((emp => emp.salary > 55000));
        console.log("Top Earners:" , bigEarners)

        // Local Persistence
        localStorage.setItem("employeesInfo", JSON.stringify(allEmp));
        console.log("Saved Info:", JSON.parse(localStorage.getItem("employeesInfo")));


        renderUI(allEmp);

    }
    catch(error) {
        document.querySelector("#employeeTableBody").innerHTML = `<tr><td colspan="3" class="text-center py-10 text-red-500">Error: ${error.message}</td></tr>`;
    };
    
}

function renderUI(displayData){
    const tableBody = document.querySelector("#employeeTableBody");
    const salaryContainer = document.querySelector("#totalSalaryContainer");
    const listElement = document.querySelector("#employeeList");

    // The Accountant: the total
    const total = displayData.reduce((t , emp) => t + emp.salary, 
    // set the 't' to 0 it keeps the running total
    0
);


    // List view
    listElement.innerHTML = displayData.map(emp => 
    `<li>ID#:${emp.id} - ${emp.firstName} ${emp.lastName} - Age: ${emp.age} - Department:${emp.department} - Salary:$ ${emp.salary}</li>`).join('');

    // Table view
        // Render to the table
    // tableBody.innerHTML = "";

    // goes through the data and render a table
    tableBody.innerHTML = displayData.map(emp => 
        `
        <tr class="border-b border-[var(--border)] hover:bg-[var(--accent-soft)] transition-colors">
            <td class="py-4 px-2">${emp.id}</td>
            <td class="py-4 px-2 font-bold text-[var(--text-title)]">${emp.firstName} ${emp.lastName}</td>
            <td class="py-4 px-2">${emp.age}</td>
            <td class="py-4 px-2">${emp.department}</td>
            <td class="py-4 px-2">$ ${emp.salary.toLocaleString()}</td>
            </tr>
        `).join('');

    salaryContainer.innerHTML = `
    <p class="text-sm opacity-60 uppercase font-bold">Total Annual Payroll</p>
    <p class="text-3xl font-black text-[var(--accent-pink)]">$${total.toLocaleString()}</p>
    `;
}

// Searchbar functionality
document.querySelector("#searchInput").addEventListener('input', (event) =>
{
    const searchData = event.target.value.toLowerCase();

    const filteredList = allEmp.filter(emp => {
        const filteredData = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        return filteredData.includes(searchData);
    });

    renderUI(filteredList);
})

// Toggle between list n table view
function toggleView(){
    const tableDiv = document.querySelector("#tableView");
    const listDiv = document.querySelector("#demo");
    const btn = document.querySelector("#viewBtn");

    if(isTableView)
    {
        tableDiv.classList.add("hidden");
        listDiv.classList.remove("hidden");
        btn.textContent = "Switch to Table View";
    }
    else
    {
        tableDiv.classList.remove("hidden");
        listDiv.classList.add("hidden");
        btn.textContent = "Switch to List View";
    }

    isTableView = !isTableView;
}

function Clear()
{
    const userConfirmation = confirm("Are you sure you want to clear?")
    if (!userConfirmation)
    {
        alert("Save Data not deleted");
    }
    else
    {
        localStorage.removeItem("employeesInfo");
        localStorage.clear();
        alert("Save Data has been deleted");
        setTimeout(() => {
            location.reload();
        }, 2000); // 2 seconds
    }
}

// Call function
EmployeesDetail();

// Question 2
function togglePaymentFields(){
    const selectPayment = document.querySelector('input[name="payment"]:checked').value;
    const cardFields = document.querySelector("#cardFields");
    const inputs = cardFields.querySelectorAll('input');

    // condition for if not paypal then visa or master
    const isCard = (selectPayment === 'visa' || selectPayment === 'mastercard');

    if (isCard) {
        cardFields.classList.remove('opacity-40', 'pointer-events-none', 'grayscale');
        inputs.forEach(i => i.disabled = false);
    }
    else{
        cardFields.classList.add('opacity-40', 'pointer-events-none', 'grayscale');
        inputs.forEach(i => i.disabled = true);
    }
}

// Additional Shipping options function
function toggleShipping() {
    const isSame = document.querySelector("#sameAsBilling").checked;
    const shippingArea = document.querySelector("#shippingFields");

    if (isSame) {
        shippingArea.classList.add('hidden');
    }
    else{
        shippingArea.classList.remove('hidden');
    }
}

// Form validation 
function isValid(){
    const billingForm = document.querySelector("#billingForm");

    billingForm.addEventListener("submit",  (event) => {
        const formName = document.querySelector("#fullname");
        const formEmail = document.querySelector("#email");
        const formAddress = document.querySelector("#address");
        const formCity = document.querySelector("#city");
        const formState = document.querySelector("#state");
        const formPostalCode = document.querySelector("#postalcode");
        const formCountry = document.querySelector("#country");
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const cardNumber = document.querySelector('#cardNumber');
        const expiry = document.querySelector("#expiry");
        const cvv = document.querySelector("#cvv");

        // clear customvalidity
        const fields = [formName, formEmail, formAddress, formCity, formState, formPostalCode, formCountry, cardNumber, expiry, cvv];
        fields.forEach(fields => {if(fields) fields.setCustomValidity('');});


        // Regular expresssion for email
        const emailPattern =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validations
        if (formName.value.trim().length < 2) {
            formName.setCustomValidity("Please enter your name.")
        }

        if (!emailPattern.test(formEmail.value)) {
            formEmail.setCustomValidity("Please enter a valid email address (eg., javascript@vtdi.edu)");
        }

        if (formAddress.value.trim() === "") formAddress.setCustomValidity("Address is required");
        if (formCity.value.trim() === "") formCity.setCustomValidity("City is required");
        if (formPostalCode.value.trim() === "") formPostalCode.setCustomValidity("Postal Code is required");
        if (formCountry.value.trim() === "") formCountry.setCustomValidity ("Country is required");

        if (paymentMethod !== 'paypal')
        {
            if (cardNumber.value.replace(/\s/g, '').length < 16) {
                cardNumber.setCustomValidity("Please enter a valid 16-digit card number.");
            }
            if (cvv.value.length < 3)
            {
                cvv.setCustomValidity("CVV must be atleast 3 digits.")
            }
        }

        if (!billingForm.checkValidity()) {
            event.preventDefault() // Basically stop the form from submitting
            billingForm.reportValidity(); // stop pop-up bubble
        } else{
            event.preventDefault()
            alert("Success! form is valid")
        }
    })
}

// call function
togglePaymentFields();
toggleShipping();
isValid();


// Question 3
$(document).ready(function() {
    $('#employeeTable').DataTable({
        // path
        "ajax" : {
            "url": "/data/MOCK_DATA.json",
            "dataSrc": ""
        },
        "columns": [
            {"data": "id"},
            {"data": "first_name"},
            {"data": "last_name"},
            {"data": "email"},
            {"data": "department"},
            {"data": "salary", render: $.fn.dataTable.render.number(',', '.', 2, '$')}
        ],
        "pageLength": 10,
        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"]],
        "responsive": true,
        "language": {
            "search": "Filter Records:",
            "lengthMenu": "Show _MENU_ employees"
        }
    })
})