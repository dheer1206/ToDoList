window.onload = function () {

    window.list = this.document.getElementById("task-list") ;
    window.task_input = this.document.getElementById("task-input") ;
    window.add_task = this.document.getElementById("add-task") ;
    window.remctask = this.document.getElementById("remove-c-tasks") ;
    window.sortTasks = this.document.getElementById("sort-tasks") ;

    let list_array = [] ;
    let counter = -1 ;

    task_input.focus() ;

    // Getting Data
    $.get( "/getdata" , function ( data, status ) {
       list_array = JSON.parse( data.name ) ;
       counter = list_array.length - 1 ;
       reload_list() ;
    } ) ;

    // Local storage - get
    // if (localStorage.getItem('list-tasks') !== null) {
    //     list_array = JSON.parse( localStorage.getItem('list-tasks') ) ;
    //     counter = list_array.length - 1 ;
    //     reload_list() ;
    // }

    document.onkeydown = function (e) {
        e = e || window.event;
        switch (e.which || e.keyCode) {
              case 13 : 
                add_task.click() ;
                  break;
        }
      }

    function reload_list () {

        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
  
        for (i = 0 ; i < list_array.length ; i++)
        {
          list_array[i].id = i ;
          create_li(list_array[i] , 1) ;
        }
        task_input.focus() ;
        
        // Posting or Sending or Saving data
        $.post( "/postdata" , { name :  JSON.stringify(list_array) } , function ( data , status ) {
            //console.log( " Data Sent Successdully..." ) ;
        } ) ;

        // Local storage - post
       // localStorage.setItem( "list-tasks" , JSON.stringify(list_array)) ;

    }


    function Create_task ( task_name , task_id ) {

        this.name = task_name ;
        this.checked = false ;
        this.id = task_id ;

        this.change_checked = function() {
           this.checked = ( (this.checked) != true ) ;
        }

    }

    function create_li ( list_obj , type ) {

        let listitem = document.createElement('li') ;
        listitem.className = "list-group-item" ;
        listitem.setAttribute( 'item-id' , list_obj.id ) ;

        let inp_group = document.createElement('div') ;
        inp_group.className = "input-group" ;

        let label = document.createElement('label') ;
        label.className = "task_head" ;
        if (list_obj.checked == true) {
            label.innerHTML = "<input type = 'checkbox' class = 'checkmark' style='font-size: 30px' checked>" ;
            label.innerHTML += "  " + list_obj.name.strike() ;
        }else {
            label.innerHTML += "<input type = 'checkbox' class = 'checkmark' style='font-size: 30px'>" ;
            label.innerHTML += "  " + list_obj.name ;
        }

        let inp_group_append = document.createElement('div') ;
        inp_group_append.className = "input-group-append" ;
        inp_group_append.style = "margin-left:auto; margin-right:0px;" ;

        let btn_group = document.createElement('div') ;
        btn_group.className = "btn-group" ;

        let btnUp = document.createElement('button') ;
        btnUp.className = "btn btn-btn-primary btn-blue" ;
        btnUp.type = "button" ;
        btnUp.innerHTML = "<i class='fas fa-arrow-alt-circle-up' style='font-size:30px;'></i>"

        let btnDown = document.createElement('button') ;
        btnDown.className = "btn btn-btn-primary btn-blue" ;
        btnDown.type = "button" ;
        btnDown.innerHTML = "<i class='fas fa-arrow-alt-circle-down' style='font-size:30px;'></i>"

        let btnRem = document.createElement('button') ;
        btnRem.className = "btn btn-btn-primary btn-red" ;
        btnRem.type = "button" ;
        btnRem.innerHTML = "<i class='fas fa-minus-circle' style='font-size:30px;'></i>"

        if (list_obj.id > 0) {
            btn_group.appendChild(btnUp) ;
        } 
        if (list_obj.id < counter) {
            btn_group.appendChild(btnDown) ;
        }
        btn_group.appendChild(btnRem) ;

        inp_group_append.appendChild(btn_group) ;

        inp_group.appendChild(label) ;
        inp_group.appendChild(inp_group_append) ;

        listitem.appendChild(inp_group) ;


        //Add the onclick listeners 

        label.onclick = function (event) {
           
            let temp = event.target.parentElement ;
            if (temp.className == "task_head"){
                //console.log("in") ;
                while ( temp.className != "list-group-item") {
                    temp = temp.parentElement ;
                }
                let index = temp.getAttribute('item-id') ;
                list_array[index].checked = !(list_obj.checked) ;
               // console.log(list_array) ;
                reload_list() ;
            }
        }

        btnUp.onclick = function (event) {
            let temp = event.target ;
            while ( temp.className != "list-group-item") {
                temp = temp.parentElement ;
            }
            let index = temp.getAttribute('item-id') ;

            for (i = 0 ; i < list_array.length ; i++ ) {
                if ( i == index ) {
                  //swap
                  let temp = list_array[i] ;
                  list_array[i] = list_array[i-1] ;
                  list_array[i-1] = temp ;
      
                  break ;
                }
              }

              reload_list() ;

        }

        btnDown.onclick = function (event) {
            let temp = event.target ;
            while ( temp.className != "list-group-item") {
                temp = temp.parentElement ;
            }
            let index = temp.getAttribute('item-id') ;

            for (i = 0 ; i < list_array.length ; i++ ) {
                if ( i == index ) {
                  //swap
                  let temp = list_array[i] ;
                  list_array[i] = list_array[i+1] ;
                  list_array[i+1] = temp ;
      
                  break ;
                }
              }
            reload_list()
        }

        btnRem.onclick = function (event) {
            let temp = event.target ;
            while ( temp.className != "list-group-item") {
                temp = temp.parentElement ;
            }
            let index = temp.getAttribute('item-id') ;
            //console.log( index ) ;
            list_array.splice( index , 1 ) ;
            counter-- ;
            //console.log(counter) ;
            reload_list() ;
        }

        if (type == 0) {
            list_array.push( list_obj ) ;
            reload_list() ;
        }else {
            list.appendChild(listitem) ;
        }
        

    }
    add_task.onclick = function () {
        let task_name = task_input.value ;
        if (task_name == "" ) {
            task_input.focus() ;
            return ;
        }
        task_input.value = "" ;
        counter++ ;
        let list_obj = new Create_task(task_name , counter) ;

        create_li(list_obj , 0) ;
        
        task_input.focus() ;

    }

    remctask.onclick = function () {
        
        let comp_index = [] ;

        for (i = 0 ; i < list_array.length ; i++) {
            if ( list_array[i].checked == true ) {
                comp_index.push(i) ;
            }
        }

        for (i = comp_index.length - 1 ; i >= 0 ; i--) {

            list_array.splice( comp_index[i] , 1 ) ;
            counter-- ;
        }

        reload_list() ;

    }

    sortTasks.onclick = function () {
        let comp_index = [] ;
        let comp_elements = [] ;

        for (i = 0 ; i < list_array.length ; i++) {
            if ( list_array[i].checked == true ) {
                comp_index.push(i) ;
                comp_elements.push( list_array[i] ) ;
            }
        }

        for (i = comp_index.length - 1 ; i >= 0 ; i--) {

            list_array.splice( comp_index[i] , 1 ) ;
            counter-- ;
        }

        for ( i = 0 ; i < comp_elements.length ; i++) {
            list_array.push( comp_elements[i] ) ;
            counter++ ;
        }
        reload_list() ;
    }

}