playerApp.directive('digitalclock', [function() {
	return {
		restrict: 'E',
		scope: {
			mHours: '@hours',
			mMinutes: '@minutes',
			mSeconds: '@seconds'
		},
		link: function ($scope, element, attrs) {
			$scope.$watch('mHours', function(hours) {
				$scope.hours = $scope.format(hours);
			});
			$scope.$watch('mMinutes', function(minutes) {
				$scope.minutes = $scope.format(minutes);
			});
			$scope.$watch('mSeconds', function(seconds) {
				$scope.seconds = $scope.format(seconds);
			});
		},
		controller: function($scope) {
			$scope.format = function (value) {
				return (value < 10 ? '0' + value : value);
			};
		}
	};
}]);


playerApp.directive('playercontrols', [function() {
	return {
		restrict: 'E',
		
		link: function ($scope, element, attrs) {
			
		},

		controller: function($scope) {
			$scope.playactive = function() {
				$("#play > i").addClass("icon-white");
				$("#stop > i").removeClass("icon-white");
				$("#pause > i").removeClass("icon-white");
				$scope.play();
			};
			$scope.stopactive = function() {
				$("#play > i").removeClass("icon-white");
				$("#pause > i").removeClass("icon-white");
				$("#stop > i").addClass("icon-white");
				$scope.stop();
			};
			$scope.pauseactive = function() {
				$("#pause > i").addClass("icon-white");
				$("#play > i").removeClass("icon-white");
				$("#stop > i").removeClass("icon-white");
				$scope.pause();
			};

		},

		templateUrl: 'template/playerControls.html',
		replace: true
	};
}]);


playerApp.directive('timeline', [function() {
	return {
		restrict: 'E',
		
		link: function ($scope, element, attrs) {
			var slider = $('#timeline');
			var sliderComponent = new components.HSlider({
	            view:slider,
	            min:parseFloat(0),
	            max:parseFloat(slider.attr('data-max')),
	            value:parseFloat(slider.attr('data-value'))
	        });


			$(sliderComponent).on('change',function(){
			 	$scope.audio.currentTime = sliderComponent.getValue();
			});

			$scope.durationChange = function(){
				sliderComponent.setMax($scope.audio.duration);
			}

			$scope.timeUpdate = function(currentTime) {
				sliderComponent.setValue(currentTime, false);

					var currentTime = $('#currentTime');
		    var s = parseInt($scope.audio.currentTime % 60);
		    var m = parseInt($scope.audio.currentTime / 60);

		    if (s < 10 && m > 10) {
		        currentTime.html(m + ':0' + s);
		    }		    
		    else if(s > 10 && m < 10){
		        currentTime.html('0' + m + ':' + s);
		    }
		    else if(s < 10 && m < 10){
		        currentTime.html('0' + m + ':0' + s);
		    }
		    else {
		        currentTime.html(m + ':' + s);
		    }
		    var remainingTime = $('#remaningTime');
		    var s = parseInt(($scope.audio.duration -  $scope.audio.currentTime) % 60);
		    var m = parseInt(($scope.audio.duration -  $scope.audio.currentTime) / 60);
		    if(!isNaN(s) && !isNaN(m) ){
			    if (s < 10 && m > 10) {
			        remainingTime.html('  /  -' +m + ':0' + s);
			    }		    
			    else if(s > 10 && m < 10){
			        remainingTime.html('  /  -' +'0' + m + ':' + s);
			    }
			    else if(s < 10 && m < 10){
			        remainingTime.html('  /  -' +'0' + m + ':0' + s);
			    }
			    else {
			       remainingTime.html('  /  -' +m + ':' + s);
			    }
			}
			}
		},

		controller: function($scope) {
		
			$scope.shuffleSong = function(){
				if(!$scope.shuffle){
					$scope.shuffledTracklistOrder = _.shuffle($scope.tracklistOrder);
					$("#shuffle > i").addClass("icon-white");
				}
				else{
					$("#shuffle > i").removeClass("icon-white");
				}

				$scope.shuffle = !$scope.shuffle;
			}
		
		},

		templateUrl: 'template/timeline.html',
		replace: true
	};
}]);

playerApp.directive('volumeslider', [function() {
	return {
		restrict: 'E',
		
		link: function ($scope, element, attrs) {
			var slider = $('#volumeSlider');
			var sliderComponent = new components.HSlider({
	            view:slider,
	            min:parseFloat(slider.attr('data-min')),
	            max:parseFloat(slider.attr('data-max')),
	            value:parseFloat(slider.attr('data-value'))
	        });

			//aendern der lautstaerke
	        $(sliderComponent).on("change", function(event){
				volume = this.getValue();
				$scope.changeVolume(volume);
			});
		},

		templateUrl: 'template/volumeSlider.html',
		replace: true
	};
}]);


playerApp.directive('tracklistinfo', [function() {
	return {
		restrict: 'E',
		
		link: function ($scope, element, attrs) {
			
		},

		controller: function($scope){
			$scope.changeTrack = function() {
				$('#trackInfo .marquee').html(
	 			 $scope.getTrackArtist() +" - "+ $scope.getTrackTitle() +" - "+
				 $scope.getTrackAlbum() +" - "+  $scope.getTrackGenre()
				);
			}
		},

		templateUrl: 'template/tracklistinfo.html',
		replace: true
	};
}]);

playerApp.directive('tracklist', [function() {
	return {
		restrict: 'E',
		
		link: function ($scope, element, attrs) {
			var tracklistOrder = 0;
			var currentTrackId = 0;

			var dragableItemsArray = [];

			$scope.getTracklist();
			tracklistOrder = $scope.tracklistOrder;

			//einfuegen der einzelnen Tracks in Trackliste
			for(var i=0; i<tracklistOrder.length; i++){
				insertTracklistItem(i, tracklistOrder);
			}

			function insertTracklistItem(i, tracklistOrder){
				var trackId = tracklistOrder[i];
				var tracklist = $("<div id='track"+ trackId + "'" + "dragable='true'" + "class='singleTrack'" + ">" + $scope.getTrackTitleById(trackId) + "</div>");
				$('#tracklist').append(tracklist);
				
				tracklist.dblclick(function(e) {
					console.log('TRACKID',trackId);
				  	$scope.setCurrentTrackId(trackId);
				});
			}

			//markiert ersten Tack
			$('#track0').addClass('activeTrack');

			//aktuellen gewaehlten Track markieren
		 },
		 controller: function($scope){
		 	$scope.changeTrackMark = function(){
				currentTrackId = $scope.getCurrentTrackId();
			  	$('#tracklist > div').removeClass('activeTrack');
				$('#track'+ this.currentTrackId).addClass('activeTrack');
			}
		 },

		templateUrl: 'template/tracklist.html',
		replace: true
	};
}]);

playerApp.directive('dragableitem', [function() {
	return {
		restrict: 'E',
		
		link: function ($scope, element, attrs) {
			var dragSrcEl = null;
			var dragTarget = 0; //ablegeziel
			var insertAfter = true;
			var fromTracklistOrderIndex = null;
			var toTracklistOrderIndex = null;

			$scope.setCurrentTrackIdIndexOrder(0);
			$scope.pause();
		},

		controller: function($scope) {
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
				$scope.moveTrackInList(fromTracklistOrderIndex, toTracklistOrderIndex);

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

			$scope.setCurrentTrackIdIndexOrder(0);
			$scope.pause();			
		},

			templateUrl: 'template/dragableItem.html',
			replace: true
		};
	}]);