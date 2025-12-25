// ==UserScript==
// @name          APM Book Times ALT+4 Editable
// @namespace     https://phonetool.amazon.com/users/kanataza
// @version       1.5
// @description   Book times with configurable names and hours (separated by '/', decimals with comma or dot)
// @author        kanataza
// @match         https://eu1.eam.hxgnsmartcloud.com/*
// @match         https://us1.eam.hxgnsmartcloud.com/*
// @icon          https://media.licdn.com/dms/image/v2/D4E03AQEkSQG-ayth3g/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1730057709648?e=2147483647&v=beta&t=C7VGPq9vEfeuAcJa6aO7eBLN8GDKcR5c70l1ABnA3DU
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @require       https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @grant         GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const $ = jQuery.noConflict(true);

    const DEFAULT_HOURS = ["0.1", "0.25", "0.5", "0.75", "1", "1.25", "1.5", "2", "2.5", "3"];

    function getSavedNames() {
        const data = localStorage.getItem("customNames");
        return data ? JSON.parse(data) : null;
    }

    function getSavedHours() {
        const data = localStorage.getItem("customHours");
        return data ? JSON.parse(data) : DEFAULT_HOURS;
    }

    function saveNames(namesArray) {
        localStorage.setItem("customNames", JSON.stringify(namesArray));
    }

    function saveHours(hoursArray) {
        localStorage.setItem("customHours", JSON.stringify(hoursArray));
    }

    function showEditModal() {
        const currentNames = getSavedNames() || [];
        const currentHours = getSavedHours();

        const editModal = `
            <div id="edit-modal" style="position:fixed; top:20%; left:20%; width:60%; background:white; border:1px solid black; padding:20px; z-index:10000;">
                <h3>Edit Names and Hours</h3>
                <label>Names/Logins (separated by slash '/'):</label><br>
                <textarea id="edit-names" style="width:100%; height:60px;">${currentNames.join(" / ")}</textarea><br><br>
                <label>Hours of Work (separated by slash '/', decimals with comma or dot):</label><br>
                <textarea id="edit-hours" style="width:100%; height:40px;">${currentHours.join(" / ")}</textarea><br><br>
                <button id="save-edit">Save</button>
                <button id="cancel-edit">Cancel</button>
            </div>
        `;
        $("body").append(editModal);

        $("#save-edit").click(() => {
            const names = $("#edit-names").val().split("/").map(s => s.trim()).filter(Boolean);
            const hours = $("#edit-hours").val().split("/").map(s => s.trim()).filter(Boolean);
            saveNames(names);
            saveHours(hours);
            $("#edit-modal").remove();
            alert("Saved! Press ALT+4 to reload.");
        });

        $("#cancel-edit").click(() => {
            $("#edit-modal").remove();
        });
    }

    function showModalDialog() {
        const names = getSavedNames();
        if (!names || names.length === 0) {
            alert("Please configure names.");
            showEditModal();
            return;
        }

        const storedEmployee = localStorage.getItem('lastSelectedEmployee') || names[0];
        const storedHrswork = localStorage.getItem('lastSelectedHrswork') || '1,0';
        const storedDatework = localStorage.getItem('lastSelectedDatework') || '';
        const storedOctype = localStorage.getItem('lastSelectedOctype') || 'N';
        const hoursList = getSavedHours();

        let nameOptions = names.map(n => `<option value="${n}">${n}</option>`).join('');
        let hourOptions = hoursList.map(h => `<option value="${h}">${h}</option>`).join('');

        const modalContent = `
            <div id="modal-dialog" style="position: fixed; top: 50%; left: 20%; background-color: white; padding: 20px; border: 1px solid black; z-index: 9999;">
                <h2>Select Options</h2>
                <label for="employee-select">Employee:</label>
                <select id="employee-select">${nameOptions}</select><br><br>

                <label for="hrswork-select">Hours of Work:</label>
                <select id="hrswork-select">${hourOptions}</select><br><br>

                <label for="datework">Date of Work:</label>
                <input type="text" id="datework" name="datework" class="uxdate" style="width: 150px;"><br><br>

                <label for="octype-select">Hour Type:</label>
                <select id="octype-select">
                    <option value="N">Normal</option>
                    <option value="O">Overtime</option>
                </select><br><br>

                <button id="submit-button">Submit</button>
                <button id="edit-button">Edit Names & Hours</button>
                <button id="close-button">Close</button>
            </div>
        `;

        $("body").append(modalContent);
        $("#modal-dialog").draggable();

        $('#employee-select').val(names.includes(storedEmployee) ? storedEmployee : names[0]);
        $('#hrswork-select').val(hoursList.includes(storedHrswork) ? storedHrswork : hoursList[0]);
        $('#datework').val(storedDatework);
        $('#octype-select').val(storedOctype);

        if (storedDatework === '') {
            fillDatework();
        }

        $("#submit-button").click(() => submitForm());
        $("#close-button").click(() => $("#modal-dialog").remove());
        $("#edit-button").click(() => {
            $("#modal-dialog").remove();
            showEditModal();
        });
    }

    function fillDatework() {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = monthNames[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        const formattedDate = (day < 10 ? '0' : '') + day + "-" + month + "-" + year;

        let dateworkField = $("#modal-dialog input[name='datework']");
        if (dateworkField.length === 0) {
            dateworkField = $("input[name='datework']");
        }

        if (dateworkField.length > 0) {
            dateworkField.val(formattedDate);
            dateworkField.trigger('change');
        }
    }

    function fillFields(selectedEmployee, selectedHrswork, selectedOctype) {
        $("input[name='employee']").val(selectedEmployee);
        $("input[name='hrswork']").val(selectedHrswork);
        $("input[name='octype']").val(selectedOctype);
    }

    function submitForm() {
        const selectedEmployee = $("#employee-select").val();
        const selectedHrswork = $("#hrswork-select").val();
        const selectedOctype = $("#octype-select").val();
        const selectedDate = $("#datework").val();

        fillFields(selectedEmployee, selectedHrswork, selectedOctype);

        localStorage.setItem('lastSelectedEmployee', selectedEmployee);
        localStorage.setItem('lastSelectedHrswork', selectedHrswork);
        localStorage.setItem('lastSelectedOctype', selectedOctype);
        localStorage.setItem('lastSelectedDatework', selectedDate);

        $("#modal-dialog").remove();
    }

    function fillTimeFunction() {
        if (typeof Ext === 'undefined' || !Ext.ComponentQuery) {
            console.warn("ExtJS or Ext.ComponentQuery not found. Automatic filling may be limited.");
            return;
        }

        const hrswork = Ext.ComponentQuery.query('[name="hrswork"]')[0];
        const employee = Ext.ComponentQuery.query('[name="employee"]')[0];
        const octype = Ext.ComponentQuery.query('[name="octype"]')[0];
        const datework = Ext.ComponentQuery.query('[name="datework"]')[0];
        const booactivity = Ext.ComponentQuery.query('[name="booactivity"]')[0];

        if (!hrswork || !employee || !octype || !datework || !booactivity) {
            console.error("One or more fields (hrswork, employee, octype, datework, booactivity) were not found.");
            return;
        }

        if (!booactivity.getValue() && booactivity.store && booactivity.store.data.length > 0) {
            let lastRecord = booactivity.store.data.last();
            booactivity.setValue(lastRecord);
            booactivity.fireEvent('select', booactivity, lastRecord.data.display, null, true);
        }

        if (!octype.getValue()) {
            octype.setValue('N');
        }
        if (!datework.getValue()) {
            datework.setValue(new Date().toISOString().split('T')[0]);
        }

        console.log("Time filling executed successfully!");
    }

    $(document).keydown(function(event) {
        if (event.altKey && event.which === 52) {
            event.preventDefault();
            if ($("#modal-dialog").length === 0) {
                showModalDialog();
            }
            fillTimeFunction();
        }
        if (event.which === 13 && $("#modal-dialog").length > 0) {
            event.preventDefault();
            submitForm();
        }
    });

    fillDatework();
    setInterval(fillDatework, 60 * 60 * 1000);
})();