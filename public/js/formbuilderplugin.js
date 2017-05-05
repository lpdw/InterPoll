var formBuilderUl = $('.frmb.ui-sortable');

var formbuilderplugin = function() {
	$('.content').on('DOMNodeInserted', function() {
		if ($('.frmb.ui-sortable').length && $('.frmb.ui-sortable').length != formBuilderUl.length)
			formBuilderUl = $('.frmb.ui-sortable');
		if (formBuilderUl.length) {
			formBuilderUl.off('DOMNodeInserted').on('DOMNodeInserted', function(e) {
				if ($(e.target).is('.form-field')) {
					$(e.target).addClass("col-md-12");
					if ($(e.target).is('.autocomplete-field, .checkbox-group-field, .date-field, .radio-group-field, .select-field, .text-field, .textarea-field') && !$(e.target).find('.result-wrap').length)
						$('<div class="form-group result-wrap" style="display: block"><label>Result</label><div class="input-wrap"><select name="result" class="fld-result form-control"><option>Ne pas afficher le résultat</option><option>Diagramme circulaire</option><option>Diagramme en bâton</option><option>Graphique</option></select></div></div>').insertBefore($(e.target).find(".close-field"));
				}
			});
		}
	});
}

var getJsonAndAddResult = function(formData) {
	if (formBuilderUl.length) {
		formData = jQuery.parseJSON(formData);
		for (var i=0; i<formBuilderUl.length; i++) {
			var formBuilderChildren = $(formBuilderUl[i]).children('li');
			for (var j=0; j<formData[i].length; j++) {
				if ($(formBuilderChildren[j]).find(':input.fld-result').length)
					formData[i][j].result = $(formBuilderChildren[j]).find(':input.fld-result').val();
			};
		}
		console.log(formData);
	}
	return formData;
}

formbuilderplugin();