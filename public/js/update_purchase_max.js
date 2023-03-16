function updateMax() {

    let quantity = document.getElementById("input-quantity");
  
    let select = document.getElementById("select-book")
    let selectValue = select.value
    let myArray = selectValue.split(",")
    
    console.log(myArray[1])

    quantity.value = 0
    quantity.max = Number(myArray[1])
  
  }