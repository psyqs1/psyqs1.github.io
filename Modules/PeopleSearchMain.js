import { CreatePersonElement, FetchPeopleByNameOrLPN } from "./SB.js";

const NameInput = document.getElementById("name");
const LPNInput = document.getElementById("license");
const Submit = document.getElementById("submit");
const Message = document.getElementsByClassName("message")[0];
const Results = document.getElementById("results");

function SubmitClickHandler() {
    Results.innerHTML = "";

    //Validation
    if (!NameInput.value == !LPNInput.value) { //Will only fetch if one field is populated
        Message.textContent = "Error, only one field should be used to search!";
        return;
    }

    Message.textContent = "Fetching...";

    FetchPeopleByNameOrLPN(NameInput.value, LPNInput.value).then(
        (People) => {
            if (People.length > 0) {
                Message.textContent = "Search successful!";

                for (const Person of People) {
                    console.log(Person);
    
                    Results.innerHTML += CreatePersonElement(
                        Person.PersonID,
                        Person.Name,
                        Person.Address,
                        Person.DOB,
                        Person.LicenseNumber,
                        Person.ExpiryDate
                    );
                }
            }
            else {
                Message.textContent = "No result found!";
            } 
        },
        () => {
            Message.textContent = "Error while fetching from database!";
        }
    )
}

function InputName() {
    NameInput.style.opacity = 1;

    LPNInput.value = "";
    LPNInput.style.opacity = 0.25;
}

function InputLPN() {
    LPNInput.style.opacity = 1;

    NameInput.value = "";
    NameInput.style.opacity = 0.25;
}

function CheckAllowSubmit() {
    let Valid = NameInput.checkValidity() || LPNInput.checkValidity();
    Submit.disabled = !Valid;
    return Valid;
}

NameInput.addEventListener("click", InputName);
LPNInput.addEventListener("click", InputLPN);
NameInput.addEventListener("input", CheckAllowSubmit);
LPNInput.addEventListener("input", CheckAllowSubmit);

Submit.addEventListener("click", SubmitClickHandler);

Results.style.border = "2px dashed black";
