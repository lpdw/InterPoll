    var socket = io.connect('http://localhost:3000');

     socket.on("change_slide",function(slide){

        updateSlide(slide);
        if(isLogged){
          $(document).on("keyup",function(e) {
            switch (e.which) {
              case e.which=39:
              socket.emit("change_slide", {number:slide.number,action:1});
                break;
                case e.which=37:
                socket.emit("change_slide", {number:slide.number,action:-1});
                  break;
              default:

            }
            e.preventDefault();

            // if(e.which===39){
            //   socket.emit("change_slide", {number:slide.number,action:1});
            // }
            // if(e.which===37){
            //   socket.emit("change_slide", {number:slide.number,action:-1});
            // }
            // e.preventDefault();
          });
        }
     });
     function updateSlide(slide){
       console.log("updateSlide");
       console.log(slide.form_json);
       var container = document.getElementById('next');
       $(container).html("LOADER");
       var formRenderOpts = {
         container,
         formData: slide.form_json,
         dataType: 'json'
       };

       $(container).formRender(formRenderOpts);
     }

//     function refresh_slide(callback){
//       socket.on("refresh_slide", function(slide) {
//         // console.log('refresh slide');
//         // console.log("slide number :"+slide.number);
//         // console.log("is connected :"+slide.isConnected);
//         // role=slide.isConnected;
//         //
//         // var container = document.getElementById('next');
//         // $(container).html("LOADER");
//         // var formRenderOpts = {
//         //   container,
//         //   formData: slide.form_json,
//         //   dataType: 'json'
//         // };
//         //
//         // $(container).formRender(formRenderOpts);
//         // changeSlide(role,slide);
//         console.log("refresh slide ");
//         callback(slide);
//       });
//     }
//     refresh_slide(function(slide) {
//     console.log('This is the first handler');
//     console.log(slide);
//     // do stuff for this handler here...
// });
//
//     // socket.on('isConnected', function(slide) {
//     //   $("#status").html("Administrateur");
//     //   role = 1;
//     //   var container = document.getElementById('next');
//     //   var formRenderOpts = {
//     //     container,
//     //     formData: slide.form_json,
//     //     dataType: 'json'
//     //   };
//     //
//     //   $(container).formRender(formRenderOpts);
//     //
//     //   $(document).on("keydown",function(e) {
//     //     console.log("isConnected keydown");
//     //       switch (e.which) {
//     //         case 37: // left
//     //           if(slide.number>0){
//     //             socket.emit("change_slide", {number:slide.number,action:-1});
//     //           }
//     //           break;
//     //         case 39: // right
//     //         console.log("next");
//     //           socket.emit("change_slide", {number:slide.number,action:1});
//     //         default:
//     //           return; // exit this handler for other keys
//     //       }
//     //
//     //     e.preventDefault();
//     //   });
//     //
//     //
//     // });
//     // // Si l'utilisateur n'est pas connecté, il n'a aucun droit sur l'écran
//     // socket.on("isVisitor", function(form_json) {
//     //   role=0;
//     //   console.log("visiteur");
//     //   console.log(form_json);
//     //   $("#status").html("Visiteur");
//     //   var container = document.getElementById('next');
//     //   var formRenderOpts = {
//     //     container,
//     //     formData: form_json,
//     //     dataType: 'json'
//     //   };
//     //
//     //   $(container).formRender(formRenderOpts);
//     //
//     //
//     // });
//     socket.on("refresh_slide", function(slide) {
//       console.log('refresh slide');
//       console.log("slide number :"+slide.number);
//       console.log("is connected :"+slide.isConnected);
//       role=slide.isConnected;
//
//       var container = document.getElementById('next');
//       $(container).html("LOADER");
//       var formRenderOpts = {
//         container,
//         formData: slide.form_json,
//         dataType: 'json'
//       };
//
//       $(container).formRender(formRenderOpts);
//       //changeSlide(role,slide);
//     });
//
//     // Si l'utilisateur est un Administrateur connecté, il peut changer les slides
//
//     socket.on("isConnected",function(slide){
//       console.log("je suis connecté");
//       var container = document.getElementById('next');
//       $(container).html("LOADER");
//       var formRenderOpts = {
//         container,
//         formData: slide.form_json,
//         dataType: 'json'
//       };
//
//       $(container).formRender(formRenderOpts);
//       console.log("CURRENT SLIDE "+slide.number);
//       $(document).on("click","#nextslide",function(e) {
//         socket.emit("change_slide", {number:slide.number,action:1});
//         e.preventDefault();
//       });
//       $(document).on("click","#previousslide",function(e) {
//         socket.emit("change_slide", {number:slide.number,action:-1});
//
//       });
//     });
//     socket.on("isVisitor",function(slide){
//       console.log("Je suis un visiteur");
//       var container = document.getElementById('next');
//       $(container).html("LOADER");
//       var formRenderOpts = {
//         container,
//         formData: slide.form_json,
//         dataType: 'json'
//       };
//
//       $(container).formRender(formRenderOpts);
//     });
//
//
//

    socket.on("last_slide",function(){
$("#next").html("Merci de votre attention !");
  });
