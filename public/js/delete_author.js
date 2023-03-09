
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
        location.reload(true);
      }
    
    });

    location.reload(true);

  }



      
      
