/* eslint-env browser */
console.log("# Starting up the application");

function clearTable() {
  $("#myrows").find("tr").remove();
}

function addRow(person) {
  console.log("Adding row");
  $("#myrows").append(
    `
    <tr>
       <td>${person.id}</td>
       <td>${person.name}</td>
       <td>${person.tag}</td>
       <td>${person.age}</td>
    </ tr>
`
  );
}



function formDataAsJSON(formData) {
  let x = {};
  for (var pair of formData.entries()) {
    x[pair[0]] = pair[1];
  }
  return JSON.stringify(x);
}

/* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */


function updatePetsList() {
  fetch(`/persons`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      clearTable();
      data.map(addRow);
    });
}

function startup() {
  updatePetsList();
}

startup();