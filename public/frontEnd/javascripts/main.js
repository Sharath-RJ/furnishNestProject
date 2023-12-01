;(function ($) {
    "use strict"
    // Page loading
    $(window).on("load", function () {
        $("#preloader-active").delay(450).fadeOut("slow")
        $("body").delay(450).css({
            overflow: "visible",
        })
        $("#onloadModal").modal("show")
    })
    /*-----------------
        Menu Stick
    -----------------*/
    var header = $(".sticky-bar")
    var win = $(window)
    win.on("scroll", function () {
        var scroll = win.scrollTop()
        if (scroll < 200) {
            header.removeClass("stick")
            $(".header-style-2 .categori-dropdown-active-large").removeClass(
                "open"
            )
            $(".header-style-2 .categori-button-active").removeClass("open")
        } else {
            header.addClass("stick")
        }
    })
    /*------ ScrollUp -------- */
    $.scrollUp({
        scrollText: '<i class="fi-rs-arrow-up"></i>',
        easingType: "linear",
        scrollSpeed: 900,
        animation: "fade",
    })
    /*------ Wow Active ----*/
    new WOW().init()
    //sidebar sticky
    if ($(".sticky-sidebar").length) {
        $(".sticky-sidebar").theiaStickySidebar()
    }
    // Slider Range JS
    if ($("#slider-range").length) {
        $("#slider-range").slider({
            range: true,
            min: 0,
            max: 500,
            values: [130, 250],
            slide: function (event, ui) {
                $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1])
            },
        })
        $("#amount").val(
            "$" +
                $("#slider-range").slider("values", 0) +
                " - $" +
                $("#slider-range").slider("values", 1)
        )
    }
    /*------ Hero slider 1 ----*/
    $(".hero-slider-1").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        loop: true,
        dots: true,
        arrows: true,
        prevArrow:
            '<span class="slider-btn slider-prev"><i class="fi-rs-angle-left"></i></span>',
        nextArrow:
            '<span class="slider-btn slider-next"><i class="fi-rs-angle-right"></i></span>',
        appendArrows: ".hero-slider-1-arrow",
        autoplay: true,
    })
    /*Carausel 6 columns*/
    $(".carausel-6-columns").each(function (key, item) {
        var id = $(this).attr("id")
        var sliderID = "#" + id
        var appendArrowsClassName = "#" + id + "-arrows"
        $(sliderID).slick({
            dots: false,
            infinite: true,
            speed: 1000,
            arrows: true,
            autoplay: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            loop: true,
            adaptiveHeight: true,
            responsive: [
                {
                    breakpoint: 1025,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
            prevArrow:
                '<span class="slider-btn slider-prev"><i class="fi-rs-angle-left"></i></span>',
            nextArrow:
                '<span class="slider-btn slider-next"><i class="fi-rs-angle-right"></i></span>',
            appendArrows: appendArrowsClassName,
        })
    })
    /*Carausel 4 columns*/
    $(".carausel-4-columns").each(function (key, item) {
        var id = $(this).attr("id")
        var sliderID = "#" + id
        var appendArrowsClassName = "#" + id + "-arrows"
        $(sliderID).slick({
            dots: false,
            infinite: true,
            speed: 1000,
            arrows: true,
            autoplay: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            loop: true,
            adaptiveHeight: true,
            responsive: [
                {
                    breakpoint: 1025,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
            prevArrow:
                '<span class="slider-btn slider-prev"><i class="fi-rs-angle-left"></i></span>',
            nextArrow:
                '<span class="slider-btn slider-next"><i class="fi-rs-angle-right"></i></span>',
            appendArrows: appendArrowsClassName,
        })
    })
    /*Fix Bootstrap 5 tab & slick slider*/
    $('button[data-bs-toggle="tab"]').on("shown.bs.tab", function (e) {
        $(".carausel-4-columns").slick("setPosition")
    })
    /*------ Timer Countdown ----*/
    $("[data-countdown]").each(function () {
        var $this = $(this),
            finalDate = $(this).data("countdown")
        $this.countdown(finalDate, function (event) {
            $(this).html(
                event.strftime(
                    "" +
                        '<span class="countdown-section"><span class="countdown-amount hover-up">%d</span><span class="countdown-period"> days </span></span>' +
                        '<span class="countdown-section"><span class="countdown-amount hover-up">%H</span><span class="countdown-period"> hours </span></span>' +
                        '<span class="countdown-section"><span class="countdown-amount hover-up">%M</span><span class="countdown-period"> mins </span></span>' +
                        '<span class="countdown-section"><span class="countdown-amount hover-up">%S</span><span class="countdown-period"> sec </span></span>'
                )
            )
        })
    })
    /*------ Product slider active 1 ----*/
    $(".product-slider-active-1").slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        fade: false,
        loop: true,
        dots: false,
        arrows: true,
        prevArrow:
            '<span class="pro-icon-1-prev"><i class="fi-rs-angle-small-left"></i></span>',
        nextArrow:
            '<span class="pro-icon-1-next"><i class="fi-rs-angle-small-right"></i></span>',
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    })
    /*------ Testimonial active 1 ----*/
    $(".testimonial-active-1").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        fade: false,
        loop: true,
        dots: false,
        arrows: true,
        prevArrow:
            '<span class="pro-icon-1-prev"><i class="fi-rs-angle-small-left"></i></span>',
        nextArrow:
            '<span class="pro-icon-1-next"><i class="fi-rs-angle-small-right"></i></span>',
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    })
    /*------ Testimonial active 3 ----*/
    $(".testimonial-active-3").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        fade: false,
        loop: true,
        dots: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    })
    /*------ Categories slider 1 ----*/
    $(".categories-slider-1").slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        fade: false,
        loop: true,
        dots: false,
        arrows: false,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    })
    /*----------------------------
        Category toggle function
    ------------------------------*/
    var searchToggle = $(".categori-button-active")
    searchToggle.on("click", function (e) {
        e.preventDefault()
        if ($(this).hasClass("open")) {
            $(this).removeClass("open")
            $(this)
                .siblings(".categori-dropdown-active-large")
                .removeClass("open")
        } else {
            $(this).addClass("open")
            $(this).siblings(".categori-dropdown-active-large").addClass("open")
        }
    })
    /*---------------------
        Price range
    --------------------- */
    var sliderrange = $("#slider-range")
    var amountprice = $("#amount")
    $(function () {
        sliderrange.slider({
            range: true,
            min: 16,
            max: 400,
            values: [0, 300],
            slide: function (event, ui) {
                amountprice.val("$" + ui.values[0] + " - $" + ui.values[1])
            },
        })
        amountprice.val(
            "$" +
                sliderrange.slider("values", 0) +
                " - $" +
                sliderrange.slider("values", 1)
        )
    })
    /*-------------------------------
        Sort by active
    -----------------------------------*/
    if ($(".sort-by-product-area").length) {
        var $body = $("body"),
            $cartWrap = $(".sort-by-product-area"),
            $cartContent = $cartWrap.find(".sort-by-dropdown")
        $cartWrap.on("click", ".sort-by-product-wrap", function (e) {
            e.preventDefault()
            var $this = $(this)
            if (!$this.parent().hasClass("show")) {
                $this
                    .siblings(".sort-by-dropdown")
                    .addClass("show")
                    .parent()
                    .addClass("show")
            } else {
                $this
                    .siblings(".sort-by-dropdown")
                    .removeClass("show")
                    .parent()
                    .removeClass("show")
            }
        })
        /*Close When Click Outside*/
        $body.on("click", function (e) {
            var $target = e.target
            if (
                !$($target).is(".sort-by-product-area") &&
                !$($target).parents().is(".sort-by-product-area") &&
                $cartWrap.hasClass("show")
            ) {
                $cartWrap.removeClass("show")
                $cartContent.removeClass("show")
            }
        })
    }
    /*-----------------------
        Shop filter active
    ------------------------- */
    $(".shop-filter-toogle").on("click", function (e) {
        e.preventDefault()
        $(".shop-product-fillter-header").slideToggle()
    })
    var shopFiltericon = $(".shop-filter-toogle")
    shopFiltericon.on("click", function () {
        $(".shop-filter-toogle").toggleClass("active")
    })
    /*-------------------------------------
        Product details big image slider
    ---------------------------------------*/
    $(".pro-dec-big-img-slider").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        draggable: false,
        fade: false,
        asNavFor: ".product-dec-slider-small , .product-dec-slider-small-2",
    })
    /*---------------------------------------
        Product details small image slider
    -----------------------------------------*/
    $(".product-dec-slider-small").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: ".pro-dec-big-img-slider",
        dots: false,
        focusOnSelect: true,
        fade: false,
        arrows: false,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    })
    /*-----------------------
        Magnific Popup
    ------------------------*/
    $(".img-popup").magnificPopup({
        type: "image",
        gallery: {
            enabled: true,
        },
    })
    $(".btn-close").on("click", function (e) {
        $(".zoomContainer").remove()
    })
    $("#quickViewModal").on("show.bs.modal", function (e) {
        $(document).click(function (e) {
            var modalDialog = $(".modal-dialog")
            if (
                !modalDialog.is(e.target) &&
                modalDialog.has(e.target).length === 0
            ) {
                $(".zoomContainer").remove()
            }
        })
    })
    /*---------------------
        Select active
    --------------------- */
    $(".select-active").select2()
    /*--- Checkout toggle function ----*/
    $(".checkout-click1").on("click", function (e) {
        e.preventDefault()
        $(".checkout-login-info").slideToggle(900)
    })
    /*--- Checkout toggle function ----*/
    $(".checkout-click3").on("click", function (e) {
        e.preventDefault()
        $(".checkout-login-info3").slideToggle(1000)
    })
    /*-------------------------
        Create an account toggle
    --------------------------*/
    $(".checkout-toggle2").on("click", function () {
        $(".open-toggle2").slideToggle(1000)
    })
    $(".checkout-toggle").on("click", function () {
        $(".open-toggle").slideToggle(1000)
    })
    /*-------------------------------------
        Checkout paymentMethod function
    ---------------------------------------*/
    // paymentMethodChanged();
    // function paymentMethodChanged() {
    // 	var $order_review = $( '.payment-method' );
    // 	$order_review.on( 'click', 'input[name="payment_method"]', function() {
    // 		var selectedClass = 'payment-selected';
    // 		var parent = $( this ).parents( '.sin-payment' ).first();
    // 		parent.addClass( selectedClass ).siblings().removeClass( selectedClass );
    // 	} );
    // }
    /*---- CounterUp ----*/
    $(".count").counterUp({
        delay: 10,
        time: 2000,
    })
    // Isotope active
    $(".grid").imagesLoaded(function () {
        // init Isotope
        var $grid = $(".grid").isotope({
            itemSelector: ".grid-item",
            percentPosition: true,
            layoutMode: "masonry",
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: ".grid-item",
            },
        })
    })
    /*====== SidebarSearch ======*/
    function sidebarSearch() {
        var searchTrigger = $(".search-active"),
            endTriggersearch = $(".search-close"),
            container = $(".main-search-active")
        searchTrigger.on("click", function (e) {
            e.preventDefault()
            container.addClass("search-visible")
        })
        endTriggersearch.on("click", function () {
            container.removeClass("search-visible")
        })
    }
    sidebarSearch()
    /*====== Sidebar menu Active ======*/
    function mobileHeaderActive() {
        var navbarTrigger = $(".burger-icon"),
            endTrigger = $(".mobile-menu-close"),
            container = $(".mobile-header-active"),
            wrapper4 = $("body")
        wrapper4.prepend('<div class="body-overlay-1"></div>')
        navbarTrigger.on("click", function (e) {
            e.preventDefault()
            container.addClass("sidebar-visible")
            wrapper4.addClass("mobile-menu-active")
        })
        endTrigger.on("click", function () {
            container.removeClass("sidebar-visible")
            wrapper4.removeClass("mobile-menu-active")
        })
        $(".body-overlay-1").on("click", function () {
            container.removeClass("sidebar-visible")
            wrapper4.removeClass("mobile-menu-active")
        })
    }
    mobileHeaderActive()
    /*---------------------
        Mobile menu active
    ------------------------ */
    var $offCanvasNav = $(".mobile-menu"),
        $offCanvasNavSubMenu = $offCanvasNav.find(".dropdown")
    /*Add Toggle Button With Off Canvas Sub Menu*/
    $offCanvasNavSubMenu
        .parent()
        .prepend(
            '<span class="menu-expand"><i class="fi-rs-angle-small-down"></i></span>'
        )
    /*Close Off Canvas Sub Menu*/
    $offCanvasNavSubMenu.slideUp()
    /*Category Sub Menu Toggle*/
    $offCanvasNav.on("click", "li a, li .menu-expand", function (e) {
        var $this = $(this)
        if (
            $this
                .parent()
                .attr("class")
                .match(
                    /\b(menu-item-has-children|has-children|has-sub-menu)\b/
                ) &&
            ($this.attr("href") === "#" || $this.hasClass("menu-expand"))
        ) {
            e.preventDefault()
            if ($this.siblings("ul:visible").length) {
                $this.parent("li").removeClass("active")
                $this.siblings("ul").slideUp()
            } else {
                $this.parent("li").addClass("active")
                $this
                    .closest("li")
                    .siblings("li")
                    .removeClass("active")
                    .find("li")
                    .removeClass("active")
                $this.closest("li").siblings("li").find("ul:visible").slideUp()
                $this.siblings("ul").slideDown()
            }
        }
    })
    /*--- language currency active ----*/
    $(".mobile-language-active").on("click", function (e) {
        e.preventDefault()
        $(".lang-dropdown-active").slideToggle(900)
    })
    /*--- Categori-button-active-2 ----*/
    $(".categori-button-active-2").on("click", function (e) {
        e.preventDefault()
        $(".categori-dropdown-active-small").slideToggle(900)
    })
    /*--- Mobile demo active ----*/
    var demo = $(".tm-demo-options-wrapper")
    $(".view-demo-btn-active").on("click", function (e) {
        e.preventDefault()
        demo.toggleClass("demo-open")
    })
    /*-----More Menu Open----*/
    $(".more_slide_open").slideUp()
    $(".more_categories").on("click", function () {
        $(this).toggleClass("show")
        $(".more_slide_open").slideToggle()
    })
    $(".modal").on("shown.bs.modal", function (e) {
        $(".product-image-slider").slick("setPosition")
        $(".slider-nav-thumbnails").slick("setPosition")
        $(".product-image-slider .slick-active img").elevateZoom({
            zoomType: "inner",
            cursor: "crosshair",
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 750,
        })
    })
    /*--- VSticker ----*/
    $("#news-flash").vTicker({
        speed: 500,
        pause: 3000,
        animation: "fade",
        mousePause: false,
        showItems: 1,
    })
})(jQuery)
//Address from edit validation
function validateAddressForm() {
    var firstName = document.getElementById("firstName").value
    var lastName = document.getElementById("lastName").value
    var address = document.getElementById("address").value
    var city = document.getElementById("city").value
    var state = document.getElementById("state").value
    var phone = document.getElementById("phone").value
    var landMark = document.getElementById("landMark").value
    var pincode = document.getElementById("pincode").value
    var email = document.getElementById("email").value
    var firstNameError = " "
    var lastNameError = " "
    var addressError = " "
    var cityError = " "
    var stateError = " "
    var phoneError = " "
    var landMarkError = " "
    var pincodeError = " "
    var emailError = " "
    if (firstName.trim() === "") {
        firstNameError = "Fisrt name is required"
    }
    if (/\d/.test(firstName)) {
        firstNameError = "First Name cannotggrgrgcontain digits"
        if (lastName.trim() == "") lastNameError = "Last namr is required"
        if (address.trim() == "") addressError = "Address is required"
        if (city.trim() == "") cityError = "city is required"
        if (state.trim() == "") stateError = "state is required"
        if (phone.trim() == "") phoneError = "Phone is required"
        if (landMark.trim() == "") landMarkError = "Landmark is required"
        if (pincode.trim() == "") pincodeError = "Pincode is required"
        if (email.trim() == "") emailError = "Email is required"
        if (
            firstNameError ||
            lastNameError ||
            addressError ||
            cityError ||
            stateError ||
            phoneError ||
            landMarkError ||
            pincodeError ||
            emailError
        ) {
            document.getElementById("firstNameError").innerHTML = firstNameError
            document.getElementById("lastNameError").innerHTML = lastNameError
            document.getElementById("addressError").innerHTML = addressError
            document.getElementById("cityError").innerHTML = cityError
            document.getElementById("stateError").innerHTML = stateError
            document.getElementById("phoneError").innerHTML = phoneError
            document.getElementById("landMarkError").innerHTML = landMarkError
            document.getElementById("pincodeError").innerHTML = pincodeError
            document.getElementById("emailError").innerHTML = emailError
            return false
        } else {
            document.getElementById("firstNameError").innerHTML = " "
            document.getElementById("lastNameError").innerHTML = " "
            document.getElementById("addressError").innerHTML = " "
            document.getElementById("cityError").innerHTML = " "
            document.getElementById("stateError").innerHTML = " "
            document.getElementById("phoneError").innerHTML = " "
            document.getElementById("landMarkError").innerHTML = " "
            document.getElementById("pincodeError").innerHTML = " "
            document.getElementById("emailError").innerHTML = " "
            return true
        }
    }
    //addressEditForm
    //  function clearErrorMessages() {
    //      const errorElements =
    //          userDetailsForm.querySelectorAll('[id$="Error"]')
    //      errorElements.forEach(function (element) {
    //          element.innerText = ""
    //      })
    //  }
    let doc = document.getElementById("forgotEmail")
    alert(doc)
    console.log(hello)
}

