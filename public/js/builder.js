/*jshint esversion: 6 */

jQuery(function($) {

  var typeUserDisabledAttrs = {
    autocomplete: ['access']
  };

  var typeUserAttrs = {
    'checkbox-group': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'circulaire': 'Diagramme circulaire',
          'diagramme': 'Diagramme en bâton',
          'graph': 'Graphique',
        }
      }
    },
    'radio-group': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'circulaire': 'Diagramme circulaire',
          'diagramme': 'Diagramme en bâton',
          'graph': 'Graphique',
        }
      }
    },
    'select': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'circulaire': 'Diagramme circulaire',
          'diagramme': 'Diagramme en bâton',
          'graph': 'Graphique',
        }
      }
    },
    'date': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'circulaire': 'Diagramme circulaire',
          'diagramme': 'Diagramme en bâton',
          'graph': 'Graphique',
        }
      }
    },
    'text': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'circulaire': 'Diagramme circulaire',
          'diagramme': 'Diagramme en bâton',
          'graph': 'Graphique',
        }
      }
    },
    'textarea': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'circulaire': 'Diagramme circulaire',
          'diagramme': 'Diagramme en bâton',
          'graph': 'Graphique',
        }
      }
    },
    'number': {
      resultat: {
        label: 'Resultat',
        options: {
          'noresult': 'Ne pas afficher le résultat',
          'circulaire': 'Diagramme circulaire',
          'diagramme': 'Diagramme en bâton',
          'graph': 'Graphique',
        }
      }
    }
  };

  const fbOptions = {
    subtypes: {
      text: ['datetime-local']
    },
    disabledActionButtons: ['data'],
    defaultFields: [{
      class: "header-base",
      label: "Votre question ?",
      type: "header"
      }],
    i18n: {
      locale: 'fr-FR',
      location: '/formbuilder/',
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
    onSave: function(e, formData) {
      // console.log("save");
      toggleEdit();
      $('.render-wrap').formRender({
        formData
        //  tes
      });
      window.sessionStorage.setItem('formData', JSON.stringify(formData));
    },
    stickyControls: {
      enable: true
    },
    sortableControls: true,
    typeUserDisabledAttrs,
    typeUserAttrs,
    // disabledAttrs
  };
  let formData = window.sessionStorage.getItem('formData');
  let multipleFormData = window.sessionStorage.getItem('multipleFormData');
  let editing = true;

  if (formData) {
    fbOptions.formData = JSON.parse(formData);
  }
  if (multipleFormData) {
    // fbOptions.formData = JSON.parse(multipleFormData)[0];
    // console.log(JSON.parse(multipleFormData));
  }

  // Tabs
  $(function() {
    'use strict';
    var $fbPages = $(document.getElementById('form-builder-pages')),
      addPageTab = document.getElementById('add-page-tab');

    $fbPages.tabs({
      beforeActivate: function(event, ui) {
        if (ui.newPanel.selector === '#new-page') {
          return false;
        }
      }
    });

    addPageTab.onclick = function() {
      var tabCount = document.getElementById('tabs').children.length,
        tabId = 'page-' + tabCount.toString(),
        $newPageTemplate = $(document.getElementById('new-page')),
        $newPage = $newPageTemplate.clone().attr('id', tabId).addClass('build-wrap'),
        // $newPage = $newPageTemplate.clone().attr('id', tabId).prepend('<div class="build-wrap">'),
        $newTab = $(this).clone().removeAttr('id'),
        $tabLink = $('a', $newTab).attr('href', '#' + tabId).text('Page ' + tabCount);

      $newPage.insertBefore($newPageTemplate);
      $newTab.insertBefore(this);
      $fbPages.tabs('refresh');
      $fbPages.tabs("option", "active", tabCount - 1);
      $newPage.formBuilder(fbOptions);
    };

    $('.fb-editor').formBuilder();

    $(document.getElementById('save-all')).click(function() {
      var allEditorValues = $('.build-wrap').map(function() {
        // return $(this).data('formBuilder').formData;
        console.log($(this));
        return $(this).data("formBuilder").actions.getData("json");
        // console.log($(this).data('formBuilder').actions.getData("json"));

      });
      console.log(allEditorValues);
      /**
        * Stocker en base
        */

      window.sessionStorage.setItem('multipleFormData', JSON.stringify(allEditorValues));
    });
  });

  /**
   * Toggles the edit mode for the demo
   * @return {Boolean} editMode
   */
  function toggleEdit() {
    document.body.classList.toggle('form-rendered', editing);
    return editing = !editing;
  }

  const setFormData = '[{"type":"text","label":"Full Name","subtype":"text","className":"form-control","name":"text-1476748004559"},{"type":"select","label":"Occupation","className":"form-control","name":"select-1476748006618","values":[{"label":"Street Sweeper","value":"option-1","selected":true},{"label":"Moth Man","value":"option-2"},{"label":"Chemist","value":"option-3"}]},{"type":"textarea","label":"Short Bio","rows":"5","className":"form-control","name":"textarea-1476748007461"}]';

  const formBuilder = $('.build-wrap').formBuilder(fbOptions);
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


  document.getElementById('edit-form').onclick = function() {
    toggleEdit();
  };

});
