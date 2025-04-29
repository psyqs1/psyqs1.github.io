import { CreatePersonElement, CreatePersonElementWithSelect, FetchPeopleByID, FetchPeopleByNameOrLPN, FetchPerson, InsertPerson, InsertVehicle } from "./SB.js";

const RegoInput = document.getElementById("rego");
const MakeInput = document.getElementById("make");
const ModelInput = document.getElementById("model");
const ColourInput = document.getElementById("colour");

const CheckOwnerButton = document.getElementById("checkOwnerButton");

const Submit = document.getElementById("submit");
const MessageOwner = document.getElementById("message-owner");
const MessageVehicle = document.getElementById("message-vehicle");
const Results = document.getElementById("results");

var OwnerID;
var LastCheckedOwner = null;
var Tab = "Existing";

function Debounce(Timeout, Action) { //Hmmmm
    let Timer; 
    return (...args) => {
        clearTimeout(Timer);
        Timer = setTimeout(() => { Action.apply(this, args); }, Timeout);
    };
}

//#region Existing Owner Tab
const ExistingOwnerButton = document.getElementById("existingOwnerButton");
const ExistingOwnerTab = document.getElementsByClassName("existingOwnerTab");
const OwnerInput = document.getElementById("owner");

function HideExistingOwnerTab() {
    for (const E of ExistingOwnerTab) {
        E.style.display = "none";
    }

    ExistingOwnerButton.className = "";
}

function ShowExistingOwnerTab() {
    HideNewOwnerTab();

    Tab = "Existing";

    for (const E of ExistingOwnerTab) {
        E.style.display = "inherit";
    }

    ExistingOwnerButton.className = "ownerTabBarSelectedButton";
}

async function ValidateExistingOwner() {
    if (!CheckAllowCheckOwner) {
        MessageOwner.textContent = "Error, not allowed to check owner!";
        return;
    }
    if (!OwnerInput.value) return;

    Results.innerHTML = "";

    MessageOwner.textContent = "Searching Owners...";
    await FetchPeopleByNameOrLPN(OwnerInput.value, "*").then(
        (People) => {
            MessageOwner.textContent = `Found ${People.length} Owners!`;

            for (const Person of People) {
                Results.innerHTML += CreatePersonElementWithSelect(
                    Person.PersonID,
                    Person.Name,
                    Person.Address,
                    Person.DOB,
                    Person.LicenseNumber,
                    Person.ExpiryDate
                );

            }

            for (const Person of People ) {
                document.getElementById(`SelectPerson${Person.PersonID}`).addEventListener("click", SelectMe);
            }
        },
        () => {
            Message.textContent = "Error while fetching from database!";
        }
    );

    LastCheckedOwner = OwnerInput.value;

    GlobalCheck();
}

function ForceSetExistingOwner(Person) {
    ExistingOwnerButton.click();
    
    Results.innerHTML = CreatePersonElement(
        Person.PersonID,
        Person.Name,
        Person.Address,
        Person.DOB,
        Person.LicenseNumber,
        Person.ExpiryDate
    );

    OwnerInput.value = Person.Name;
    OwnerID = Person.PersonID;

    GlobalCheck();
}
//#endregion

//#region New Owner Tab
const NewOwnerButton = document.getElementById("newOwnerButton");
const NewOwnerTab = document.getElementsByClassName("newOwnerTab");
    const NameInput = document.getElementById("name");
    const AddressInput = document.getElementById("address");
    const DOBInput = document.getElementById("dob");
    const LNInput = document.getElementById("license");
    const EXPInput = document.getElementById("expire");

function HideNewOwnerTab() {
    for (const E of NewOwnerTab) {
        E.style.display = "none";
    }

    NewOwnerButton.className = "";
}

function ShowNewOwnerTab() {
    HideExistingOwnerTab();

    Tab = "New";

    for (const E of NewOwnerTab) {
        E.style.display = "inherit";
    }

    NewOwnerButton.className = "ownerTabBarSelectedButton";

    NameInput.value = OwnerInput.value;

    MessageOwner.textContent = "";
}
//#endregion

//#region Add owner
const AddOwnerButton = document.getElementById("addOwnerButton");

