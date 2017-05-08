var formBuilderUl = $('.frmb.ui-sortable');
var colorsArray = ['rgba(81,87,74,1)', 'rgba(68,124,105,1)', 'rgba(116,196,147,1)', 'rgba(142,140,109,1)', 'rgba(228,191,128,1)', 'rgba(233,215,142,1)', 'rgba(226,151,93,1)', 'rgba(241,150,112,1)', 'rgba(225,101,82,1)', 'rgba(201,74,83,1)', 'rgba(190,81,104,1)', 'rgba(163,73,116,1)', 'rgba(153,55,103,1)', 'rgba(101,56,125,1)', 'rgba(78,36,114,1)', 'rgba(145,99,182,1)', 'rgba(226,121,163,1)', 'rgba(224,89,139,1)', 'rgba(124,159,176,1)', 'rgba(86,152,196,1)', 'rgba(154,191,136,1)'];


var getResultChart = function(formField, formGroup, chart) {
	var ctx = document.createElement('canvas');
	ctx.id = formField.attr('id') + '-' + chart;
	formGroup.after($('<div class="col-md-6 result-display">' + ctx.outerHTML + '</div>'));
	var labels = [];
	var datas = [];
	var colors = colorsArray;
	var inputName = formGroup.find(':input').first().attr('name');
	inputName = inputName.substring(0, inputName.length-8);
	var options = formBuilder.actions.getData();
	for (var i=0; i<options.length; i++) {
		var currentOption = options[i];
		if (currentOption.values && currentOption.name == inputName) {
			for (var j=0; j<currentOption.values.length; j++) {
				labels.push(currentOption.values[j].label);
				datas.push(Math.round(Math.random()*30));
			}
			if (currentOption.other) {
				labels.push('Autres');
				datas.push(Math.round(Math.random()*30));
			}
			break;
		}
	}
	colors.length = labels.length;
	ctx = document.getElementById(ctx.id);
	var myChart = new Chart(ctx, {
		type: chart,
		data: {
			labels: labels,
			datasets: [{
				data: datas,
				backgroundColor: colors,
			}]
		}
	});
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
				getResultChart(formField, formGroup, resultSelect.val());
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

formbuilderplugin();