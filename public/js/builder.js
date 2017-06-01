/*jshint esversion: 6 */

var formBuilders = [];
var setFormData = "";
var parseSetFormData = "";

$(document).ready(function(){

  // Get Data for edit
  if ($('#form_json').val() !== "") {
    setFormData = JSON.parse($('#form_json').val());
    parseSetFormData = setFormData;
    console.log(JSON.stringify(setFormData));
  }


  var typeUserDisabledAttrs = {
    'header': ['access'],
    'paragraph': ['access'],
    'checkbox-group': ['access'],
    'radio-group': ['access'],
    'select': ['access'],
    'number': ['access'],
    'date': ['access'],
    'text': ['access'],
    'textarea': ['access']
  };

  var typeUserAttrs = {
    'checkbox-group': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'pie': 'Diagramme circulaire',
          'bar': 'Diagramme en bâton',
          'line': 'Graphique',
        }
      }
    },
    'radio-group': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'pie': 'Diagramme circulaire',
          'bar': 'Diagramme en bâton',
          'line': 'Graphique',
        }
      }
    },
    'select': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'pie': 'Diagramme circulaire',
          'bar': 'Diagramme en bâton',
          'line': 'Graphique',
        }
      }
    },
    'date': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'pie': 'Diagramme circulaire',
          'bar': 'Diagramme en bâton',
          'line': 'Graphique',
        }
      }
    },
    'text': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'pie': 'Diagramme circulaire',
          'bar': 'Diagramme en bâton',
          'line': 'Graphique',
        }
      }
    },
    'textarea': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'pie': 'Diagramme circulaire',
          'bar': 'Diagramme en bâton',
          'line': 'Graphique',
        }
      }
    },
    'number': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'pie': 'Diagramme circulaire',
          'bar': 'Diagramme en bâton',
          'line': 'Graphique',
        }
      }
    }
  };

  const fbOptions = {
    subtypes: {
      text: ['datetime-local']
    },
    disabledActionButtons: ['data', 'save'],
    i18n: {
      locale: 'fr-FR',
      location: '/formBuilderCharts/',
      extension: '.lang'
    },
    controlOrder: [
      'header',
      'paragraph',
      'checkbox-group',
      'radio-group',
      'select',
      'number'
    ],
    disableFields: [
      'autocomplete',
      'file',
      'hidden',
      'button'
    ],
    stickyControls: {
      enable: true
    },
    formData: parseSetFormData[0],
    sortableControls: true,
    disableInjectedStyle: true,
    typeUserDisabledAttrs,
    typeUserAttrs,
    // disabledAttrs
  };

  // Tabs
  var $fbPages = $('#form-builder-pages'),
    addPageTab = document.getElementById('add-page-tab');

  $fbPages.tabs({
    beforeActivate: function(event, ui) {
      if (ui.newPanel.selector === '#new-page') {
        return false;
      }
    }
  });

  // Generate base tabs
  if (parseSetFormData.length > 1) {
    // parseSetFormData.map(function(value, i){
      for (var cpt = 1; cpt < parseSetFormData.length; cpt++) {
        console.log(parseSetFormData[cpt]);
        // if (cpt > 0) {
          const newOptions = {
            subtypes: {
              text: ['datetime-local']
            },
            disabledActionButtons: ['data', 'save'],
            i18n: {
              locale: 'fr-FR',
              location: '/formBuilderCharts/',
              extension: '.lang'
            },
            controlOrder: [
              'header',
              'paragraph',
              'checkbox-group',
              'radio-group',
              'select',
              'number'
            ],
            disableFields: [
              'autocomplete',
              'file',
              'hidden',
              'button'
            ],
            stickyControls: {
              enable: true
            },
            formData: parseSetFormData[cpt],
            sortableControls: true,
            disableInjectedStyle: true,
            typeUserDisabledAttrs,
            typeUserAttrs,
            // disabledAttrs
          };

          addTab($(document.getElementById('add-page-tab')), newOptions);
        // }
      }
    // });
  }

  $(addPageTab).on('click', function() {
    addTab(this, fbOptions);
  });

  // Close tab
  $('.tabs-poll').on('click', '.closeTab', function(){

    var idTab = $(this).prev().attr('href');
    $(idTab).remove();
    $(this).parent().remove();
    // tabs.tabs( "refresh" );

    // Rename tabs
    var i = 2,
    j = 2;
    $('.new-tab a').map(function(c, tab){
      tab.innerHTML = 'Page ' + i;
      $(tab).attr('href', '#page-' + i);
      $(tab).parent().attr('aria-controls', 'page-' + i);
      i++;
    });
    i = 2;
    $('.new-slide').map(function(c, slide){
      $(slide).removeAttr('id');
      $(slide).attr('id', 'page-' + j);
      j++;
    });
    j = 2;
  });

  function addTab(clone, options) {
    var tabCount = document.getElementById('tabs').children.length,
      tabId = 'page-' + tabCount.toString(),
      $newPageTemplate = $('#new-page'),
      $newPage = $newPageTemplate.clone().attr('id', tabId).addClass('build-wrap new-slide'),
      $newTab = $(clone).clone().removeAttr('id').addClass('new-tab'),
      $tabLink = $('a', $newTab).attr('href', '#' + tabId).text('Page ' + tabCount);
    
    $newTab.append('<span class="closeTab">&#215;</span>');

    $newPage.insertBefore($newPageTemplate);
    $newTab.insertBefore(clone);
    $fbPages.tabs('refresh');
    $fbPages.tabs("option", "active", tabCount - 1);
    formBuilders.push($newPage.formBuilder(options));
  }

  // Set Form Builder
  formBuilders.push($($('.build-wrap')[0]).formBuilder(fbOptions));

    $('#form-save-all').submit(function(e) {
      // e.preventDefault(e);
      var allEditorValues = $('.build-wrap').map(function() {
        return $(this).data("formBuilder").actions.getData("json");
      });
      var form_json = JSON.stringify(allEditorValues);
      $("#form_json").val(form_json);
      return true;
    });
    // Par défaut la première valeur est ajoutée
    if($("#font_family").val()===""){
      $("#font_family").val(fonts[0].family);
      $("#font_category").val(fonts[0].category);
    }

    $("#font").change(function(){
      $("#font_family").val(fonts[$(this).val()].family);
      $("#font_category").val(fonts[$(this).val()].category);
    });
});
