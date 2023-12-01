

function validateForm(){
     
     var email = document.forms["loginForm"]["email"].value
     var password = document.forms["loginForm"]["password"].value

     var emailError = ""
     var passwordError = ""

     var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

     if (email == "") {
         emailError = "Enter your email"
     } else {
         let res = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/
         if (!res.test(email)) {
             emailError = "Enter a valid Email"
         } else if (res.test(email)) {
             emailError = " "
         }
     }

     if (password == "") {
         passwordError = "Enter your password"
     } else {
         if (password.length <=2) {
             passwordError = "Password Must contain 8 characters"
         } else {
             passwordError = " "
         }
     }

     if (passwordError || emailError) {
         document.getElementById("error-email").innerHTML = emailError
         document.getElementById("error-password").innerHTML = passwordError
         return false
     } else {
         return true
     }
}