/*
  Overall structure - adapted
    Oregon State University, CS340: Introduction to Databases - 'nodejs-starter-app'
    George Kochera, Cortona1, Michael Curry, dmgs11 (2/28/23 - 3/19/23 )
    https://github.com/osu-cs340-ecampus/nodejs-starter-app
  
*/

function deleteAuthorBook(authorBookId) {
    let link = '/delete-author-book-ajax/';
    let data = {
      id: authorBookId
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: (result) => {

      }
    
    });


  }

$("#author-book-table").on('click', '.delete', function(e) {
    let whichtr = $(this).closest("tr");

    whichtr.remove();   
});
