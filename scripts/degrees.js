async function initPage(){
  // Getting the list of degrees
  let degrees = (await APIService.getDegrees({})).data;

  // Generating the table
  let tbody = $("#degreestablebody")
  degrees.sort(function (a, b) {
    return (a.id < b.id)?-1:1;
  })
  for (let degree of degrees){
    tbody.append(
      `<tr>
        <td> ${degree.id} </td>
        <td> ${degree.course} </td>
      </tr>`
    );
  }

  // Button that submits a new degree
  $("#newDegree").submit(
    function (res){
      res.preventDefault();
      let inputs = $('#newDegree :input');
      let data = {
        id: inputs[0].value,
        degree: inputs[1].value,
      }
      APIService.createDegree(data).then(
        res => document.location.reload()
      )
    }
  )
}

initPage()
