document.addEventListener("DOMContentLoaded", function() {
    const list = document.getElementById('list')
    const panel = document.getElementById('show-panel')
    const myUser = { "id": 1, "username": "pouros" }
    fetchBooks()

    //Fetch books
    function fetchBooks(){
        fetch('http://localhost:3000/books')
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            displayBooks(data)
        })

    }

    //Display book list
    function displayBooks(arr){
        arr.forEach(book => {
            const li = document.createElement('li')
            li.innerText = book.title
            list.appendChild(li)

            li.addEventListener('click', () => {
                panel.innerText = ''
                bookDetails(book)
            })
        });
    }

    //Display book details
    function bookDetails(book){
        const thumbnail = document.createElement('img')
        const title = document.createElement('h1')
        const subtitle = document.createElement('h3')
        const author = document.createElement('h3')
        const description = document.createElement('p')
        const ul = document.createElement('ul')
        const btn = document.createElement('button')
        
        thumbnail.src = book.img_url
        title.innerText = book.title
        if (book.subtitle){
            subtitle.innerText = book.subtitle
        }
        author.innerText = book.author
        description.innerText = book.description
        btn.innerText = 'Like'
        btn.id = book.id
        

        panel.appendChild(thumbnail)
        panel.appendChild(title)
        panel.appendChild(subtitle)
        panel.appendChild(author)
        panel.appendChild(description)
        panel.appendChild(ul)

        //console.log(book.users)
        //displayUser(book.users, ul)
        const users = book.users
        users.forEach(user => {
            displayUser(user, ul)
        })

        panel.appendChild(btn)

        btn.addEventListener('click', (e) => {
            if (e.target.innerText === 'Like'){
                displayUser(myUser, ul)
                updateBooks(myUser, book.id, book.users)
                e.target.innerText = 'Un-like'
            }
            else {
                //Delete user on DOM
                const deleteMyUser = document.getElementById(`user-${myUser.id}`)
                deleteMyUser.remove()

                //Delete user from Book on Databasa
                const deleteUser = users.filter(user => user.id != myUser.id)
                removeBookUser(deleteUser, book.id)
                e.target.innerText = 'Like'
            }
        })

    }

    //Display users who like a book
    function displayUser(user, ul){
        //arr.forEach(user => {
            console.log(user)
            const li = document.createElement('li')
            li.innerText = user.username
            li.id = `user-${user.id}`
            ul.appendChild(li)
        //})
    }
    
    //Update Books : add users to a book
    function updateBooks(userObj, id, users){
        fetch(`http://localhost:3000/books/${id}`, {
            method: 'PATCH', 
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(
                {
                    "users": [
                      ... users,
                      userObj
                    ]
                }
            )

        })
        .then(resp => resp.json())
        .then(data => {
            console.log('data:')
            console.log(data)
        })
    }


    //Update Books : remove users from a book
    function removeBookUser(users, id){
        console.log('all users')
        console.log(users)
        fetch(`http://localhost:3000/books/${id}`, {
            method: 'PATCH', 
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(
                {
                    "users": [
                      ... users
                    ]
                }
            )

        })
        .then(resp => resp.json())
        .then(data => {
            console.log('data:')
            console.log(data)
        })
    }
  

});
