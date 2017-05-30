/*jshint esversion: 6 */

var formBuilder;

$(document).ready(function(){

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
      location: '/formbuildercharts/',
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
    sortableControls: true,
    disableInjectedStyle: true,
    typeUserDisabledAttrs,
    typeUserAttrs,
    // disabledAttrs
  };

    $('.fb-editor').formBuilder();

  // });

  const setFormData = '[{"type":"text","label":"Full Name","subtype":"text","className":"form-control","name":"text-1476748004559"},{"type":"select","label":"Occupation","className":"form-control","name":"select-1476748006618","values":[{"label":"Street Sweeper","value":"option-1","selected":true},{"label":"Moth Man","value":"option-2"},{"label":"Chemist","value":"option-3"}]},{"type":"textarea","label":"Short Bio","rows":"5","className":"form-control","name":"textarea-1476748007461"}]';

  formBuilder = $('.build-wrap').formBuilder(fbOptions);
  const fbPromise = formBuilder.promise;

  fbPromise.then(function(fb) {
    let apiBtns = {
      showData: fb.actions.showData,
      clearFields: fb.actions.clearFields,
      getData: () => console.log(fb.actions.getData()),
      setData: () => fb.actions.setData(setFormData),
      addField: () => {
        let field = {
            type: 'text',
            class: 'form-control',
            label: 'Text Field added at: ' + new Date().getTime()
          };
        fb.actions.addField(field);
      },
      removeField: () => fb.actions.removeField()
    };
  });

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

    $(addPageTab).on('click', function() {
      var tabCount = document.getElementById('tabs').children.length,
        tabId = 'page-' + tabCount.toString(),
        $newPageTemplate = $('#new-page'),
        $newPage = $newPageTemplate.clone().attr('id', tabId).addClass('build-wrap new-slide'),
        $newTab = $(this).clone().removeAttr('id').addClass('new-tab'),
        $tabLink = $('a', $newTab).attr('href', '#' + tabId).text('Page ' + tabCount);
        $newTab.append('<span class="closeTab">&#215;</span>');

      $newPage.insertBefore($newPageTemplate);
      $newTab.insertBefore(this);
      $fbPages.tabs('refresh');
      $fbPages.tabs("option", "active", tabCount - 1);
      $newPage.formBuilder(fbOptions);

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
    $('#form-save-all').submit(function() {

      var allEditorValues = $('.build-wrap').map(function() {
        return $(this).data("formBuilder").actions.getData("json");
      });
      var form_json = JSON.stringify(allEditorValues);
      $("#form_json").val(form_json);
      return true;
    });

    $("#font").change(function(){
      console.log($(this).val());
    })
});
