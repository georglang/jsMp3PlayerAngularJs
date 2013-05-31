define(['jQuery'], function($) {

	var DragableItem = function (model) {

		this.dragSrcEl = null;
		this.dragTarget = 0; //ablegeziel
		this.insertAfter = true;
		this.fromTracklistOrderIndex = null;
		this.toTracklistOrderIndex = null;

		model.setCurrentTrackIdIndexOrder(0);
		model.pause();
	

		function handleDragStart(e) {
			
			this.style.opacity = '0.4';

			dragSrcEl = this;
			fromTracklistOrderIndex = $(dragSrcEl).index();
			console.log("fromIndex =", fromTracklistOrderIndex);

			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', this.innerHTML);
			$('#tracklist').append('<div class="singleTrack></div>');
		}

		function handleDrop(e) {

			if (e.stopPropagation) {
				e.stopPropagation(); // Stop browser redirection.
			}

			var startElement = $(dragSrcEl).detach(); //detach gleiche wie remove, nur das daten bleiben erhalten +=
			
			if(insertAfter)
				startElement.insertAfter(dragTarget); //fuegt nach element ein, ueber das gedragt wird
			else
				startElement.insertBefore(dragTarget);//fuegt vor element ein, ueber das gedragt wird

			toTracklistOrderIndex = $(startElement).index();
			console.log("toIndex =", toTracklistOrderIndex);
			model.moveTrackInList(fromTracklistOrderIndex, toTracklistOrderIndex);

			return false;
		}
	
		function handleDragOver(e) {
		  if (e.preventDefault) {
		    e.preventDefault(); 
		  }

		  e.dataTransfer.dropEffect = 'move';

		  	//mouseposition y von aktuellem event, ermittelt ob vorher oder nachher eingefuegt wird
		    if (window.event.pageY > ($(window.event.target).offset().top + $(window.event.target).height() / 2)) {
				insertAfter = true;
				$(window.event.target).addClass('insertAfter');
				$(window.event.target).removeClass('insertBefore');
			} 
			else {
				insertAfter = false;
				$(window.event.target).addClass('insertBefore');
				$(window.event.target).removeClass('insertAfter');
			}
		  return false;
		}

		function handleDragEnter(e) {
			dragTarget = $(this); //aktuelles element über das gehovert wird
		}

		function handleDragLeave(e) {
			$('.singleTrack').each(function(){
				$(this).removeClass('insertAfter insertBefore');
			});
		}

		function handleDragEnd(){
			$('.singleTrack').each(function(){
				$(this).removeClass('insertAfter insertBefore');
			});
			this.style.opacity = '1.0';
		}

		var cols = document.querySelectorAll('#tracklist .singleTrack');
		[].forEach.call(cols, function(col) {
		  col.addEventListener('dragstart', handleDragStart, false);
		  col.addEventListener('dragenter', handleDragEnter, false)
		  col.addEventListener('dragover', handleDragOver, false);
		  col.addEventListener('dragleave', handleDragLeave, false);
		  col.addEventListener('dragend', handleDragEnd, false);
		});

		var tacklistQuery = document.querySelectorAll('#tracklist');
		[].forEach.call(cols, function(col) {
			col.addEventListener('drop', handleDrop, false);
		});

		model.setCurrentTrackIdIndexOrder(0);
		model.pause();
		};//DragableItem

	return DragableItem;
});