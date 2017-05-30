    var socket = io.connect('http://localhost:3000');

    socket.on("change_slide", function(slide) {
      var changeSlide=false;
      updateSlide(slide);
      if (isLogged) {
        $(document).on("keyup", function(e) {
          switch (e.which) {
            case e.which = 39:
              if (!changeSlide) {
                socket.emit("change_slide", {
                  number: slide.number,
                  action: 1
                });
                changeSlide = true;
              }
              return false;
              break;
            case e.which = 37:
              if (!changeSlide) {
                socket.emit("change_slide", {
                  number: slide.number,
                  action: -1
                });
                changeSlide = true;
              }
              return false;
              break;
            default:

          }
          e.preventDefault();
        });
      }
    });

    function updateSlide(slide) {
      var container = document.getElementById('poll_content');
      $(container).html("LOADER");
      var formRenderOpts = {
        container,
        formData: slide.form_json,
        dataType: 'json'
      };

      $(container).formRender(formRenderOpts);
    }

    socket.on("last_slide", function(slide) {
      $("#poll_content").html("Merci de votre attention !");
      // changeSlide=false;
      // if (isLogged) {
      //   $(document).on("keyup", function(e) {
      //     switch (e.which) {
      //       case e.which = 37:
      //         if (!changeSlide) {
      //           socket.emit("change_slide", {
      //             number: slide.number,
      //             action: -1
      //           });
      //           changeSlide = true;
      //         }
      //         break;
      //       default:
      //
      //     }
      //     e.preventDefault();
      //
      //     // if(e.which===39){
      //     //   socket.emit("change_slide", {number:slide.number,action:1});
      //     // }
      //     // if(e.which===37){
      //     //   socket.emit("change_slide", {number:slide.number,action:-1});
      //     // }
      //     // e.preventDefault();
      //   });
      // }
    });
