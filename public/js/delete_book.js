/*
  Overall structure - adapted
    Oregon State University, CS340: Introduction to Databases - 'nodejs-starter-app'
    George Kochera, Cortona1, Michael Curry, dmgs11 (2/28/23 - 3/19/23 )
    https://github.com/osu-cs340-ecampus/nodejs-starter-app
  
*/

function deleteBook(bookId) {
    let link = '/delete-book-ajax/';
    let data = {
      id: bookId
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: (result) => {
        
      }

    });

    deleteDropDownMenu(bookId);

  }

$("#book-table").on('click', '.delete', function(e) {
    var whichtr = $(this).closest("tr");

    whichtr.remove();      
});

function deleteDropDownMenu(bookId){
  
  let selectMenu = document.getElementById("select-book");
  
  for (let i = 0; i < selectMenu.length; i++){

    let selectMenuValue = selectMenu.options[i].value
    let valueArray = selectMenuValue.split(",")

    
    if (String(valueArray[0]) === String(bookId)) {

      selectMenu[i].remove();
      
      break;
    } 

  }
}