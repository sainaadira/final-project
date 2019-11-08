// var thumbUp = document.getElementsByClassName("fa-thumbs-up");
// var thumbDown = document.getElementsByClassName("fa-thumbs-down");
// var trash = document.getElementsByClassName("fas fa-trash");



var signup = document.getElementsByClassName("signup-button");

Array.from(signup).forEach(function(element) {
  element.addEventListener('click', function() {
    const firstname = document.getElementsByName('firstname')[0].value;
    const lastname = document.getElementsByName('lastname')[0].value;
    const pronouns = document.getElementsByName('pronouns')[0].value;
    const email = document.getElementsByName('email')[0].value;
    const password = document.getElementsByName('password')[0].value;
    const city = document.getElementsByName('city')[0].value;
    const state = document.getElementsByName('state')[0].value;


    fetch('signup', {
        // HTTP POST request
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'firstname': firstname,
          'lastname': lastname,
          'pronouns': pronouns,
          'email': email,
          // 'password': password,
          'city': city,
          'state': state
        })
      })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});



// MAIN PAGE
let mainpage = document.getElementById('submit-comment')

  mainpage.addEventListener('click', function(e) {
    // event e should be a parameter
    console.log('comment submit',e )
    e.preventDefault()
    let author= document.getElementsByClassName('author')[0].value
    let comments= document.getElementsByClassName('comments')[0].value
    console.log('author, comments', author,comments)

    fetch('mainpage', {
        // HTTP POST request
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'comments': comments

        })
      })
      // .then(response => {
      //   console.log('json from comments', response)
      //   if (response.ok) return response.json()
      // })
      .then(data => {
        console.log('should reload oage');
        window.location.reload(true)
      })
  });
