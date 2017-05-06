var formBuilderUl = $('.frmb.ui-sortable');

var getResultChart = function(chart) {
	return $('<div class="col-md-6 result-display">' + chart + '</div>');
};

var resultDisplayToggle = function(formField) {
	var prevHolder = formField.find('div.prev-holder');
	prevHolderNodeInserted(prevHolder, formField);

};

var prevHolderNodeInserted = function(prevHolder, formField) {
	prevHolder.on('DOMNodeInserted', function() {
		var formGroup = prevHolder.find('.form-group');
		formGroup.addClass('col-md-12');
		var resultSelect = formField.find('.fld-resultat');
		if (resultSelect.length) {
			if (resultSelect.val() != 'noresult') {
				formGroup.removeClass('col-md-12').addClass('col-md-6');
				prevHolder.off('DOMNodeInserted');
				formGroup.after(getResultChart(resultSelect.val()));
				prevHolderNodeInserted(prevHolder, formField);
			}
			else {
				formGroup.removeClass('col-md-6').addClass('col-md-12');
				formGroup.next('div.result-display').remove();
			}
		}
	});
};

var formbuilderplugin = function() {
	$('.content').on('DOMNodeInserted', function() {
		if ($('.frmb.ui-sortable').length && $('.frmb.ui-sortable').length != formBuilderUl.length)
			formBuilderUl = $('.frmb.ui-sortable');
		if (formBuilderUl.length) {
			formBuilderUl.off('DOMNodeInserted').on('DOMNodeInserted', function(e) {
				if ($(e.target).is('li.form-field')) {
					$(e.target).addClass('col-md-12');
					$(e.target).find('div.prev-holder').addClass('row');
					resultDisplayToggle($(e.target));
				}
			});
		}
	});
};

/*var getJsonAndAddResult = function(formData) {
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
}*/

formbuilderplugin();