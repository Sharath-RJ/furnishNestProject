

// function validateSignupForm(){

//      // Get the values from the form
//      var firstName = document.forms["Signup_Form"]["firstName"].value
//      var lastName = document.forms["Signup_Form"]["lastName"].value
//      var email = document.forms["Signup_Form"]["email"].value
//      var phone = document.forms["Signup_Form"]["phone"].value
//      var c_password = document.forms["Signup_Form"]["confirmpassword"].value
//      var password = document.forms["Signup_Form"]["password"].value

//      // Regular expression for email validation
//      var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
//      var phonePattern = /^\d{10}$/

//      // Error message variables
//      var firstNameError = ""
//      var emailError = ""
//      var passwordError = ""
//      var lastNameError = ""
//      var confirmpasswordError = ""
//      var passwordError = ""
//      var phoneError = ""

//      if (firstName == "") {
//          firstNameError = "Enter your first name"
//      } else {
//          if (firstName.length <= 3) {
//              firstNameError = "Name must contain more than 3 character"
//          } else if (/[a-z]/.test(firstName[0])) {
//              firstNameError = "First letter must be Capital"
//          } else if (/[0-9]/.test(firstName)) {
//              firstNameError = "Avoid Number from Name"
//          } else {
//              firstNameError = " "
//          }
//      }

//      if (lastName == "") {
//          lastNameError = "Enter your last name"
//      } else {
//          if (/[a-z]/.test(firstName[0])) {
//              lastNameError = "First letter must be Capital"
//          } else if (/[0-9]/.test(firstName)) {
//              lastNameError = "Avoid Number from last Name"
//          } else {
//              lastNameError = " "
//          }
//      }

//      if (phone == "") {
//          phoneError = "Enter your mobile number"
//      } else {
//          if (phone.length < 10) {
//              phoneError = "Number must contain 10  digits"
//          } else if (/[a-zA-Z]/.test(phone)) {
//              phoneError = "Avoid letter from Number"
//          } else {
//              phoneError = " "
//          }
//      }

//      if (password == "") {
//          passwordError = "Enter your password"
//      } else {
//          if (password.length <= 8) {
//              passwordError = "Password Must contain 8 characters"
//          } else {
//              passwordError = " "
//          }
//      }

//      if (email == "") {
//          emailError = "Enter your email"
//      } else {
//          let res = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)(.[a-z]+)?$/
//          if (!res.test(email)) {
//              emailError = "Enter a valid Email"
//          } else if (res.test(email)) {
//              emailError = " "
//          }
//      }
//      if (c_password != password) {
//          confirmpasswordError = "Password Not Matching"
//      }

//      if (
//          emailError ||
//          passwordError ||
//          firstNameError ||
//          phoneError ||
//          lastNameError ||
//          confirmpasswordError
//      ) {
//          document.getElementById("email-error").innerHTML = emailError
//          document.getElementById("password-error").innerHTML = passwordError
//          document.getElementById("firstName-error").innerHTML = firstNameError
//          document.getElementById("phone-error").innerHTML = phoneError
//          document.getElementById("lastName-error").innerHTML = lastNameError
//          document.getElementById("confirmpassword-error").innerHTML =
//              confirmpasswordError

//          return false
//      } else {
//          return true
//      }

// }

//  $(document).ready(function () {
//      $("#signupForm").submit(function (event) {
//          event.preventDefault() // Prevent the default form submission

//          // Get the values from the form
//          var firstName = $("#firstName").val()
//          var lastName = $("#lastName").val()
//          var phone = $("#phone").val()
//          var email = $("#email").val()
//          var password = $("#password").val()
//          var confirmPassword = $("#confirmPassword").val()

//          // Regular expressions for validation
//          var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
//          var phonePattern = /^\d{10}$/
//          var passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

//          // Error messages
//          var firstNameError = ""
//          var lastNameError = ""
//          var phoneError = ""
//          var emailError = ""
//          var passwordError = ""
//          var confirmPasswordError = ""

//          // Validate first name
//          if (firstName == "") {
//              firstNameError = "Enter your first name"
//          }

//          // Validate last name
//          if (lastName == "") {
//              lastNameError = "Enter your last name"
//          }

//          // Validate phone
//          if (phone == "") {
//              phoneError = "Enter your mobile number"
//          } else if (!phonePattern.test(phone)) {
//              phoneError = "Invalid phone number"
//          }else phoneError=""

//          // Validate email
//          if (email == "") {
//              emailError = "Enter your email"
//          } else if (!emailPattern.test(email)) {
//              emailError = "Enter a valid email address"
//          }else emailError=" "

//          // Validate password
//          if (password == "") {
//              passwordError = "Enter your password"
//          } else if (password.length<=8) {
//              passwordError =
//                  "Password must contain at least 8 characters"
//          }else passwordError=" "

//          // Validate confirm password
//          if (confirmPassword == "") {
//              confirmPasswordError = "Confirm your password"
//          } else if (confirmPassword !== password) {
//              confirmPasswordError = "Passwords do not match"
//          }else confirmPasswordError=" "

//          // Display error messages or submit the form
//          $("#firstNameError").text(firstNameError)
//          $("#lastNameError").text(lastNameError)
//          $("#phoneError").text(phoneError)
//          $("#emailError").text(emailError)
//          $("#passwordError").text(passwordError)
//          $("#confirmPasswordError").text(confirmPasswordError)

//          if (
//              firstNameError ||
//              lastNameError ||
//              phoneError ||
//              emailError ||
//              passwordError ||
//              confirmPasswordError
//          ) {
//              return false // There are validation errors, do not submit the form
//          } else {
//              // Form is valid, you can submit it here or redirect to another page
//              return true
//          }
//      })
//  })


 


    
        $(document).ready(function () {
            $("#signupForm").submit(function (event) {
                event.preventDefault() // Prevent the default form submission

                // Get the values from the form
                var firstName = $("#firstName").val()
                var lastName = $("#lastName").val()
                var phone = $("#phone").val()
                var email = $("#email").val()
                var password = $("#password").val()
                var confirmPassword = $("#confirmPassword").val()

                // Regular expressions for email and password validation
                var emailPattern =
                     /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


                // Error messages
                var firstNameError = ""
                      var lastNameError = ""
                          var phoneError = ""
                          var emailError = ""
                          var passwordError = ""
                        var confirmPasswordError = ""

                // Validate email
                // if (!emailPattern.test(email)) {
                //     emailError = "Enter a valid email address"
                // }

                // Validate password
                if (password.length <= 8) {
                    passwordError =
                        "Password must contain at least 8 characters,"
                }else passwordError=" "

                // Display error messages or submit the form
                if (emailError || passwordError) {
                    $("#emailError").text(emailError)
                    $("#passwordError").text(passwordError)
                } else {
                    // Form is valid, you can submit it here or redirect to another page
                    $("#emailError").text("")
                    $("#passwordError").text("")
                    // Uncomment the following line to submit the form
                    $("#loginForm").unbind("submit").submit()
                }
            })
        });
    


