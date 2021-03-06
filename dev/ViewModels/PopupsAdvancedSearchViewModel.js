/* RainLoop Webmail (c) RainLoop Team | Licensed under CC BY-NC-SA 3.0 */

/**
 * @constructor
 * @extends KnoinAbstractViewModel
 */
function PopupsAdvancedSearchViewModel()
{
	KnoinAbstractViewModel.call(this, 'Popups', 'PopupsAdvancedSearch');

	this.fromFocus = ko.observable(false);
	
	this.from = ko.observable('');
	this.to = ko.observable('');
	this.subject = ko.observable('');
	this.text = ko.observable('');
	this.selectedDateValue = ko.observable(-1);

	this.hasAttachments = ko.observable(false);
	this.starred = ko.observable(false);
	this.unseen = ko.observable(false);

	this.searchCommand = Utils.createCommand(this, function () {
		
		var sSearch = this.buildSearchString();
		if ('' !== sSearch)
		{
			RL.data().mainMessageListSearch(sSearch);
		}
		
		this.cancelCommand();
	});

	Knoin.constructorEnd(this);
}

Utils.extendAsViewModel('PopupsAdvancedSearchViewModel', PopupsAdvancedSearchViewModel);

PopupsAdvancedSearchViewModel.prototype.buildSearchStringValue = function (sValue)
{
	if (-1 < sValue.indexOf(' '))
	{
		sValue = '"' + sValue + '"';
	}
	
	return sValue;
};

PopupsAdvancedSearchViewModel.prototype.buildSearchString = function ()
{
	var
		aResult = [],
		sFrom = Utils.trim(this.from()),
		sTo = Utils.trim(this.to()),
		sSubject = Utils.trim(this.subject()),
		sText = Utils.trim(this.text()),
		aHas = []
	;

	if (sFrom && '' !== sFrom)
	{
		aResult.push('from:' + this.buildSearchStringValue(sFrom));
	}
	
	if (sTo && '' !== sTo)
	{
		aResult.push('to:' + this.buildSearchStringValue(sTo));
	}

	if (sSubject && '' !== sSubject)
	{
		aResult.push('subject:' + this.buildSearchStringValue(sSubject));
	}
	
	if (this.hasAttachments())
	{
		aHas.push('attachments');
	}
	
	if (this.unseen())
	{
		aHas.push('unseen');
	}

	if (this.starred())
	{
		aHas.push('flag');
	}

	if (0 < aHas.length)
	{
		aResult.push('has:' + aHas.join(','));
	}

	if (-1 < this.selectedDateValue())
	{
		aResult.push('date:' + moment().subtract('days', this.selectedDateValue()).format('YYYY.MM.DD') + '/');
	}

	if (sText && '' !== sText)
	{
		aResult.push('text:' + this.buildSearchStringValue(sText));
	}

	return Utils.trim(aResult.join(' '));
};

PopupsAdvancedSearchViewModel.prototype.clearPopup = function ()
{
	this.from('');
	this.to('');
	this.subject('');
	this.text('');

	this.selectedDateValue(-1);
	this.hasAttachments(false);
	this.starred(false);
	this.unseen(false);

	this.fromFocus(true);
};

PopupsAdvancedSearchViewModel.prototype.onShow = function ()
{
	this.clearPopup();
	
	this.fromFocus(true);
};

PopupsAdvancedSearchViewModel.prototype.onBuild = function ()
{
	var self = this;
	$window.on('keydown', function (oEvent) {
		var bResult = true;
		if (oEvent && Enums.EventKeyCode.Esc === oEvent.keyCode && self.modalVisibility())
		{
			kn.delegateRun(self, 'cancelCommand');
			bResult = false;
		}
		return bResult;
	});
};