async function AddPerson() {
    if (!CheckAllowAddOwner()) {
        Message.textContent = "Error, not allowed to add owner!";
        return;
    }

    var InsertAllowed = false;

    MessageOwner.textContent = "Seeing If Details Already Exist...";

    await FetchPerson(
        NameInput.value,
        AddressInput.value,
        DOBInput.value,
        LNInput.value,
        EXPInput.value
    ).then(
        (People) => {
            if (People.length == 1) {
                MessageOwner.textContent = "This Owner Already Exists!";
                ForceSetExistingOwner(People[0]);
            }
            else {
                MessageOwner.textContent = "Adding New Owner...";
                InsertAllowed = true;
            }
        },
        () => {
            MessageOwner.textContent = "Error while fetching from database!";
        }
    )

    if (!InsertAllowed) return;

    await InsertPerson(
        NameInput.value,
        AddressInput.value,
        DOBInput.value,
        LNInput.value,
        EXPInput.value
    ).then(
        (People) => {
            MessageOwner.textContent = "Owner added successfully!";
            ForceSetExistingOwner(People[0]);
        },
        () => {
            MessageOwner.textContent = "Error while adding new owner to database!";
        }
    )
}
//#endregion

//#region Selection
async function SelectMe() {
    await FetchPeopleByID(this.dataset.personid).then(
        (People) => {
            var Person = People[0];
        
            Results.innerHTML = CreatePersonElement(
                Person.PersonID,
                Person.Name,
                Person.Address,
                Person.DOB,
                Person.LicenseNumber,
                Person.ExpiryDate
            );

            OwnerInput.value = Person.Name;
            OwnerID = Person.PersonID;
        },
        () => {
            OwnerMessage.textContent = "Error while fetching from database!";
        }
    )

    GlobalCheck();
}
//#endregion

//#region Add Vehicle
async function SubmitClickHandler() {
    if (!CheckAllowSubmit) {
        MessageVehicle.textContent = "Error, not allowed to add vehicle!";
        return;
    }

    MessageVehicle.textContent = "Adding vehicle...";

    InsertVehicle(
        RegoInput.value,
        MakeInput.value,
        ModelInput.value,
        ColourInput.value,
        OwnerID
    ).then(
        (Vehicle) => {
            MessageVehicle.textContent = "Vehicle added successfully!";
            setTimeout(() => Reset(), 500);
        },
        () => {
            MessageVehicle.textContent = "Error while adding vehicle to database!";
        }
    )
}
//#endregion

//#region Availability Checks
function CheckAllowCheckOwner() {
    let Valid = OwnerInput.checkValidity() && (Tab == "Existing");
    CheckOwnerButton.disabled = !Valid;
    return Valid;
}

function CheckAllowNewOwner() {
    let Valid = (OwnerInput.value == LastCheckedOwner)
    NewOwnerButton.disabled = !Valid;
    return Valid;
}

function CheckAllowAddOwner() {
    let Valid = NameInput.checkValidity() && AddressInput.checkValidity() && DOBInput.checkValidity() && LNInput.checkValidity() && EXPInput.checkValidity();
    AddOwnerButton.disabled = !Valid;
    return Valid;
}

function CheckAllowSubmit() {
    let Valid = OwnerID && (RegoInput.checkValidity() && MakeInput.checkValidity() && ModelInput.checkValidity() && ColourInput.checkValidity());
    Submit.disabled = !Valid;
    return Valid;
}

function GlobalCheck() {
    CheckAllowCheckOwner();
    CheckAllowNewOwner();
    CheckAllowAddOwner();
    CheckAllowSubmit();
}
//#endregion

function Reset() {
    RegoInput.value = "";
    MakeInput.value = "";
    ModelInput.value = "";
    ColourInput.value = "";
    ExistingOwnerButton.click();
    OwnerInput.value = "";
    NameInput.value = "";
    AddressInput.value = "";
    DOBInput.value = "";
    LNInput.value = "";
    EXPInput.value = "";
    OwnerID = null;
    Results.innerHTML = "";
}

document.addEventListener("click", GlobalCheck);

RegoInput.addEventListener("input", CheckAllowSubmit);
MakeInput.addEventListener("input", CheckAllowSubmit);
ModelInput.addEventListener("input", CheckAllowSubmit);
ColourInput.addEventListener("input", CheckAllowSubmit);

ExistingOwnerButton.addEventListener("click", ShowExistingOwnerTab);
    OwnerInput.addEventListener("input", CheckAllowCheckOwner);
    OwnerInput.addEventListener("input", Debounce(250, () => ValidateExistingOwner()));

CheckOwnerButton.addEventListener("click", ValidateExistingOwner);

NewOwnerButton.addEventListener("click", ShowNewOwnerTab);
    NameInput.addEventListener("input", CheckAllowAddOwner);
    AddressInput.addEventListener("input", CheckAllowAddOwner);
    DOBInput.addEventListener("input", CheckAllowAddOwner);
    LNInput.addEventListener("input", CheckAllowAddOwner);
    EXPInput.addEventListener("input", CheckAllowAddOwner);

AddOwnerButton.addEventListener("click", AddPerson);

Submit.addEventListener("click", SubmitClickHandler);

ExistingOwnerButton.click();