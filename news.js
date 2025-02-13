$(document).ready(function () {
    
    $(".scroll-link").click(function () {
        let target = $(this).data("target");
        $("html, body").animate({
            scrollTop: $("#" + target).offset().top - 50
        }, 800);
    });

   
    $(".read-more").click(function () {
        let url = $(this).data("url");
        window.open(url, "_blank");
    });

   
    $("#accordion h3").click(function () {
        $(this).next(".accordion-content").slideToggle();
        $(this).siblings("h3").next(".accordion-content").slideUp();
    });

    
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $("#scrollTop").removeClass("opacity-0 invisible").addClass("opacity-100 visible");
        } else {
            $("#scrollTop").removeClass("opacity-100 visible").addClass("opacity-0 invisible");
        }
    });

  
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $("#scrollTop").fadeIn();
        } else {
            $("#scrollTop").fadeOut();
        }
    });

    $("#scrollTop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
    });

    $(document).ready(function () {
        $(".accordion-item").click(function () {
            let content = $(this).find(".accordion-content");
            let icon = $(this).find(".toggle-icon");
    
            // Toggle content
            content.slideToggle();
            
            // Change icon
            icon.text(icon.text() === "+" ? "−" : "+");
    
            // Hide other open accordions
            $(this).siblings().find(".accordion-content").slideUp();
            $(this).siblings().find(".toggle-icon").text("+");
        });
    });

});