// This turns a date from yyyymmdd to a Date object
function stDate(std) {
  let year        = std.substring(0,4);
  let month       = std.substring(4,6);
  let day         = std.substring(6,8);

  return new Date(year, month-1, day);
}

// Async initialization
async function initPage(){
  let registrations = (await APIService.getRegistrationSeasons({})).data;
  let tbody = $("#registrationstablebody")
  registrations.sort(function (a, b) {
    return (a.year < b.year)?1:-1;
  })
  for (let registration of registrations){
    tbody.append(
      `<tr>
        <td> ${registration.year} </td>
        <td> ${stDate(registration.opened).toLocaleDateString()} </td>
        <td> ${registration.closed?stDate(registration.closed).toLocaleDateString():"<i>Ancora aperta</i>"} </td>
      </tr>`
    );
  }

  // Button to create a new registration
  $("#newRegistrationSeason").submit(
    function (res){
      res.preventDefault();
      let inputs = $('#newRegistrationSeason :input')[0].value;
      let data = {
        year: parseInt(inputs),
        opening: (new Date()).format("yyyymmdd")
      }
      APIService.createRegistration(data).then(
        res => document.location.reload()
      )
    }
  )
}
1
initPage()
