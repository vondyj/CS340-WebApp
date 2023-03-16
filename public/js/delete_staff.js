function deleteStaff(staffId) {
    let link = '/delete-staff-ajax/';
    let data = {
      id: staffId
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: (result) => {
        
      }
    
    });

    deleteDropDownMenu(staffId);

  }

$("#staff-table").on('click', '.delete', function(e) {
    var whichtr = $(this).closest("tr");

    whichtr.remove();      
});

function deleteDropDownMenu(staffId){
  
  let selectMenu = document.getElementById("select-staff");
  
  for (let i = 0; i < selectMenu.length; i++){

    let selectMenuValue = selectMenu.options[i].value
    let valueArray = selectMenuValue.split(",")

    
    if (String(valueArray[0]) === String(staffId)) {

      selectMenu[i].remove();
      
      break;
    } 

  }
}