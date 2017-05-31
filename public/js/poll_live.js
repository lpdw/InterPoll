    var socket = io.connect('http://localhost:3000');
    var charts = {};

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
      var chartsData = slide.charts_result;
      var formRenderOpts = {
        container,
        formData: slide.form_json,
        dataType: 'json',
        onRender: function() {
          $('.fb-render').find('div').each(function() {
            $(this).addClass('col-md-12');
          });
          console.log(chartsData);
          $.each(chartsData, function(name, value) {
            var ctx = document.createElement('canvas');
            ctx.id = name + '-' + value.type;
            $(':input[name="' + name + '"]').parents('.form-group').removeClass('col-md-12').addClass('col-md-6').after($('<div class="col-md-6 ' + name + '-chart">' + ctx.outerHTML + '</div>'));
            ctx = document.getElementById(ctx.id);
            var myChart = new Chart(ctx, {
              type: value.type,
              data: value.data
            });
            charts[name] = myChart;
          });
        }
      };

      $(container).formRender(formRenderOpts);
    };

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

    socket.on('data_update', function(chartsData) {
      $.each(charts, function(name, chart) {
        if (chartsData[name]) {
          chart.data.datasets[0] = chartsData[name].data.datasets[0];
          chart.update();
        }
      });
    });

    $('#ok').click(function(){
      var inputValues = {};
      $('.form-group').each(function() {
        $(this).find(':input').each(function() {
          if ($(this).is(':radio:checked, :checkbox:checked')) {
            if ($(this).next().is(':input:text'))
              inputValues[$(this).next().attr('name')] = $(this).next().val();
            else
              inputValues[$(this).attr('name')] = $(this).val();
          }
          else if (!$(this).is(':radio, :checkbox'))
            if (!$(this).prev().is(':radio, :checkbox'))
              inputValues[$(this).attr('name')] = $(this).val();
          $(this).attr('disabled','disabled');
        });
      });
      socket.emit('input_values', inputValues);
      $(this).attr('disabled','disabled');
      $(this).unbind('click');
      return false;
    });