function forgotPassword() {
    fetch("/forgotPassword")
        .then((res) => res.text())
        .then((data) => {
            document.getElementById("login-container").innerHTML = data
            $("#forgotPasswordForm").submit(function (e) {
                e.preventDefault()
                const isvalid = validateForgotPasswordFrom()
                const formData = $(this).serialize()
                console.log(formData)
                if (isvalid) {
                    $.ajax({
                        method: "POST",
                        url: "/forgotPassword",
                        data: formData,
                        success: function (response) {
                            console.log(response)
                            if (response.response == "Success") {
                                // Swal.fire({
                                //     icon: "success",
                                //     html:'<p>Reset password link is send to your mail</p>',
                                // })
                                alert("Reset password link is send to your mail")
                                
                            } else if (response.response == "Failed") {
                                // Swal.fire({
                                //     icon: "error",
                                //     html: "<p>The email is not registered</p>",
                                // })
                                alert("The email is not registered")
                            }
                        },
                        error: function (err) {
                            console.log(err)
                        },
                    })
                }
            })
        })
        .catch((err) => console.log(err))
}
function validateForgotPasswordFrom() {
    var email = document.getElementById("forgotEmail").value
    console.log(email)
    var emailError = ""
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!emailPattern.test(email)) emailError = "Enter a valid email"
    if (emailError) {
        document.getElementById("forgotEmailError").innerHTML = emailError
        return false
    } else {
        emailError = ""
        return true
    }
}

  function filterProducts() {
      var minPrice = document.getElementById("minPrice").value
      var maxPrice = document.getElementById("maxPrice").value

      // Make an AJAX request to the server
      $.ajax({
          url: `/AllProduct_Category?minPrice=${minPrice}&maxPrice=${maxPrice}&ajax="true"`, // Replace with your actual API endpoint
          method: "GET",
          headers: {
              "X-Requested-With": "XMLHttpRequest",
          },
          success: function (data) {
              // Handle the successful response for AJAX
              console.log(data)
          },
          error: function (error) {
              // Handle errors for AJAX
              console.error("There was a problem with the AJAX request:", error)
          },
      })
  }

   async function filterProducts() {
       const minPrice = document.getElementById("minPrice").value || -Infinity
       const maxPrice = document.getElementById("maxPrice").value || Infinity
       // Get other filter criteria as needed

       // Make an AJAX request to the server
       const response = await fetch(
           `/AllProduct_Category?minPrice=${minPrice}&maxPrice=${maxPrice}&otherCriteria=value`,
           {
               method: "GET",
           }
       )

       // Assuming the server responds with JSON
       const data = await response.text()
       document.getElementById("body").innerHTML = "" + data
       console.log(data)

       // Update the UI with the filtered products
       // This may involve rendering the products on your page
       // You might also want to update the URL to reflect the current filters (optional)
   }

