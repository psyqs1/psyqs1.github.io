import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SB = createClient("https://dggmyjmokbqvugwjkvil.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnZ215am1va2JxdnVnd2prdmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzEzOTEsImV4cCI6MjA1OTcwNzM5MX0.xW9DKbpYVibTu3Jpe8bvC50Hhpk5BZyTWjgHoQp3HOE");
console.log("Supabase client created!");

//#region Element Creation Functions
//Functions that return the raw HTML to display a person or vehicle's information. 
//The raw HTML is intended to be appended to a div's innerHTML.

function CreatePersonElement(PersonID, Name, Address, DOB, LPN, ExpiryDate) {
    return `
        <div class="result" id="PERSONELEMENT${PersonID}">
            <span class="resultcolumns"><b>
                Person ID:<hr>
                Name:<hr>
                Address:<hr>
                Date Of Birth:<hr>
                License Number:<hr>
                Expiry Date:
            </span></b>
            <span class="resultrow">
                ${PersonID}<hr>
                ${Name}<hr>
                ${Address}<hr>
                ${DOB}<hr>
                ${LPN}<hr>
                ${ExpiryDate}
            </span>
        </div>
    `;
}

function CreatePersonElementWithSelect(PersonID, Name, Address, DOB, LPN, ExpiryDate) {
    return `
        <div class="result">
            <span class="resultcolumns"><b>
                Person ID:<hr>
                Name:<hr>
                Address:<hr>
                Date Of Birth:<hr>
                License Number:<hr>
                Expiry Date:<hr>
            </span></b>
            <span class="resultrow">
                ${PersonID}<hr>
                ${Name}<hr>
                ${Address}<hr>
                ${DOB}<hr>
                ${LPN}<hr>
                ${ExpiryDate}<hr>
            </span>
            <button type="button" id="SelectPerson${PersonID}" data-personid="${PersonID}">Select as Owner</button>
        </div>
    `;
}

function CreateVehicleElement(VehicleID, Make, Model, Color, OwnerID, OwnerName) {
    return `
        <div class="result">
            <span class="resultcolumns"><b>
                Vehicle ID:<hr>
                Make:<hr>
                Model:<hr>
                Colour:<hr>
                Owner:
            </span></b>
            <span class="resultrow">
                ${VehicleID}<hr>
                ${Make}<hr>
                ${Model}<hr>
                ${Color}<hr>
                ${OwnerName} (ID: ${OwnerID})
            </span>
        </div>
    `;
}
//#endregion

//#region Insertion & Fetching Functions
//Functions that interface with Supabase to fetch or insert people or vehicles into the database.
//Provides different functionalities, for example: fetching by name, or by id, or by every characteristic (to find exact matches)

async function FetchPeopleByNameOrLPN(Name, LN) {
    const { data, error } = (await SB
        .from("People")
        .select()
        .ilike("Name", `%${Name}%`)
        .ilike("LicenseNumber", `%${LN}%`)
    );

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

async function FetchPeopleByID(ID) {
    const { data, error } = (await SB
        .from("People")
        .select()
        .eq('PersonID', ID)
    );

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

async function FetchPerson(Name, Address, DOB, LN, EXP) {
    const { data, error } = (await SB
        .from("People")
        .select()
        .ilike("Name",`%${Name}%`)
        .ilike("Address", `%${Address}%`)
        .eq("DOB", DOB)
        .ilike("LicenseNumber", `%${LN}%`)
        .eq("ExpiryDate", EXP)
    );

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

async function InsertPerson(_Name, _Address, _DOB, LN, EXP) {
    const { data, error } = (await SB 
        .from("People")
        .insert({
            Name : _Name,
            Address : _Address,
            DOB : _DOB,
            LicenseNumber : LN,
            ExpiryDate : EXP
        })
        .select()
    );

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

async function FetchVehiclesByRego(Rego) {
    const { data, error } = (await SB
        .from("Vehicles")
        .select()
        .ilike("VehicleID", `%${Rego}%`)
    );

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

async function InsertVehicle(ID, _Make, _Model, _Colour, _OwnerID) {
    const { data, error } = (await SB
        .from("Vehicles")
        .insert({
            VehicleID : ID,
            Make : _Make,
            Model : _Model,
            Colour : _Colour,
            OwnerID : _OwnerID
        })
        .select()
    );

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}
//#endregion

export { 
    CreatePersonElement,
    CreatePersonElementWithSelect,
    CreateVehicleElement,
    FetchPeopleByNameOrLPN,
    FetchPeopleByID,
    FetchPerson,
    InsertPerson,
    FetchVehiclesByRego,
    InsertVehicle
};
