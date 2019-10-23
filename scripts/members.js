// This function fetches the memberships
async function fetchData(){
  // The first parameter of this route is {year}
  let members = (await APIService.getMemberships({year: global.routeData.params.params[0]})).data;
  return {members};
}

// This calculates the career of a member, then calls callback()
async function calculateCareer(member, callback){
  let career;
  if (member.degreeId != "") {
    let carName = (await APIService.getDegree({id: member.degreeId})).data.course;
    career = `${member.degreeId} ~ ${carName}`;
  } else {
    if (member.profession){
      career = `${member.profession}`;
    } else {
      career = `???`
    }
  }
  callback(career)
}

async function initPage() {
  let members = (await fetchData()).members;
  let tbody = $('#memberTableBody');
  $("#membershipsHeader").text(`Tesseramento ${global.routeData.params.params[0]}`)
  $("#membershipQuantity").text(members.length.toString())
  for (let member of members){
    let careerId = `${member.year}_${member.membershipNumber}_career`;
    let buttonId = `dyn_delete_${member.membershipNumber}_${member.name}`;

    tbody.append(
      `<tr>
        <td> <button class="btn fas fa-trash-alt" id="${buttonId}"> </button> </td>
        <td> ${member.membershipNumber} </td>
        <td> ${member.year} </td>
        <td> ${member.name} ${member.surname} </td>
        <td> <span id="${careerId}">... Loading</span> </td>
        <td> ${member.mail} </td>
        <td> <span class="fas fa-file-download"> </td>
      </tr>`
    );

    calculateCareer(member, function(career){
      $(`#${careerId}`).text(career);
    })

    $(`#${buttonId}`).click(function(){
      $("#deleteHeader").text(`Eliminazione di ${member.name} ${member.surname}`);
      $("#deleteBody").text(`Eliminare ${member.name} ${member.surname} (Tessera ${member.membershipNumber})`);
      $("#confirmDelete").data({id: member.membershipNumber, year: member.year});
      $("#delete_modal").modal();
    })
  }

  $("#confirmDelete").click(
    function(){
      let member = {
        year: $("#confirmDelete").data("year"),
        id: $("#confirmDelete").data("id"),
      }
      APIService.deleteMember(member).then(
        () => document.location.reload()
      )
    }
  )
}

initPage();
