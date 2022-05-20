(function(){
    "use strict"

    console.log("script loaded") ; 

    var showBtn = document.getElementsByClassName("show-password-button") ; 
    for(let i = 0 ; i < showBtn.length ; i += 1){
        showBtn[i].addEventListener("click" , function(event){
            event.stopPropagation() ; 
            if(document.getElementsByClassName("reduce-wdith-for-see-password")[i].type == "password"){
                document.getElementsByClassName("reduce-wdith-for-see-password")[i].type = "text" ; 
                showBtn[i].setAttribute("class" , "fas fa-eye-slash show-password-button fa-2x") ; 
            }
            else if(document.getElementsByClassName("reduce-wdith-for-see-password")[i].type == "text"){
                document.getElementsByClassName("reduce-wdith-for-see-password")[i].type = "password" ; 
                showBtn[i].setAttribute("class" , "fas fa-eye fa-2x show-password-button") ; 
            }
        }) ; 
    }
})() ; 