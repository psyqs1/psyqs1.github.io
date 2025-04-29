import { CreateVehicleElement, FetchPeopleByID, FetchPeopleByNameOrLPN, FetchVehiclesByRego } from "./SB.js";

const RegoInput = document.getElementById("rego");;
const Submit = document.getElementById("submit");
const Message = document.getElementsByClassName("message")[0];
const Results = document.getElementById("results");

async function SubmitClickHandler() {
    Results.innerHTML = "";

    //Validation
    if (!RegoInput.value) {
        Message.textContent = "Error, no input!";
        return;
    }

    Message.textContent = "Fetching...";

    var IDToNameMap = new Map();

    await FetchPeopleByNameOrLPN("*","*").then(
        (People) => {
            for (const Person of People) {
                IDToNameMap.set(Person.PersonID, Person.Name);
            }
        },
        () => {
            Message.textContent = "Error while fetching from database!";
        }
    )

    FetchVehiclesByRego(RegoInput.value).then(
        (Vehicles) => {
            Message.textContent = Vehicles.length > 0 ?
                "Search successful!" :
                "No result found!"   ;

            for (const Vehicle of Vehicles) {
                console.log(Vehicle);

                Results.innerHTML += CreateVehicleElement(
                    Vehicle.VehicleID,
                    Vehicle.Make,
                    Vehicle.Model,
                    Vehicle.Colour,
                    Vehicle.OwnerID,
                    IDToNameMap.get(Vehicle.OwnerID) ?? "Unknown"
                );
            }
        },
        () => {
            Message.textContent = "Error while fetching from database!";
        }
    )
}

function CheckAllowSubmit() {
    let Valid = RegoInput.checkValidity();
    Submit.disabled = !Valid;
    return Valid;
}

RegoInput.addEventListener("input", CheckAllowSubmit);
Submit.addEventListener("click", SubmitClickHandler);