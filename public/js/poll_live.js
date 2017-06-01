/* jshint esversion: 6 */
/* jshint node: true */

    var socket = io.connect(window.location.origin);
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
            case e.which = 37:
              if (!changeSlide) {
                socket.emit("change_slide", {
                  number: slide.number,
                  action: -1
                });
                changeSlide = true;
              }
              return false;
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
        formData: slide.form_json,
        dataType: 'json',
        onRender: function() {
          $('#poll_content').children('div').each(function() {
            $(this).addClass('poll-element');
          });
          $('#poll_content').find('input[type="date"]').addClass('datepicker');
          $('#poll_content').find('textarea').addClass('materialize-textarea');
          $.each(chartsData, function(name, value) {
            var ctx = document.createElement('canvas');
            ctx.id = name + '-' + value.type;
            $(':input[name^="' + name + '"]').first().parents('.form-group').addClass('col s6').after($('<div class="poll-chart col s6 ' + name + '-chart">' + ctx.outerHTML + '</div>'));
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
      $(container).append("<button class='waves-effect waves-light btn-large indigo' id='ok'>Valider</button>");
      $('#ok').click(function(){
        var inputValues = [];
        $('.form-group').each(function() {
          $(this).find(':input').each(function() {
            if ($(this).is(':radio:checked, :checkbox:checked')) {
              if ($(this).next().is(':input:text'))
                inputValues.push({[$(this).next().attr('name').replace("[]","")]:$(this).next().val()});
              else
                inputValues.push({[$(this).attr('name').replace("[]","")]: $(this).val()});
            }
            else if (!$(this).is(':radio, :checkbox') && !$(this).prev().is(':radio, :checkbox'))
                inputValues.push({[$(this).attr('name').replace("[]","")]: $(this).val()});
            $(this).attr('disabled','disabled');
          });
        });
        socket.emit('input_values', inputValues);
        $(this).attr('disabled','disabled');
        $(this).unbind('click');
        return false;
      });
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

    socket.on('data_update', function(chartsData) {
      $.each(charts, function(name, chart) {
        if (chartsData[name]) {
          chart.data.datasets[0] = chartsData[name].data.datasets[0];
          chart.update();
        }
      });
    });
