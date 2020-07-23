function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
let activeItemPK = null;

buildList()

function buildList() {
    let wrapper = document.querySelector('#list-wrapper');
    wrapper.innerHTML = ''
    let url = `http://127.0.0.1:8000/api/task-list/`;

    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            let list = data;

            list.forEach(todo => {
                let todoItem = document.createElement('div');
                todoItem.innerHTML = `
                <div id="data-row-${todo.id}" class="task-wrapper flex-wrapper">
                    <div style="flex:7">
                        <span class="title">${todo.title}</span>
                    </div>
                    <div>
                        <button class='btn btn-sm btn-outline-info edit'>수정</button>
                    </div>
                    <div>
                        <button class='btn btn-sm btn-outline-dark delete'>삭제</button>
                    </div>
                </div>
            `
                wrapper.appendChild(todoItem)
                
                todoItem.addEventListener('click',function(e){
                    
                if(e.target.classList.contains('edit')){
                    console.log('수정버튼')
                    editItem(todo)
                }
                if(e.target.classList.contains('delete')){
                    console.log('삭제버튼')
                    deleteItem(todo)
                }
                if(e.target.classList.contains('title')){
                    console.log('타이틀버튼')
                    strikeUnstrike(todo)
                }
                })
            });

            // taskWrappers = document.querySelectorAll('.task-wrapper')

            // taskWrappers.forEach(task=>{
            //     task.addEventListener('click', e=>{
            //         if(e.target.classList.contains('edit')){
            //             console.log('수정버튼')
            //             editItem(task)
            //         }
            //         if(e.target.classList.contains('delete')){
            //             console.log('삭제버튼')
            //             deleteItem(task)
            //         }
            //         if(e.target.classList.contains('title')){
            //             console.log('타이틀버튼')
            //             strikeUnstrike(task)
            //         }
            //     })
            // })
            
            

        })
}

let form = document.querySelector('#form-wrapper')

form.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log("제출시작")
    let url = `http://127.0.0.1:8000/api/task-create/`;

    if (activeItemPK!=null){
        console.log("업데이트합니다")
        url = `http://127.0.0.1:8000/api/task-update/${activeItemPK.id}/`;
        activeItemPK=null
    }
    
    let title = document.querySelector('#title').value
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':csrftoken,
            },
            body: JSON.stringify({"title": title})
        })
        .then(response => {
            buildList();
            console.log('생성완료')
            document.querySelector('#title').value =""
            document.querySelector('#submit').classList.remove('create-to-update')
        })

})

//수정 삭제 밑줄
function editItem(todo) {
    activeItemPK = todo
    document.querySelector('#submit').classList.add('create-to-update')
    document.querySelector('#title').value = activeItemPK.title
}

function deleteItem(todo) {
    // title = task.querySelector('.title')
    // deletePK = (task.id.split('-')[2])
    
    fetch(`http://127.0.0.1:8000/api/task-delete/${todo.id}/`,{
        method:"DELETE",
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
    }).then( response =>{
        buildList();
    })
}

function strikeUnstrike(task){
    taskTitle = document.querySelector(`#data-row-${task.id} .title`)

    task.completed = !task.completed
    
    if (task.completed){
        taskTitle.classList.add('span-strike')
    }else{
        taskTitle.classList.remove('span-strike')
    }
    

    fetch(`http://127.0.0.1:8000/api/task-update/${task.id}/`,{
        method:'POST',
        headers:{
            'Content-type':'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'title':task.title, 'completed':task.completed})
    }).then( response =>{
        // buildList()
    })
}
