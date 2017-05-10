    var socket = io.connect('http://localhost:3000');
    let role =0;
    socket.on('isConnected', function(slide) {
      $("#status").html("Administrateur");
      role = 1;
      var container = document.getElementById('next');
      var formRenderOpts = {
        container,
        formData: slide.form_json,
        dataType: 'json'
      };

      $(container).formRender(formRenderOpts);

      $(document).on("keydown",function(e) {
        console.log("isConnected keydown");
          switch (e.which) {
            case 37: // left
              if(slide.number>0){
                socket.emit("change_slide", {number:slide.number,action:-1});
              }
              break;
            case 39: // right
            console.log("next");
              socket.emit("change_slide", {number:slide.number,action:1});
            default:
              return; // exit this handler for other keys
          }

        e.preventDefault();
      });


    });
    // Si l'utilisateur n'est pas connecté, il n'a aucun droit sur l'écran
    socket.on("isVisitor", function(form_json) {
      role=0;
      console.log("visiteur");
      console.log(form_json);
      $("#status").html("Visiteur");
      var container = document.getElementById('next');
      var formRenderOpts = {
        container,
        formData: form_json,
        dataType: 'json'
      };

      $(container).formRender(formRenderOpts);


    });
    socket.on("refresh_slide", function(slide) {
      console.log("refresh");
      console.log(slide.number);
      var container = document.getElementById('next');
      var formRenderOpts = {
        container,
        formData: slide.form_json,
        dataType: 'json'
      };

      $(container).formRender(formRenderOpts);
      $(document).on("keydown",function(e) {
        console.log("isConnected keydown");
          switch (e.which) {
            case 37: // left
              if(slide.number>0){
                socket.emit("change_slide", {number:slide.number,action:-1});
              }
              break;
            case 39: // right
            console.log("next");
              socket.emit("change_slide", {number:slide.number,action:1});
            default:
              return; // exit this handler for other keys
          }

        e.preventDefault();
      });
    });
    // Si l'utilisateur est un Administrateur connecté, il peut changer les slides






    socket.on("last_slide",function(){
$("#next").html("Merci de votre attention !");
  });
