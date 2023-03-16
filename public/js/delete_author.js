
function deleteAuthor(authorId) {
    let link = '/delete-author-ajax/';
    let data = {
      id: authorId
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

$("#author-table").on('click', '.delete', function(e) {
    let whichtr = $(this).closest("tr");

    whichtr.remove();      
});

// need to figure out how to update dropdown menu


      
      
