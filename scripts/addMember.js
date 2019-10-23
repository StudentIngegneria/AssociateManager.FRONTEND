// Copyright (c) 2019 Zekromaster
//
// GNU AFFERO GENERAL PUBLIC LICENSE
//    Version 3, 19 November 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// Making the "status" field define which fields should be visible and required
new ConditionalField({
  control: '#status_',
  visibility: {
    'student': '#Student_',
    'professionist': '#Professionist_'
  }
});

$( '#status_' ).change( function( sel ) {
  if (sel.target[sel.target.selectedIndex].value == "student") {
    $( '#degreeId' ).prop('required', true);
    $( '#uniNumber' ).prop('required', true);
  } else {
    $( '#degreeId' ).prop('required', false);
    $( '#uniNumber' ).prop('required', false);
  };
});

// This function takes a name and makes the first letter of each word uppercase
function nameSanitize(str) {
  return str.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Async component of the initialization
async function init(){
  let degrees = (await APIService.getDegrees({includeHistorical: false})).data;
  degrees.sort((a,b) => (a.course > b.course)?-1:1)
  let degreeSelection = $("#degreeId");
  // Populating the options with the various degrees
  for (let degree of degrees) {
    degreeSelection.append(
      `<option value="${degree.id}"> ${degree.course} </option> `
    )
  }
  global.latestYearAddMember = await APIService.getLatestYear();
}

init();

// Submission
$('#addMember').submit(function(res){
  res.preventDefault();
  let modal;
  let inputs_ = $('#addMember :input');
  let inputs = {};
  for (let i of inputs_){
    inputs[i.id] = i.value;
  }
  let ok = false;

  let apiInput =  {
    year: global.latestYearAddMember,
    id: parseInt(inputs.membershipId),
    name: nameSanitize(inputs.name),
    surname: nameSanitize(inputs.surname),
    mail: inputs.mail,
    quote: parseInt(inputs.quote)
  };

  if (inputs.status_ == "student") {
    apiInput.uniNumber = inputs.uniNumber;
    apiInput.degreeId = inputs.degreeId;
  } else {
    apiInput.uniNumber = "0";
    delete apiInput.degreeId;
  }

  if (inputs.status_ == "professionist") {
    apiInput.profession = inputs.profession;
  } else {
    apiInput.profession = (inputs.status_ == "phd_student")?"Dottorato":"";
    if (apiInput.profession == "") delete apiInput.profession;
  }

  if (inputs.phone != ""){
    apiInput.phone = inputs.phone;
  }


  APIService.createMember(
    apiInput
  ).then(res => {
    if (res.data.error) {
      if (res.data.error == "duplicate"){
        modal = $("#duplicate_error_modal")
        modal.on('shown.bs.modal', function(e){
          setTimeout(function () {
              document.location.reload()
          }, 5000);
        })
      } else {
        modal = $("#unknown_error_modal")
      }
    } else {
      modal = $("#successful_submit_modal")
      ok = true;
    }
    if (ok) {
      modal.on('shown.bs.modal', function(e){
        setTimeout(function () {
            document.location.reload()
        }, 5000);
      })
    }
    modal.modal({backdrop: false});
  }).catch(e => {
    modal = $("#unknown_error_modal")
    modal.modal({backdrop: false});
  })
})
