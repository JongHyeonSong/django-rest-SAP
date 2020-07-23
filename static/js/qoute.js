// fetch("https://type.fit/api/quotes")
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(data) {
//     console.log(data[0]);
//   });


function loadRandomQoute(){
    let apiText = null
    let apiAuthor = null

    let text = document.querySelector('.quote-text');
    let author = document.querySelector('.quote-author');

    let random = Math.floor(Math.random()*1000)

    fetch("https://type.fit/api/quotes")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        data = data[random]
        apiText = data['text']
        apiAuthor = data['author']
        text.textContent = apiText;

        if(apiAuthor==null){
            apiAuthor = '작자미상'
        }
        author.textContent = apiAuthor;
        
    });
    
    
    

    console.log(text,author)
}

loadRandomQoute()